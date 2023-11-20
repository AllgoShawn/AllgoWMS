using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetZeroCore.Net;
using Abp.Authorization;
using Abp.Dapper.Repositories;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Aims.Authorization.Users;
using Aims.Configuration;
using Aims.Dto;
using Aims.PO;
using Aims.Storage;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Aims.Hangfire
{
    public class OrderInTransitDataSyncService : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IDapperRepository<TransferOrders.Header, long> _orderHeaderDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public OrderInTransitDataSyncService
        (
            AbpTimer timer,
            IDapperRepository<TransferOrders.Header, long> orderHeaderDapperRepository,
            IWebHostEnvironment env
        )
        : base(timer)
        {
            Timer.Period = 60000; //60000 = 1 minute
            _orderHeaderDapperRepository = orderHeaderDapperRepository;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        protected override void DoWork()
        {
            AsyncHelper.RunSync(() => UpdateStatus());
        }

        private async Task UpdateStatus()
        {
            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);

            conn.Open();

            string updateQuery = $@" EXEC [dbo].[doc_order_updateStatus_InTransit] ";
            using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
            {
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
            }

            string selectPOQuery = $@" SELECT ph.*, (SELECT TOP 1 so.orderNo FROM doc_order_header so WHERE so.Id = ph.orderId) AS orderNo FROM doc_po_header ph WHERE ph.udf01 = 'N' ";

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

                    row.orderId = null;
                    if (reader["orderId"] != DBNull.Value)
                    {
                        row.orderId = (int)reader["orderId"];
                    }

                    row.orderNo = reader["orderNo"] != DBNull.Value ? reader["orderNo"].ToString() : null;

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
                comm2.Parameters.AddWithValue("_orderNo", header.orderNo);

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
    }
}
