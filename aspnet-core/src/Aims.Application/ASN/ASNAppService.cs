using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Collections.Extensions;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Aims.ASN.Exporting;
using Aims.Authorization.Roles;
using Aims.Authorization.Users;
using Aims.Configuration;
using Aims.Dto;
using Aims.Organizations.Dto;
using Aims.PO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aims.ASN
{
    public class ASNAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<ASN.Details, long> _asnDetailsDapperRepository;
        private readonly IDapperRepository<ASN.Container, long> _asnCasesDapperRepository;
        private readonly IDapperRepository<ASN.Header, long> _asnHeaderDapperRepository;
        private readonly IDapperRepository<ASN.Lookup, long> _asnLookupDapperRepository;
        private readonly IDapperRepository<PO.Header, long> _pOHeaderDapperRepository;
        private readonly IASNListExcelExporter _asnListExcelExporter;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public ASNAppService
        (
            IDapperRepository<ASN.Details, long> asnDetailsDapperRepository,
            IDapperRepository<ASN.Container, long> asnCasesDapperRepository,
            IDapperRepository<ASN.Header, long> asnHeaderDapperRepository,
            IDapperRepository<ASN.Lookup, long> asnLookupDapperRepository,
            IDapperRepository<PO.Header, long> pOHeaderDapperRepository,
            IASNListExcelExporter asnListExcelExporter,
            IWebHostEnvironment env
        )
        {
            _asnDetailsDapperRepository = asnDetailsDapperRepository;
            _asnCasesDapperRepository = asnCasesDapperRepository;
            _asnHeaderDapperRepository = asnHeaderDapperRepository;
            _asnLookupDapperRepository = asnLookupDapperRepository;
            _pOHeaderDapperRepository = pOHeaderDapperRepository;
            _asnListExcelExporter = asnListExcelExporter;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public async Task<PagedResultDto<ASNMasterDto>> GetASNListingAsync(GetASNMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_asn_getASNList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @POFilter = '{input.POFilter}',
                                @ASNFilter = '{input.ASNFilter}',
                                @CustomerFilter = '{input.CustomerFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var selectQuery = $@"EXEC [dbo].[doc_asn_getASNList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @POFilter = '{input.POFilter}',
                                @ASNFilter = '{input.ASNFilter}',
                                @CustomerFilter = '{input.CustomerFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var counts = _asnHeaderDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<ASNMasterDto>>(counts);

            var asnList = _asnHeaderDapperRepository.Query(selectQuery);

            var asnListDto = ObjectMapper.Map<List<ASNMasterDto>>(asnList);

            return new PagedResultDto<ASNMasterDto>(countDto.Count, asnListDto);
        }

        public async Task<FileDto> ExportASNListingAsync(GetASNMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var selectQuery = $@"EXEC [dbo].[doc_asn_getASNList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @POFilter = '{input.POFilter}',
                                @ASNFilter = '{input.ASNFilter}',
                                @CustomerFilter = '{input.CustomerFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var asnList = _asnHeaderDapperRepository.Query(selectQuery);

            var asnListDto = ObjectMapper.Map<List<ASNMasterDto>>(asnList);

            return _asnListExcelExporter.ExportToFile(asnListDto);
        }

        public async Task<ASNMasterDto> GetASNInfoByIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_getASNInfoById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var asnInfo = _asnHeaderDapperRepository.Query(selectQuery);

            var asnInfoDto = ObjectMapper.Map<List<ASNMasterDto>>(asnInfo);

            return asnInfoDto[0];
        }

        public async Task<PagedResultDto<ASNFormatDto>> GetASNFormatsAsync(GetASNFormatInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_asn_getASNFormats]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}'
                               ";

            var counts = _asnLookupDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<ASNFormatDto>>(counts);

            var selectQuery = $@"EXEC [dbo].[doc_asn_getASNFormats]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}'
                               ";

            var asnFormats = _asnLookupDapperRepository.Query(selectQuery);

            var asnFormatsDto = ObjectMapper.Map<List<ASNFormatDto>>(asnFormats);

            return new PagedResultDto<ASNFormatDto>(countDto.Count, asnFormatsDto);
        }

        public async Task<ASNFormatDto> GetASNFormatByIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_getASNFormatById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var asnFormat = _asnLookupDapperRepository.Query(selectQuery);

            var asnFormatDto = ObjectMapper.Map<List<ASNFormatDto>>(asnFormat);

            return asnFormatDto[0];
        }

        public async Task<PagedResultDto<ASNCaseDto>> GetASNCasesByIdAsync(GetASNCaseInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_asn_getASNCases]
                                @CountMode = 1,
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var counts = _asnCasesDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<ASNCaseDto>>(counts);

            var selectQuery = $@"EXEC [dbo].[doc_asn_getASNCases]
                                @CountMode = 0,
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var asnCases = _asnCasesDapperRepository.Query(selectQuery);

            var asnCasesDto = ObjectMapper.Map<List<ASNCaseDto>>(asnCases);

            return new PagedResultDto<ASNCaseDto>(countDto.Count, asnCasesDto);
        }

        public async Task<ASNCaseDto> GetASNCaseInfoByIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_getASNCaseById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var asnCase = _asnCasesDapperRepository.Query(selectQuery);

            var asnCaseDto = ObjectMapper.Map<List<ASNCaseDto>>(asnCase);

            return asnCaseDto[0];
        }

        public async Task<PagedResultDto<ASNDetailDto>> GetASNDetailsByIdAsync(GetASNDetailInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_asn_getASNDetails]
                                @CountMode = 1,
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var counts = _asnDetailsDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<ASNDetailDto>>(counts);

            var selectQuery = $@"EXEC [dbo].[doc_asn_getASNDetails]
                                @CountMode = 0,
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var asnDetais = _asnDetailsDapperRepository.Query(selectQuery);

            var asnDetailsDto = ObjectMapper.Map<List<ASNDetailDto>>(asnDetais);

            return new PagedResultDto<ASNDetailDto>(countDto.Count, asnDetailsDto);
        }

        public async Task<ASNDetailDto> GetASNDetailInfoByCaseIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_getASNDetailByCaseId]
                                @CaseId = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var asnDetail = _asnDetailsDapperRepository.Query(selectQuery);

            var asnDetailDto = ObjectMapper.Map<List<ASNDetailDto>>(asnDetail);

            return asnDetailDto[0];
        }

        public async Task<ListResultDto<ASNDetailDto>> GetASNDetailsByCaseIdAsync(long Id)
        {
            List<ASNDetailDto> list = new List<ASNDetailDto>();

            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_getASNDetailByCaseId]
                                @CaseId = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var result = _asnDetailsDapperRepository.Query(selectQuery);

            list = ObjectMapper.Map<List<ASNDetailDto>>(result);

            return new ListResultDto<ASNDetailDto>(list);
        }

        public ListResultDto<POMasterDto> GetPONoList()
        {
            List<POMasterDto> list = new List<POMasterDto>();

            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var selectQuery = $@"EXEC [dbo].[doc_asn_getPONoList]
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var result = _pOHeaderDapperRepository.Query(selectQuery);

            list = ObjectMapper.Map<List<POMasterDto>>(result);

            return new ListResultDto<POMasterDto>(list);
        }

        public async Task<PagedResultDto<NameValueDto>> GetCarriers()
        {
            string _tenantStatement = $@" u.TenantId = {AbpSession.TenantId} ";
            string _roletenantStatement = $@" TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " u.TenantId IS NULL ";
                _roletenantStatement = " TenantId IS NULL ";
            }

            var selectQuery = $@"SELECT u.Id, u.UserName AS udf01 from AbpUsers u 
                                 JOIN AbpUserRoles ur ON u.Id = ur.UserId
                                 WHERE {_tenantStatement} 
                                 AND ur.RoleId = (SELECT TOP 1 Id FROM AbpRoles WHERE {_roletenantStatement} AND DisplayName = 'Transporter')
                               ";

            var result = _pOHeaderDapperRepository.Query(selectQuery);

            return new PagedResultDto<NameValueDto>(
                result.Count(),
                result.Select(u =>
                    new NameValueDto(
                        u.udf01.ToString(),
                        u.udf01.ToString()
                    )
                ).ToList()
            );
        }

        public async Task CreateASNAsync(GetASNMasterInput input)
        {
            //CheckASNNoIfAlreadyExists(input.poNo, input.asnNo);

            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_createNewASN]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @PONo = '{input.poNo}',
                                  @DeliveryDate = '{input.expectedArriveTime1}',
                                  @CarrierName = '{input.carrierName}',
                                  @FormatId = {input.FormatId}
                                  ";

            await _asnHeaderDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task EditASNAsync(GetASNMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_editASN]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {input.id},
                                  @DeliveryDate = '{input.expectedArriveTime1}',
                                  @CarrierName = '{input.carrierName}'
                                  ";

            await _asnHeaderDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task confirmDeleteAsync(GetASNMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_confirmDelete]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {input.id}
                                  ";

            await _asnHeaderDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task<ASNMasterDto> GetConfirmShipValidationAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_confirmShip_validation]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {Id}
                                ";

            var result = _asnHeaderDapperRepository.Query(selectQuery);

            var msg = ObjectMapper.Map<List<ASNMasterDto>>(result);

            return msg[0];
        }

        public async Task confirmShipAsync(GetASNMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var user = UserManager.FindByIdAsync(AbpSession.UserId.ToString());

            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            string selectOrderQuery = $@"EXEC [dbo].[doc_asn_getASNInfoById]
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var header = new ASNMasterDto();

            SqlCommand command = new SqlCommand(selectOrderQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    header.Id = (int)reader["id"];
                    header.asnNo = reader["asnNo"].ToString();
                    header.asnType = reader["asnType"].ToString();
                    header.poNo = reader["poNo"].ToString();
                    header.organizationId = reader["organizationId"].ToString();
                    header.customerId = reader["customerId"].ToString();
                    header.warehouseId = reader["warehouseId"].ToString();
                    header.supplierId = reader["supplierId"].ToString();
                    header.asnStatus = reader["udf01"].ToString();
                    header.expectedArriveTime1ToString = ((DateTime)reader["expectedArriveTime1"]).ToString("yyyy-MM-dd HH:mm:ss");
                    header.carrierName = reader["carrierName"].ToString();
                    header.creationTimeToString = ((DateTime)reader["CreationTime"]).ToString("yyyy-MM-dd HH:mm:ss");

                    //default value
                    header.createSource = reader["createSource"].ToString();
                    header.byTrace_Flag = reader["byTrace_Flag"].ToString();
                    header.reserve_Flag = reader["reserve_Flag"].ToString();
                    header.currentVersion = (int)reader["currentVersion"];
                    header.warehouseTransferFlag = reader["warehouseTransferFlag"].ToString();
                    header.oprSeqFlag = reader["oprSeqFlag"].ToString();
                }
            }

            string selectCasesQuery = $@"EXEC [dbo].[doc_asn_getASNCases]
                                @CountMode = 1,
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = ' Id ASC ', 
		                        @SkipCount = 0,
		                        @MaxResultCount = 0
                               ";

            var cases = new List<ASNCaseDto>();

            command = new SqlCommand(selectCasesQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new ASNCaseDto();

                    row.Id = (int)reader["id"];
                    row.ctnNo = reader["ctnNo"].ToString();
                    row.ctnLineNo = (int)reader["ctnLineNo"];
                    row.ctnType = reader["udf01"].ToString();
                    row.ctnSize = reader["ctnSize"].ToString();
                    row.ctnGrossWeight = (decimal)reader["ctnGrossWeight"];
                    row.ctnSealNo1 = reader["ctnSealNo1"].ToString();
                    row.creationTimeToString = ((DateTime)reader["CreationTime"]).ToString("yyyy-MM-dd HH:mm:ss");

                    cases.Add(row);
                }
            }

            string selectDetailsQuery = $@"EXEC [dbo].[doc_asn_getASNDetailByASNId]
                                @Id = {input.id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var details = new List<ASNDetailDto>();

            command = new SqlCommand(selectDetailsQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new ASNDetailDto();

                    row.Id = (int)reader["id"];
                    row.asnLineNo = (int)reader["asnLineNo"];
                    row.sku = reader["sku"].ToString();
                    row.skuDescr = reader["skuDescr"].ToString();
                    row.poLineNo = (int)reader["poLineNo"];
                    row.expectedQty = (decimal)reader["expectedQty"];
                    row.receivedQty = (decimal)reader["receivedQty"];
                    row.lotAtt01 = reader["lotAtt01"].ToString();
                    row.expiryDateToString = reader["expiryDate"] != DBNull.Value ? ((DateTime)reader["expiryDate"]).ToString("yyyy-MM-dd HH:mm:ss") : null;
                    row.creationTimeToString = ((DateTime)reader["CreationTime"]).ToString("yyyy-MM-dd HH:mm:ss");


                    //default value
                    row.lineStatus = reader["lineStatus"].ToString();
                    row.customerId = reader["customerId"].ToString();
                    row.packId = reader["packId"].ToString();
                    row.packUom = reader["packUom"].ToString();
                    row.expectedQty_Each = (decimal)reader["expectedQty_Each"];
                    row.expectedQty_Each = (decimal)reader["receivedQty_Each"];

                    details.Add(row);
                }
            }

            conn.Close();

            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            /*
            MySqlCommand comm2 = conn2.CreateCommand();

            comm2.CommandText = $@"
	                                INSERT INTO doc_asn_header (addTime, addWho, organizationId, warehouseId, asnNo, asnType, asnStatus,
                                    customerId, asnCreationTime, expectedArriveTime1, expectedArriveTime2, asnReference1, poNo, createSource, byTrace_Flag,
                                    reserve_Flag, supplierId, currentVersion,  oprSeqFlag, warehouseTransferFlag)
	                                VALUES (NOW(), '{user.Result.UserName}', '{header.organizationId}', '{header.warehouseId}', '{header.asnNo}', '{header.asnType}', '{header.asnStatus}', 
                                    '{header.customerId}', '{header.creationTimeToString}', '{header.expectedArriveTime1ToString}', null, null, '{header.poNo}', '{header.createSource}', '{header.byTrace_Flag}',
                                    '{header.reserve_Flag}', '{header.supplierId}', {header.currentVersion}, '{header.oprSeqFlag}', '{header.warehouseTransferFlag}');
                               ";
            */

            conn2.Open();

            MySqlCommand comm2 = new MySqlCommand("OCTOPUS_ASN_HEADER_INSERT", conn2);
            comm2.CommandType = CommandType.StoredProcedure;
            comm2.Parameters.AddWithValue("_addWho", user.Result.UserName);
            comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
            comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
            comm2.Parameters.AddWithValue("_asnNo", header.asnNo);
            comm2.Parameters.AddWithValue("_asnType", header.asnType);
            comm2.Parameters.AddWithValue("_asnStatus", header.asnStatus);
            comm2.Parameters.AddWithValue("_customerId", header.customerId);
            comm2.Parameters.AddWithValue("_creationTime", header.CreationTime);
            comm2.Parameters.AddWithValue("_expectedArrivalTime1", header.expectedArriveTime1);
            comm2.Parameters.AddWithValue("_poNo", header.poNo);
            comm2.Parameters.AddWithValue("_createSource", header.createSource);
            comm2.Parameters.AddWithValue("_byTrace_Flag", header.byTrace_Flag);
            comm2.Parameters.AddWithValue("_reserver_Flag", header.reserve_Flag);
            comm2.Parameters.AddWithValue("_supplierId", header.supplierId);
            comm2.Parameters.AddWithValue("_currentVersion", header.currentVersion);
            comm2.Parameters.AddWithValue("_oprSeqFlag", header.oprSeqFlag);
            comm2.Parameters.AddWithValue("_warehouseTransferFlag", header.warehouseTransferFlag);

            // conn2.Open();

            await comm2.ExecuteNonQueryAsync();

            // conn2.Close();

            string output = JsonConvert.SerializeObject(cases);

            File.WriteAllText(@"C:\inetpub\wwwroot\octopus_api\App_Data\Cases.txt", output);

            foreach (ASNCaseDto _case in cases)
            {
                //conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

                /*
                comm2 = conn2.CreateCommand();

                comm2.CommandText = $@"
	                                INSERT INTO doc_asn_container (addTime, addWho, organizationId, warehouseId, asnNo, ctnNo, ctnType, ctnSize, ctnGrossWeight, ctnSealNo1, currentVersion, oprSeqFlag)
	                                VALUES (Now(), '{user.Result.UserName}', '{header.organizationId}', '{header.warehouseId}', '{header.asnNo}', '{_case.ctnNo}', '{_case.ctnType}', '{_case.ctnSize}', {_case.ctnGrossWeight}, '{_case.ctnSealNo1}', {header.currentVersion}, '{header.oprSeqFlag}')
                               ";
                */

                comm2 = new MySqlCommand("OCTOPUS_ASN_CONTAINER_INSERT", conn2);
                comm2.CommandType = CommandType.StoredProcedure;
                comm2.Parameters.AddWithValue("_addWho", user.Result.UserName);
                comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
                comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
                comm2.Parameters.AddWithValue("_asnNo", header.asnNo);
                comm2.Parameters.AddWithValue("_ctnNo", _case.ctnNo);
                comm2.Parameters.AddWithValue("_ctnType", _case.ctnType);
                comm2.Parameters.AddWithValue("_ctnSize", _case.ctnSize);
                comm2.Parameters.AddWithValue("_ctnGrossWeight", _case.ctnGrossWeight);
                comm2.Parameters.AddWithValue("_ctnSealNo1", _case.ctnSealNo1);
                comm2.Parameters.AddWithValue("_currentVersion", header.currentVersion);
                comm2.Parameters.AddWithValue("_oprSeqFlag", header.oprSeqFlag);

                // conn2.Open();

                await comm2.ExecuteNonQueryAsync();

                // conn2.Close();
            }

            File.WriteAllText(@"C:\inetpub\wwwroot\octopus_api\App_Data\Details.txt", output);

            foreach (ASNDetailDto detail in details)
            {
                DateTime tempDate;
                string expiry_date = "null";

                if (detail.expiryDate != null)
                {
                    tempDate = (DateTime)detail.expiryDate;
                    expiry_date = "'" + tempDate.ToString("yyyy-mm-dd") + "'";
                }

                //conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

                /*

                comm2 = conn2.CreateCommand();

                comm2.CommandText = $@"
	                                INSERT INTO doc_asn_details (addTime, addWho, organizationId, warehouseId, asnNo, asnLineNo, customerId, sku,
                                    skuDescr, poNo, poLineNo, lineStatus, expectedQty, expectedQty_Each, totalCubic, totalGrossWeight, totalNetWeight, packId, packUom, containerId, currentVersion, oprSeqFlag, lotAtt01)
	                                VALUES (Now(), '{user.Result.UserName}', '{header.organizationId}', '{header.warehouseId}', '{header.asnNo}', {detail.asnLineNo}, '{detail.customerId}', '{detail.sku}', 
                                    '{detail.skuDescr}', '{header.poNo}', {detail.poLineNo}, '{detail.lineStatus}', {detail.expectedQty}, {detail.expectedQty_Each}, 0,0,0, '{detail.packId}', '{detail.packUom}', '{detail.containerId}', {header.currentVersion}, '{header.oprSeqFlag}',{expiry_date});
                               ";
                */

                comm2 = new MySqlCommand("OCTOPUS_ASN_DETAIL_INSERT", conn2);
                comm2.CommandType = CommandType.StoredProcedure;
                comm2.Parameters.AddWithValue("_addWho", user.Result.UserName);
                comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
                comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
                comm2.Parameters.AddWithValue("_asnNo", header.asnNo);
                comm2.Parameters.AddWithValue("_asnLineNo", detail.asnLineNo);
                comm2.Parameters.AddWithValue("_customerId", string.IsNullOrEmpty(detail.customerId) ? "" : detail.customerId);
                comm2.Parameters.AddWithValue("_sku", detail.sku);
                comm2.Parameters.AddWithValue("_skuDescr", detail.skuDescr);
                comm2.Parameters.AddWithValue("_poNo", header.poNo);
                comm2.Parameters.AddWithValue("_poLineNo", detail.poLineNo);
                comm2.Parameters.AddWithValue("_lineStatus", detail.lineStatus);
                comm2.Parameters.AddWithValue("_expectedQty", detail.expectedQty);
                comm2.Parameters.AddWithValue("_expectedQty_Each", detail.expectedQty_Each);
                comm2.Parameters.AddWithValue("_receivedQty", detail.receivedQty);
                comm2.Parameters.AddWithValue("_receivedQty_Each", detail.receivedQty_Each);
                comm2.Parameters.AddWithValue("_packId", detail.packId);
                comm2.Parameters.AddWithValue("_packUom", detail.packUom);
                comm2.Parameters.AddWithValue("_containerId", detail.containerId);
                comm2.Parameters.AddWithValue("_currentVersion", header.currentVersion);
                comm2.Parameters.AddWithValue("_oprSeqFlag", header.oprSeqFlag);
                comm2.Parameters.AddWithValue("_expiryDate", expiry_date);

                // conn2.Open();

                await comm2.ExecuteNonQueryAsync();

                // conn2.Close();
            }

            conn2.Close();

            string UpdateQuery = $@"EXEC [dbo].[doc_asn_confirmShip]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {input.id}
                                  ";

            await _asnHeaderDapperRepository.ExecuteAsync(UpdateQuery);
        }

        public async Task AddASNFormatAsync(GetASNFormatInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_addASNFormat]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Prefix = '{input.Prefix}',
                                  @HasDate = {input.HasDate}
                                  ";

            await _asnLookupDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task EditASNFormatAsync(GetASNFormatInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_editASNFormat]
                                  @Id = {input.id},
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Prefix = '{input.Prefix}',
                                  @HasDate = {input.HasDate}
                                  ";

            await _asnLookupDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task<long> GetIdFromAddCaseAsync(GetASNCaseInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_addNewCase]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @Id = {input.id},
		                          @CaseType = '{input.ctnType}',
		                          @CaseVolume = '{input.ctnSize}',
                                  @CaseWeight = {input.ctnGrossWeight},
                                  @CaseSealNo = '{input.ctnSealNo1}'
                                  ";

            var result = await _asnCasesDapperRepository.QueryAsync(InsertQuery);

            return result.FirstOrDefault().Id;
        }

        public async Task AddLineItemForCaseAsync(GetASNDetailInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_addLineItemForCase]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @CaseId = {input.ctnId},
                                  @ASNNo = '{input.asnNo}',
		                          @ItemNumber = '{input.sku}',
		                          @Description = '{input.skuDescr}',
                                  @POQty = {input.expectedQty},
                                  @ASNQty = {input.orderedQty}
                                  ";
            //@ExpiryDate = '{input.expiryDate}'

            await _asnDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task EditCaseAsync(GetASNCaseInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_editCase]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @Id = {input.id},
		                          @CaseType = '{input.ctnType}',
		                          @CaseVolume = '{input.ctnSize}',
                                  @CaseWeight = {input.ctnGrossWeight},
                                  @CaseSealNo = '{input.ctnSealNo1}'
                                  ";

            await _asnCasesDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task AddLineItemAsync(GetASNDetailInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string _expiryDate = $@"@ExpiryDate = NULL ";

            if (input.expiryDate != null)
            {
                _expiryDate = $@"@ExpiryDate = '{input.expiryDate}' ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_addNewLineItem]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @ASNNo = '{input.asnNo}',
		                          @ItemNumber = '{input.sku}',
		                          @Description = '{input.skuDescr}',
                                  @POQty = {input.expectedQty},
                                  @ASNQty = {input.orderedQty},
                                  @CaseQty = {input.containerQty},
                                  @LotNumber = '{input.lotAtt01}',
                                  {_expiryDate}
                                  ";
            //@ExpiryDate = '{input.expiryDate}'

            await _asnDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task EditLineItemAsync(GetASNDetailInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string _expiryDate = $@"@ExpiryDate = NULL ";

            if (input.expiryDate != null)
            {
                _expiryDate = $@"@ExpiryDate = '{input.expiryDate}' ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_editLineItem]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @Id = {input.id},
		                          @ItemNumber = '{input.sku}',
		                          @Description = '{input.skuDescr}',
                                  @POQty = {input.expectedQty},
                                  @ASNQty = {input.orderedQty},
                                  @CaseQty = {input.containerQty},
                                  @LotNumber = '{input.lotAtt01}',
                                  {_expiryDate}
                                  ";
            //@ExpiryDate = '{input.expiryDate}'

            await _asnDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task confirmDeleteCaseAsync(GetASNCaseInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_asn_confirmDeleteCase]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {input.id}
                                  ";

            await _asnCasesDapperRepository.ExecuteAsync(InsertQuery);
        }

        private void CheckASNNoIfAlreadyExists(string poNo, string asnNo)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_asn_checkDuplicatedASN]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @PONo = '{poNo}',
		                          @ASNNo = '{asnNo}'
                                  ";

            var asnList = _asnHeaderDapperRepository.Query(selectQuery);

            var entity = ObjectMapper.Map<List<ASNMasterDto>>(asnList);

            if (entity.Count <= 0)
            {
                return;
            }

            throw new UserFriendlyException(L("ThisASNIsAlreadyExists"));
        }
    }
}
