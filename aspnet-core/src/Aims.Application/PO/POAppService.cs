using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Aims.Configuration;
using Aims.TransferOrders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aims.PO
{
    public class POAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<PO.Details, long> _pODetailsDapperRepository;
        private readonly IDapperRepository<PO.Header, long> _pOHeaderDapperRepository;
        private readonly IDapperRepository<PO.HostDetail, long> _pOHostDetailsDapperRepository;
        private readonly IDapperRepository<PO.HostHeader, long> _pOHostHeaderDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public POAppService
        (
            IDapperRepository<PO.Details, long> pODetailsDapperRepository,
            IDapperRepository<PO.Header, long> pOHeaderDapperRepository,
            IDapperRepository<PO.HostDetail, long> pOHostDetailsDapperRepository,
            IDapperRepository<PO.HostHeader, long> pOHostHeaderDapperRepository,
            IWebHostEnvironment env
        )
        {
            _pODetailsDapperRepository = pODetailsDapperRepository;
            _pOHeaderDapperRepository = pOHeaderDapperRepository;
            _pOHostDetailsDapperRepository = pOHostDetailsDapperRepository;
            _pOHostHeaderDapperRepository = pOHostHeaderDapperRepository;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public async Task<PagedResultDto<POMasterDto>> GetPOListing(GetPOMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_po_getPOList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @POFilter = '{input.POFilter}',
                                @CustomerFilter = '{input.CustomerFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @DeliverToFilter = '{input.DeliverToFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var selectQuery = $@"EXEC [dbo].[doc_po_getPOList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @POFilter = '{input.POFilter}',
                                @CustomerFilter = '{input.CustomerFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @DeliverToFilter = '{input.DeliverToFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var counts = _pOHeaderDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<POMasterDto>>(counts);

            var pOList = _pOHeaderDapperRepository.Query(selectQuery);

            var pOListDto = ObjectMapper.Map<List<POMasterDto>>(pOList);

            return new PagedResultDto<POMasterDto>(countDto.Count, pOListDto);
        }

        public async Task<POMasterDto> GetPOInfoById(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_po_getPOInfoById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var pOInfo = _pOHeaderDapperRepository.Query(selectQuery);

            var pOInfoDto = ObjectMapper.Map<List<POMasterDto>>(pOInfo);

            return pOInfoDto[0];
        }

        public async Task<ListResultDto<PODetailDto>> GetPODetailsById(GetPODetailsInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_po_getPODetails]
                                @CountMode = 1,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var counts = _pODetailsDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<PODetailDto>>(counts);

            string selectQuery = $@"EXEC [dbo].[doc_po_getPODetails]
                                @CountMode = 0,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var pODetails = _pODetailsDapperRepository.Query(selectQuery);
            var pODetailsDto = ObjectMapper.Map<List<PODetailDto>>(pODetails);

            return new PagedResultDto<PODetailDto>(countDto.Count, pODetailsDto);
        }

        public async Task<ListResultDto<PODetailDto>> GetPODetailsByPONo(string poNo)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            List<PODetailDto> list = new List<PODetailDto>();

            string selectQuery = $@"EXEC [dbo].[doc_po_getPODetailsByPONo]
                                @PONo = '{poNo}',
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var result = _pODetailsDapperRepository.Query(selectQuery);

            list = ObjectMapper.Map<List<PODetailDto>>(result);

            return new ListResultDto<PODetailDto>(list);
        }

        public async Task<ListResultDto<PODetailDto>> GetPODetailListByPONo(GetPODetailsInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_po_getPODetailListByPONo]
                                @CountMode = 1,
                                @PONo = '{input.PONo}',
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var counts = _pODetailsDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<PODetailDto>>(counts);

            string selectQuery = $@"EXEC [dbo].[doc_po_getPODetailListByPONo]
                                @CountMode = 0,
                                @PONo = '{input.PONo}',
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var pODetails = _pODetailsDapperRepository.Query(selectQuery);
            var pODetailsDto = ObjectMapper.Map<List<PODetailDto>>(pODetails);

            return new PagedResultDto<PODetailDto>(countDto.Count, pODetailsDto);
        }

        private async Task dataSyncAsync()
        {
            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            conn2.Open();

            List<POMasterDto> header_list = new List<POMasterDto>();
            List<PODetailDto> detail_list = new List<PODetailDto>();

            var selectQuery = $@" SELECT * FROM doc_po_header ";

            using (MySqlCommand cmd = new MySqlCommand(selectQuery, conn2))
            {
                //cmd.Parameters.AddWithValue("@pname", x);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    StringBuilder sb = new StringBuilder();
                    while (reader.Read())
                    {
                        var row = new POMasterDto();

                        row.organizationId = reader.GetString("organizationId");
                        row.warehouseId = reader.GetString("warehouseId");
                        row.poNo = reader.GetString("poNo");
                        row.poType = reader.GetString("poType");
                        row.poStatus = reader.GetString("poStatus");
                        row.customerId = reader.GetString("customerId");
                        row.poCreationTime = reader.GetDateTime("poCreationTime");
                        row.poReference1 = reader["poReference1"] != DBNull.Value ? reader.GetString("poReference1") : null;
                        row.supplierId = reader["supplierId"] != DBNull.Value ? reader.GetString("supplierId") : null;
                        row.supplier_Name = reader["supplier_Name"] != DBNull.Value ? reader.GetString("supplier_Name") : null;
                        row.IssuePartyId = reader["IssuePartyId"] != DBNull.Value ? reader.GetString("IssuePartyId") : null;
                        row.addTime = reader.GetDateTime("addTime"); 
                        row.addWho = reader.GetString("addWho");
                        row.editTime = reader.GetDateTime("editTime");
                        row.editWho = reader.GetString("editWho");

                        header_list.Add(row);
                    }
                }
            }

            selectQuery = $@" SELECT * FROM doc_po_details ";

            using (MySqlCommand cmd = new MySqlCommand(selectQuery, conn2))
            {
                //cmd.Parameters.AddWithValue("@pname", x);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    StringBuilder sb = new StringBuilder();
                    while (reader.Read())
                    {
                        var row = new PODetailDto();

                        row.organizationId = reader.GetString("organizationId");
                        row.warehouseId = reader.GetString("warehouseId");
                        row.poNo = reader.GetString("poNo");
                        row.poLineNo = reader.GetInt32("poLineNo");
                        row.poLineStatus = reader.GetString("poLineStatus");
                        row.customerId = reader.GetString("customerId");
                        row.sku = reader.GetString("sku");
                        row.skuDescr = reader["skuDescr"] != DBNull.Value ? reader.GetString("skuDescr") : null;
                        row.orderedQty = reader.GetDecimal("orderedQty");
                        row.receivedQty = reader.GetDecimal("receivedQty");
                        row.orderedQty_Each = reader.GetDecimal("orderedQty_Each");
                        row.receivedQty_Each = reader.GetDecimal("receivedQty_Each");
                        row.lotAtt01 = reader["lotAtt01"] != DBNull.Value ? reader.GetString("lotAtt01") : null;
                        row.packId = reader.GetString("packId");
                        row.packUom = reader.GetString("packUom");
                        row.addTime = reader.GetDateTime("addTime");
                        row.addWho = reader.GetString("addWho");
                        row.editTime = reader.GetDateTime("editTime");
                        row.editWho = reader.GetString("editWho");

                        detail_list.Add(row);
                    }
                }
            }

            conn2.Close();

            string DeleteQuery = $@"
                                    DELETE FROM doc_po_details;
                                    DELETE FROM doc_po_header;
                                  ";

            await _pOHeaderDapperRepository.ExecuteAsync(DeleteQuery);

            foreach (POMasterDto item in header_list)
            {
                string InsertQuery = $@"
                                    INSERT INTO doc_po_header (CreationTime, CreatorUserId, IsDeleted, TenantId, addWho, addTime, editWho, editTime, organizationId, warehouseId, poNo, poType, poStatus, customerId, poCreationTime, poReference1, supplierId, supplier_Name, IssuePartyId)
                                    VALUES (GETDATE(), @UserId, 0, @TenantId, @addWho, @addTime, @editWho, @editTime, @organizationId, @warehouseId, @poNo, @poType, @poStatus, @customerId, @poCreationTime, @poReference1, @supplierId, @supplier_Name, @IssuePartyId)
                                  ";

                var para = new
                {
                    TenantId = AbpSession.TenantId,
                    UserId = AbpSession.UserId,
                    organizationId = item.organizationId,
                    warehouseId = item.warehouseId,
                    poNo = item.poNo,
                    poType = item.poType,
                    poStatus = item.poStatus,
                    customerId = item.customerId,
                    poCreationTime = item.poCreationTime,
                    poReference1 = item.poReference1,
                    supplierId = item.supplierId,
                    supplier_Name = item.supplier_Name,
                    IssuePartyId = item.IssuePartyId,
                    addTime = item.addTime,
                    addWho = item.addWho,
                    editTime = item.editTime,
                    editWho = item.editWho
                };

                await _pOHeaderDapperRepository.ExecuteAsync(InsertQuery, para);
            }

            foreach (PODetailDto item in detail_list)
            {
                string InsertQuery = $@"
                                    INSERT INTO doc_po_details (CreationTime, CreatorUserId, IsDeleted, TenantId, addWho, addTime, editWho, editTime, organizationId, warehouseId, 
                                    poNo, poLineNo, poLineStatus, customerId, sku, skuDescr, orderedQty, orderedQty_Each, receivedQty, receivedQty_Each, packId, packUom, lotAtt01)
                                    VALUES (GETDATE(), @UserId, 0, @TenantId, @addWho, @addTime, @editWho, @editTime, @organizationId, @warehouseId, @poNo, @poLineNo,  @poLineStatus,  
                                    @customerId,  @sku,  @skuDescr,  @orderedQty, @orderedQty_Each, @receivedQty, @receivedQty_Each, @packId, @packUom, @lotAtt01)
                                  ";

                var para = new
                {
                    TenantId = AbpSession.TenantId,
                    UserId = AbpSession.UserId,
                    organizationId = item.organizationId,
                    warehouseId = item.warehouseId,
                    poNo = item.poNo,
                    poLineNo = item.poLineNo,
                    poLineStatus = item.poLineStatus,
                    customerId = item.customerId,
                    sku = item.sku,
                    skuDescr = item.skuDescr,
                    orderedQty = item.orderedQty,
                    receivedQty = item.receivedQty,
                    orderedQty_Each = item.orderedQty_Each,
                    receivedQty_Each = item.receivedQty_Each,
                    packId = item.packId,
                    packUom = item.packUom,
                    lotAtt01 = item.lotAtt01,
                    addTime = item.addTime,
                    addWho = item.addWho,
                    editTime = item.editTime,
                    editWho = item.editWho
                };

                await _pODetailsDapperRepository.ExecuteAsync(InsertQuery, para);
            }
        }

        public async Task TestAutoCheckPO()
        {

            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);

            conn.Open();

            string updateQuery = $@" EXEC [dbo].[doc_order_updateStatus_InTransit] ";
            using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
            {
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
            }

            string selectPOQuery = $@" SELECT * FROM doc_po_header WHERE udf01 = 'N' ";

            var headers = new List<POMasterDto>();

            SqlCommand command = new SqlCommand(selectPOQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new POMasterDto();

                    row.Id = (int)reader["id"];
                    row.organizationId = reader["organizationId"].ToString();
                    row.warehouseId = reader["warehouseId"].ToString();
                    row.poNo = reader["poNo"].ToString();
                    row.poType = reader["poType"].ToString();
                    row.poStatus = reader["poStatus"].ToString();
                    row.customerId = reader["customerId"] != DBNull.Value ? reader["customerId"].ToString() : null;
                    row.poCreationTime = (DateTime)reader["poCreationTime"];
                    row.addWho = reader["addWho"].ToString();

                    headers.Add(row);
                }
            }

            var details = new List<PODetailDto>();

            foreach (POMasterDto header in headers)
            {
                string selectDetailQuery = $@" SELECT * FROM doc_po_details WHERE poNo = '{header.poNo}' 
                                               AND organizationId = '{header.organizationId}' 
                                               AND warehouseId = '{header.warehouseId}' ";

                command = new SqlCommand(selectDetailQuery, conn);
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var row = new PODetailDto();

                        row.Id = (int)reader["id"];
                        row.organizationId = reader["organizationId"].ToString();
                        row.warehouseId = reader["warehouseId"].ToString();
                        row.poNo = reader["poNo"].ToString();
                        row.poLineNo = (int)reader["poLineNo"];
                        row.poLineStatus = reader["poLineStatus"].ToString();
                        row.customerId = reader["customerId"] != DBNull.Value ? reader["customerId"].ToString() : null;
                        row.sku = reader["sku"].ToString();
                        row.skuDescr = reader["skuDescr"] != DBNull.Value ? reader["skuDescr"].ToString() : null;
                        row.orderedQty = (decimal)reader["orderedQty"];
                        row.orderedQty_Each = (decimal)reader["orderedQty_Each"];
                        row.receivedQty = (decimal)reader["receivedQty"];
                        row.receivedQty_Each = (decimal)reader["receivedQty_Each"];
                        row.packId = reader["packId"] != DBNull.Value ? reader["packId"].ToString() : null;
                        row.packUom = reader["packUom"] != DBNull.Value ? reader["packUom"].ToString() : null;
                        row.totalCubic = (decimal)reader["totalCubic"];
                        row.totalGrossWeight = (decimal)reader["totalGrossWeight"];
                        row.totalNetWeight = (decimal)reader["totalNetWeight"];
                        row.totalPrice = (decimal)reader["totalPrice"];
                        row.lotAtt01 = reader["lotAtt01"] != DBNull.Value ? reader["lotAtt01"].ToString() : null;
                        row.addWho = reader["addWho"].ToString();

                        details.Add(row);
                    }
                }
            }

            conn.Close();

            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            foreach (POMasterDto header in headers)
            {
                conn2.Open();

                MySqlCommand comm2 = new MySqlCommand("OCTOPUS_PO_HEADER_INSERT", conn2);
                comm2.CommandType = CommandType.StoredProcedure;
                comm2.Parameters.AddWithValue("_addWho", header.addWho);
                comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
                comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
                comm2.Parameters.AddWithValue("_poNo", header.poNo);
                comm2.Parameters.AddWithValue("_customerId", string.IsNullOrEmpty(header.customerId) ? "" : header.customerId);
                comm2.Parameters.AddWithValue("_poType", header.poType);
                comm2.Parameters.AddWithValue("_poStatus", header.poStatus);
                comm2.Parameters.AddWithValue("_poCreationTime", header.poCreationTime);

                await comm2.ExecuteNonQueryAsync();

                List<PODetailDto> detail = new List<PODetailDto>(
                    details.Where(i => i.poNo == header.poNo 
                    && i.organizationId == header.organizationId 
                    && i.warehouseId == header.warehouseId).ToList()
                );

                foreach (PODetailDto item in detail)
                {
                    comm2 = new MySqlCommand("OCTOPUS_PO_DETAIL_INSERT", conn2);
                    comm2.CommandType = CommandType.StoredProcedure;
                    comm2.Parameters.AddWithValue("_addWho", item.addWho);
                    comm2.Parameters.AddWithValue("_organizationId", item.organizationId);
                    comm2.Parameters.AddWithValue("_warehouseId", item.warehouseId);
                    comm2.Parameters.AddWithValue("_poNo", item.poNo);
                    comm2.Parameters.AddWithValue("_poLineNo", item.poLineNo);
                    comm2.Parameters.AddWithValue("_poLineStatus", item.poLineStatus);
                    comm2.Parameters.AddWithValue("_customerId", string.IsNullOrEmpty(item.customerId) ? "" : item.customerId);
                    comm2.Parameters.AddWithValue("_sku", item.sku);
                    comm2.Parameters.AddWithValue("_skuDescr", item.skuDescr);
                    comm2.Parameters.AddWithValue("_orderedQty", item.orderedQty);
                    comm2.Parameters.AddWithValue("_orderedQty_Each", item.orderedQty_Each);
                    comm2.Parameters.AddWithValue("_receivedQty", item.receivedQty);
                    comm2.Parameters.AddWithValue("_receivedQty_Each", item.receivedQty_Each);
                    comm2.Parameters.AddWithValue("_packId", item.packId);
                    comm2.Parameters.AddWithValue("_packUom", item.packUom);
                    comm2.Parameters.AddWithValue("_totalCubic", item.totalCubic);
                    comm2.Parameters.AddWithValue("_totalGrossWeight", item.totalGrossWeight);
                    comm2.Parameters.AddWithValue("_totalNetWeight", item.totalNetWeight);
                    comm2.Parameters.AddWithValue("_totalPrice", item.totalPrice);
                    comm2.Parameters.AddWithValue("_lotAtt01", item.lotAtt01);

                    await comm2.ExecuteNonQueryAsync();
                }

                conn2.Close();

                conn.Open();

                updateQuery = $@" UPDATE doc_po_header SET udf01 = '99' WHERE poNo = '{header.poNo}' AND organizationId = '{header.organizationId}' AND warehouseId = '{header.warehouseId}' ";
                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecuteNonQuery();
                }

                conn.Close();
            }
        }

        public async Task TestAutoCheckPO2()
        {
            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            conn2.Open();

            List<POMasterDto> host_po_list = new List<POMasterDto>();
            List<TransferOrderStatusDto> host_order_list = new List<TransferOrderStatusDto>();

            var selectPOQuery = $@" SELECT organizationId, warehouseId, poNo, poStatus FROM doc_po_header WHERE poStatus = '99' ";

            using (MySqlCommand cmd = new MySqlCommand(selectPOQuery, conn2))
            {
                //cmd.Parameters.AddWithValue("@pname", x);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    StringBuilder sb = new StringBuilder();
                    while (reader.Read())
                    {
                        var row = new POMasterDto();

                        row.organizationId = reader.GetString("organizationId");
                        row.warehouseId = reader.GetString("warehouseId");
                        row.poNo = reader.GetString("poNo");
                        row.poStatus = reader.GetString("poStatus");

                        host_po_list.Add(row);
                    }
                }
            }

            var selectOrderQuery = $@" SELECT organizationId, warehouseId, orderNo, soStatus FROM doc_order_header WHERE poStatus = '99' ";

            using (MySqlCommand cmd = new MySqlCommand(selectOrderQuery, conn2))
            {
                //cmd.Parameters.AddWithValue("@pname", x);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    StringBuilder sb = new StringBuilder();
                    while (reader.Read())
                    {
                        var row = new TransferOrderStatusDto();

                        row.organizationId = reader.GetString("organizationId");
                        row.warehouseId = reader.GetString("warehouseId");
                        row.orderNo = reader.GetString("orderNo");
                        row.soStatus = reader.GetString("soStatus");

                        host_order_list.Add(row);
                    }
                }
            }

            conn2.Close();

            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);

            conn.Open();

            List<POMasterDto> octopus_po_list = new List<POMasterDto>();
            List<TransferOrderStatusDto> octopus_order_list = new List<TransferOrderStatusDto>();

            var selectPOQuery2 = $@" SELECT organizationId, warehouseId, poNo, poStatus FROM doc_po_header WHERE poStatus = '99' ";

            SqlCommand command = new SqlCommand(selectPOQuery2, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new POMasterDto();

                    row.organizationId = reader["organizationId"].ToString();
                    row.warehouseId = reader["warehouseId"].ToString();
                    row.poNo = reader["poNo"].ToString();
                    row.poStatus = reader["poStatus"].ToString();

                    octopus_po_list.Add(row);
                }
            }

            var selectOrderQuery2 = $@" SELECT organizationId, warehouseId, orderNo, soStatus FROM doc_order_header WHERE poStatus = '99' ";

            command = new SqlCommand(selectOrderQuery2, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new TransferOrderStatusDto();

                    row.organizationId = reader["organizationId"].ToString();
                    row.warehouseId = reader["warehouseId"].ToString();
                    row.orderNo = reader["orderNo"].ToString();
                    row.soStatus = reader["soStatus"].ToString();

                    octopus_order_list.Add(row);
                }
            }

            List<POMasterDto> po_list = new List<POMasterDto>();
            po_list = host_po_list.Except(octopus_po_list).ToList();

            foreach (POMasterDto header in po_list)
            {
                string updateQuery = $@" 
                                    EXEC [dbo].[doc_order_updateStatus_CompletedPO] 
                                    @organizationId = '{header.organizationId}',
                                    @warehouseId = '{header.warehouseId}',
                                    @poNo = '{header.poNo}',
                                    @poStatus = '{header.poStatus}'
                                   ";
                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecuteNonQuery();
                }
            }

            List<TransferOrderStatusDto> order_list = new List<TransferOrderStatusDto>();
            order_list = host_order_list.Except(octopus_order_list).ToList();

            foreach (TransferOrderStatusDto header in order_list)
            {
                string updateQuery = $@" 
                                    EXEC [dbo].[doc_order_updateStatus_CompletedOrder] 
                                    @organizationId = '{header.organizationId}',
                                    @warehouseId = '{header.warehouseId}',
                                    @orderNo = '{header.orderNo}',
                                    @soStatus = '{header.soStatus}'
                                   ";
                using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecuteNonQuery();
                }
            }

            conn.Close();
        }
    }
}