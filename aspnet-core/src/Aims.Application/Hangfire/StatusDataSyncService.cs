using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
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
using Aims.TransferOrders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Aims.Hangfire
{
    public class StatusDataSyncService : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IDapperRepository<TransferOrders.Header, long> _orderHeaderDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public StatusDataSyncService
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

            var selectOrderQuery = $@" SELECT organizationId, warehouseId, orderNo, soStatus FROM doc_order_header WHERE soStatus = '99' ";

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

            var selectOrderQuery2 = $@" SELECT organizationId, warehouseId, orderNo, soStatus FROM doc_order_header WHERE soStatus = '99' ";

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
