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
    public class OrderClosedDataSyncService : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IDapperRepository<TransferOrders.Header, long> _orderHeaderDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public OrderClosedDataSyncService
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

            string updateQuery = $@" EXEC [dbo].[doc_order_updateStatus_Closed] ";
            using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
            {
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
            }

            conn.Close();
        }
    }
}
