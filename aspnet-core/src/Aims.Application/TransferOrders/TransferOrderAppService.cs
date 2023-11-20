using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Aims.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace Aims.TransferOrders
{
    public class TransferOrderAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<TransferOrders.Detail, long> _orderDetailsDapperRepository;
        private readonly IDapperRepository<TransferOrders.Header, long> _orderHeaderDapperRepository;
        private readonly IDapperRepository<TransferOrders.HostDetail, long> _hostDetailsDapperRepository;
        private readonly IDapperRepository<TransferOrders.HostHeader, long> _hostHeaderDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public TransferOrderAppService
        (
            IDapperRepository<TransferOrders.Detail, long> orderDetailsDapperRepository,
            IDapperRepository<TransferOrders.Header, long> orderHeaderDapperRepository,
            IDapperRepository<TransferOrders.HostDetail, long> hostDetailsDapperRepository,
            IDapperRepository<TransferOrders.HostHeader, long> hostHeaderDapperRepository,
            IWebHostEnvironment env

        )
        {
            _orderDetailsDapperRepository = orderDetailsDapperRepository;
            _orderHeaderDapperRepository = orderHeaderDapperRepository;
            _hostDetailsDapperRepository = hostDetailsDapperRepository;
            _hostHeaderDapperRepository = hostHeaderDapperRepository;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public async Task<PagedResultDto<TransferOrderMasterDto>> GetTransferOrderListing(GetTransferOrderMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_order_getTransferOrderList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @OrderFilter = '{input.OrderNoFilter}',
                                @TransferFromFilter = '{input.TransferFromFilter}',
                                @TransferToFilter = '{input.TransferToFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var selectQuery = $@"EXEC [dbo].[doc_order_getTransferOrderList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @OrderFilter = '{input.OrderNoFilter}',
                                @TransferFromFilter = '{input.TransferFromFilter}',
                                @TransferToFilter = '{input.TransferToFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                @StartDateFilter = '{input.StartDate}',
                                @EndDateFilter = '{input.EndDate}'
                               ";

            var counts = _orderHeaderDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<TransferOrderMasterDto>>(counts);

            var orderList = _orderHeaderDapperRepository.Query(selectQuery);

            var orderListDto = ObjectMapper.Map<List<TransferOrderMasterDto>>(orderList);

            return new PagedResultDto<TransferOrderMasterDto>(countDto.Count, orderListDto);
        }

        public async Task<TransferOrderMasterDto> GetTransferOrderInfoById(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_order_getTransferOrderInfoById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var orderInfo = _orderHeaderDapperRepository.Query(selectQuery);

            var orderInfoDto = ObjectMapper.Map<List<TransferOrderMasterDto>>(orderInfo);

            return orderInfoDto[0];
        }

        public async Task<ListResultDto<TransferOrderDetailDto>> GetTransferOrderDetailsByIdAsync(GetTransferOrderDetailsInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[doc_order_getTransferOrderDetails]
                                @CountMode = 1,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var counts = _orderDetailsDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<TransferOrderDetailDto>>(counts);

            string selectQuery = $@"EXEC [dbo].[doc_order_getTransferOrderDetails]
                                @CountMode = 0,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount}
                               ";

            var orderDetails = _orderDetailsDapperRepository.Query(selectQuery);
            var orderDetailsDto = ObjectMapper.Map<List<TransferOrderDetailDto>>(orderDetails);

            return new PagedResultDto<TransferOrderDetailDto>(countDto.Count, orderDetailsDto);
        }

        public async Task<TransferOrderDetailDto> GetTransferOrderDetailInfoByIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string selectQuery = $@"EXEC [dbo].[doc_order_getTransferOrderDetailById]
                                @Id = {Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var orderDetail = _orderDetailsDapperRepository.Query(selectQuery);

            var orderDetailDto = ObjectMapper.Map<List<TransferOrderDetailDto>>(orderDetail);

            return orderDetailDto[0];
        }

        public async Task CreateTransferOrderAsync(GetTransferOrderMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_order_createTransferOrder]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @OrganizationId = '{input.organizationId}',
                                  @TransferFrom = '{input.warehouseId}',
                                  @TransferTo = '{input.consigneeId}',
                                  @DeliveryDate = '{input.requiredDeliveryTime}',
                                  @CarrierName = '{input.carrierName}'
                                  ";

            await _orderHeaderDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task TransferOrderAddItemAsync(GetTransferOrderDetailsInput input)
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

            string InsertQuery = $@"EXEC [dbo].[doc_order_addItem]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @OrderId = {input.orderId},
                                  @ItemNumber = '{input.sku}',
                                  @Qty = {input.qtyOrdered},
                                  @LotNum = '{input.lotNum}',
                                  {_expiryDate}
                                  ";

            await _orderDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task TransferOrderEditItemAsync(GetTransferOrderDetailsInput input)
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

            string InsertQuery = $@"EXEC [dbo].[doc_order_editItem]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
                                  @Id = {input.Id},
                                  @ItemNumber = '{input.sku}',
                                  @Qty = {input.qtyOrdered},
                                  @LotNum = '{input.lotNum}',
                                  {_expiryDate}
                                  ";

            await _orderDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task TransferOrderDeleteItemAsync(GetTransferOrderDetailsInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string InsertQuery = $@"EXEC [dbo].[doc_order_deleteItem]
		                          @UserId = {AbpSession.UserId},
		                          {_tenantStatement},
		                          @Id = {input.Id}
                                  ";

            await _orderDetailsDapperRepository.ExecuteAsync(InsertQuery);
        }

        public async Task TransferOrderTransferItemAsync(GetTransferOrderMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var user = UserManager.FindByIdAsync(AbpSession.UserId.ToString());

            /*

            string selectOrderQuery = $@"EXEC [dbo].[doc_order_getTransferOrderInfoById]
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var orderInfo = await _orderHeaderDapperRepository.QueryAsync(selectOrderQuery);

            var orderInfoDto = ObjectMapper.Map<List<TransferOrderMasterDto>>(orderInfo);

            string InsertMasterQuery = $@"
	                                INSERT INTO doc_transfer_header (addTime, addWho, tdocNo, tdocType, organizationId, warehouseId, customerId, userDefineA, status, tdocCreationTime, transferTime)
	                                VALUES (Now(), '{user.Result.UserName}', '{orderInfoDto[0].orderNo}', '{orderInfoDto[0].orderType}', '{orderInfoDto[0].organizationId}', '{orderInfoDto[0].warehouseId}', '{orderInfoDto[0].shopId}', '{orderInfoDto[0].carrierName}', '{orderInfoDto[0].soStatus}', '{orderInfoDto[0].CreationTime}', '{orderInfoDto[0].requiredDeliveryTime}')
                                  ";

            await _hostHeaderDapperRepository.ExecuteAsync(InsertMasterQuery);

           
            string selectDetailsQuery = $@"EXEC [dbo].[doc_order_getTransferOrderDetails]
                                @CountMode = 0,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = ' Id ASC ',
		                        @SkipCount = 0,
		                        @MaxResultCount = 0
                               ";

            var orderDetails = _orderDetailsDapperRepository.Query(selectDetailsQuery);
            var orderDetailsDto = ObjectMapper.Map<List<TransferOrderDetailDto>>(orderDetails);

            foreach (TransferOrderDetailDto detail in orderDetailsDto)
            {
                DateTime tempDate;
                string expiry_date = null;

                if (detail.expiryDate != null)
                {
                    tempDate = (DateTime)detail.expiryDate;
                    expiry_date = tempDate.ToString("yyyy-mm-dd");

                }

                string InsertDetailQuery = $@"
	                                INSERT INTO doc_transfer_details (addTime, addWho, organizationId, warehouseId, tdocNo, tdocLineNo, fmSku, tdocLineStatus, fmLotNum, fmQty, toLotAtt01)
	                                VALUES (Now(), {AbpSession.UserId}, {detail.organizationId}, {orderInfoDto[0].warehouseId}, {orderInfoDto[0].orderNo}, {detail.orderLineNo}, {detail.sku}, {detail.lineStatus}, {detail.lotNum}, {detail.qtyOrdered}, {expiry_date})
                                  ";

                await _hostDetailsDapperRepository.ExecuteAsync(InsertDetailQuery);
            }
            */

            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            string selectOrderQuery = $@"EXEC [dbo].[doc_order_getTransferOrderInfoById]
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            var header = new TransferOrderMasterDto();

            SqlCommand command = new SqlCommand(selectOrderQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                   header.Id = (int)reader["id"];
                   header.orderNo = reader["OrderNo"].ToString();
                   header.orderType = reader["orderType"].ToString();
                   header.organizationId = reader["organizationId"].ToString();
                   header.warehouseId = reader["warehouseId"].ToString();
                   header.consigneeId = reader["consigneeId"].ToString();
                   header.customerId = reader["customerId"].ToString();
                   header.carrierName = reader["carrierName"].ToString();
                   header.soStatus = reader["soStatus"].ToString();
                   header.hedi05 = reader["hedi05"].ToString();
                   header.requiredDeliveryTimeToString = ((DateTime)reader["requiredDeliveryTime"]).ToString("yyyy-MM-dd HH:mm:ss");
                   header.creationTimeToString = ((DateTime)reader["CreationTime"]).ToString("yyyy-MM-dd HH:mm:ss");
                }
            }

            string selectDetailsQuery = $@"EXEC [dbo].[doc_order_getTransferOrderDetails]
                                @CountMode = 1,
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = ' Id ASC ',
		                        @SkipCount = 0,
		                        @MaxResultCount = 0
                               ";

            var details = new List<TransferOrderDetailDto>();

            command = new SqlCommand(selectDetailsQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new TransferOrderDetailDto();

                    row.Id = (int)reader["id"];
                    row.customerId = reader["customerId"].ToString();
                    row.orderLineNo = (int)reader["orderLineNo"];
                    row.sku = reader["sku"].ToString();
                    row.lineStatus = reader["lineStatus"].ToString();
                    //row.dedi09 = reader["dedi09"] != null ? (decimal?)reader["dedi09"] : null;
                    //row.dedi10 = reader["dedi10"] != null ? (decimal?)reader["dedi10"] : null;
                    row.qtyOrdered = (decimal)reader["qtyOrdered"];
                    row.lotNum = reader["lotNum"].ToString();
                    row.expiryDateToString = reader["expiryDate"] != DBNull.Value ? ((DateTime)reader["expiryDate"]).ToString("yyyy-MM-dd HH:mm:ss") : null;
                    row.creationTimeToString = ((DateTime)reader["CreationTime"]).ToString("yyyy-MM-dd HH:mm:ss");

                    details.Add(row);
                }
            }

            conn.Close();

            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            conn2.Open();

            /*
            MySqlCommand comm2 = conn2.CreateCommand();

                comm2.CommandText = $@"
	                                    INSERT INTO doc_order_header (addTime, addWho, orderNo, orderType, organizationId, warehouseId, customerId, consigneeId, carrierName, soStatus, requiredDeliveryTime)
	                                    VALUES ('{header.creationTimeToString}', '{user.Result.UserName}', '{header.orderNo}', '{header.orderType}', '{header.organizationId}', '{header.warehouseId}', '', '{header.consigneeId}', '{header.carrierName}', '{header.hedi05}', '{header.requiredDeliveryTimeToString}')
                               ";
            */

            MySqlCommand comm2 = new MySqlCommand("OCTOPUS_ORDER_HEADER_INSERT", conn2);
            comm2.CommandType = CommandType.StoredProcedure;
            comm2.Parameters.AddWithValue("_addWho", user.Result.UserName);
            comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
            comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
            comm2.Parameters.AddWithValue("_consigneeId", header.consigneeId);
            comm2.Parameters.AddWithValue("_customerId", string.IsNullOrEmpty(header.customerId) ? "" : header.customerId);
            comm2.Parameters.AddWithValue("_orderNo", header.orderNo);
            comm2.Parameters.AddWithValue("_orderType", header.orderType);
            comm2.Parameters.AddWithValue("_soStatus", header.hedi05);
            comm2.Parameters.AddWithValue("_carrierName", header.carrierName);
            comm2.Parameters.AddWithValue("_requiredDeliveryTime", header.requiredDeliveryTime);

            // conn2.Open();

            await comm2.ExecuteNonQueryAsync();

            // conn2.Close();

            foreach (TransferOrderDetailDto detail in details)
            {
                DateTime tempDate;
                string expiry_date = "null";

                if (detail.expiryDate != null)
                {
                    tempDate = (DateTime)detail.expiryDate;
                    expiry_date = "'" + tempDate.ToString("yyyy-mm-dd") + "'";
                }

                /*

                comm2.CommandText = $@"
	                                INSERT INTO doc_order_details (addTime, addWho, organizationId, warehouseId, customerId, orderNo, orderLineNo, sku, lineStatus, lotNum, qtyOrdered, lotAtt01, packUom)
	                                VALUES (Now(), '{user.Result.UserName}', '{header.organizationId}', '{header.warehouseId}', '', '{header.orderNo}', {detail.orderLineNo}, '{detail.sku}', '{detail.lineStatus}', '{detail.lotNum}', {detail.qtyOrdered}, {expiry_date}, 'EA')
                */

                comm2 = new MySqlCommand("OCTOPUS_ORDER_DETAIL_INSERT", conn2);
                comm2.CommandType = CommandType.StoredProcedure;
                comm2.Parameters.AddWithValue("_addWho", user.Result.UserName);
                comm2.Parameters.AddWithValue("_organizationId", header.organizationId);
                comm2.Parameters.AddWithValue("_warehouseId", header.warehouseId);
                comm2.Parameters.AddWithValue("_customerId", string.IsNullOrEmpty(header.customerId) ? "" : header.customerId);
                comm2.Parameters.AddWithValue("_orderNo", header.orderNo);
                comm2.Parameters.AddWithValue("_orderLineNo", detail.orderLineNo);
                comm2.Parameters.AddWithValue("_sku", detail.sku);
                comm2.Parameters.AddWithValue("_lineStatus", detail.lineStatus);
                comm2.Parameters.AddWithValue("_lotNum", detail.lotNum);
                comm2.Parameters.AddWithValue("_qtyOrdered", detail.qtyOrdered);
                comm2.Parameters.AddWithValue("_expiryDate", expiry_date);

                // conn2.Open();

                await comm2.ExecuteNonQueryAsync();

                // conn2.Close();
            }

            conn2.Close();

            conn.Open();

            string updateQuery = $@"EXEC [dbo].[doc_order_updateStatus_Transferred]
                                @Id = {input.Id},
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement}
                               ";

            using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
            {
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
            }

            conn.Close();
        }
    }
}
