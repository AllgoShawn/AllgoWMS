using Aims.Configuration;
using Aims.Tenants.Dashboard.Dto;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;


namespace Aims.Tenants.Dashboard
{
    public class DashboardOutOfStockGenerator 
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public  DashboardOutOfStockGenerator
        (
            IWebHostEnvironment env
        )
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public  List<OutOfStockItem> GenerateOutOfStock()
        {
            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            string query = $@"EXEC [dbo].[dashboard_getOutOfStock]";
            var stats = new List<OutOfStockItem>();

            SqlCommand cmd = new SqlCommand(query, conn);
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new OutOfStockItem();
                    row.sku = reader["sku"].ToString();
                    row.itemDesc = reader["itemDesc"].ToString();
                    row.lstMvDt = ((DateTime)reader["lastMvDate"]);
                    row.qty = (int)reader["qty"];
                    row.status = reader["status"].ToString();

                    stats.Add(row);
                }
            }
            conn.Close();
            return stats;
        }
    }
}
