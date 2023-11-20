using Aims.Configuration;
using Aims.Tenants.Dashboard.Dto;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;
using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.Tenants.Dashboard
{
    public class DashboardPoSummaryGenerator
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public DashboardPoSummaryGenerator
        (
         IWebHostEnvironment env
        )
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public List<PoSummaryData> GeneratePOSummary()
        {
            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            string query = $@"EXEC [dbo].[dashboard_getPOSummary]";
            var poSummary = new List<PoSummaryData>();

            SqlCommand cmd = new SqlCommand(query, conn);
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    var row = new PoSummaryData();
                    
                        row.totalOpenPO = (int)reader["totalOpenPO"];
                        row.percentTotalOpenPO = (int)reader["percentTotalOpenPO"];
                        row.totalOpenLine = (int)reader["totalOpenLine"];
                        row.percentTotalOpenLine = (int)reader["percentTotalOpenLine"];
                        row.totalOpenQty = (int)reader["totalOpenQty"];
                        row.percentTotalOpenQty = (decimal)reader["percentTotalOpenQty"];
                        poSummary.Add(row);
                }
            }
            conn.Close();
            return poSummary;
        }
    }
}