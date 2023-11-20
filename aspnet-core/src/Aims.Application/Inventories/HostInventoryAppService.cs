using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Aims.Configuration;
using Aims.Dto;
using Aims.Inventories.Exporting;
using Aims.TransferOrders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aims.Inventories
{
    public class HostInventoryAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<Inventory, long> _inventoriesDapperRepository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public HostInventoryAppService
        (
            IDapperRepository<Inventory, long> inventoriesDapperRepository,
            IWebHostEnvironment env
        )
        {
            _inventoriesDapperRepository = inventoriesDapperRepository;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public async Task<PagedResultDto<InventoryMasterDto>> GetInventoryListing(GetInventoryInput input)
        {

            var countQuery = $@"
                                SELECT * FROM inv_lot_loc_id
                               ";

            var selectQuery = $@"
                              SELECT * FROM inv_lot_loc_id ORDER BY addTime DESC LIMIT {input.SkipCount},{input.MaxResultCount}
                               ";

            var counts = _inventoriesDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<InventoryMasterDto>>(counts);

            var inventoryList = _inventoriesDapperRepository.Query(selectQuery);

            var inventoryListDto = ObjectMapper.Map<List<InventoryMasterDto>>(inventoryList);

            return new PagedResultDto<InventoryMasterDto>(countDto.Count, inventoryListDto);
        }

        public async Task<ListResultDto<InventoryItemDto>> GetAvailableQtyFromWarehouses(GetTransferOrderMasterInput input)
        {
            List<InventoryItemDto> list = new List<InventoryItemDto>();

            var selectQuery = $@" SELECT sku, warehouseId, SUM(qty) AS qty FROM inv_lot_loc_id 
                                  WHERE (warehouseId = '{input.warehouseId}' AND organizationId = '{input.organizationId}') 
                                  OR (warehouseId = '{input.consigneeId}' AND organizationId = '{input.organizationId}')
                                  GROUP BY sku, warehouseId ";

            var result = _inventoriesDapperRepository.Query(selectQuery);

            list = ObjectMapper.Map<List<InventoryItemDto>>(result);

            return new ListResultDto<InventoryItemDto>(list);
        }

        public async Task<PagedResultDto<NameValueDto>> GetWarehousesFromInventory()
        {
            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            var selectQuery = $@"SELECT DISTINCT ouwz.Code, (SELECT TOP 1 DisplayName FROM AbpOrganizationUnits WHERE Id = ouwz.OrganizationUnitId) AS Type FROM AbpOrganizationUnitWorkZones ouwz 
                                 WHERE ouwz.TenantId = {AbpSession.TenantId} AND ouwz.Type = 'Warehouse' AND ouwz.Id IN 
                                 (
                                 SELECT uowz.WorkZoneId FROM AbpUserOrganizationUnitWorkZones uowz WHERE uowz.UserId = {AbpSession.UserId}
                                 AND uowz.TenantId = {AbpSession.TenantId}
                                 )";

            var inventory = new List<NameValueDto>();

            SqlCommand command = new SqlCommand(selectQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    NameValueDto row = new NameValueDto();

                    row.Name = reader["Code"].ToString();
                    row.Value = reader["Type"].ToString();

                    inventory.Add(row);
                }
            }

            conn.Close();

            string condition = " ";

            if (inventory.Count > 0)
            {
                condition = " WHERE ";

                foreach (NameValueDto item in inventory)
                {
                    if (item == inventory.LastOrDefault())
                    {
                        condition = condition + " (warehouseId = '" + item.Name + "' AND organizationId = '" + item.Value + "') ";
                    }
                    else
                    {
                        condition = condition + " (warehouseId = '" + item.Name + "' AND organizationId = '" + item.Value + "') OR ";
                    }
                }
            }
            else
            {
                condition = " WHERE 1 = 2 ";
            }

            selectQuery = $@" SELECT DISTINCT warehouseId, organizationId FROM inv_lot_loc_id {condition}";

            var result = _inventoriesDapperRepository.Query(selectQuery);

            return new PagedResultDto<NameValueDto>(
                result.Count(),
                result.Select(u =>
                    new NameValueDto(
                        u.warehouseId.ToString(),
                        u.organizationId.ToString()
                    )
                ).ToList()
            );

            /*
            SqlConnection conn = new SqlConnection(_appConfiguration["ConnectionStrings:Default"]);
            conn.Open();

            var selectQuery = $@"SELECT DISTINCT ouwz.Code, (SELECT TOP 1 DisplayName FROM AbpOrganizationUnits WHERE Id = ouwz.OrganizationUnitId) AS Type FROM AbpOrganizationUnitWorkZones ouwz 
                                 WHERE ouwz.TenantId = {AbpSession.TenantId} AND ouwz.Type = 'Warehouse' AND ouwz.Id IN 
                                 (
                                 SELECT uowz.WorkZoneId FROM AbpUserOrganizationUnitWorkZones uowz WHERE uowz.UserId = {AbpSession.UserId}
                                 AND uowz.TenantId = {AbpSession.TenantId}
                                 )";

            var inventory = new List<NameValueDto>();

            SqlCommand command = new SqlCommand(selectQuery, conn);
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    NameValueDto row = new NameValueDto();

                    row.Name = reader["Code"].ToString();
                    row.Value = reader["Type"].ToString();

                    inventory.Add(row);
                }
            }

            conn.Close();

            string condition = " ";

            if (inventory.Count > 0)
            {
                condition = " WHERE ";

                foreach (NameValueDto item in inventory)
                {
                    if (item == inventory.LastOrDefault())
                    {
                        condition = condition + " (warehouseId = '" + item.Name + "' AND organizationId = '" + item.Value + "') ";
                    }
                    else
                    {
                        condition = condition + " (warehouseId = '" + item.Name + "' AND organizationId = '" + item.Value + "') OR ";
                    }
                }
            }
            else
            {
                condition = " WHERE 1 = 2 ";
            }

            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);
            conn2.Open();
            MySqlCommand comm2 = conn2.CreateCommand();

            comm2.CommandText = $@" SELECT DISTINCT warehouseId, organizationId FROM inv_lot_loc_id {condition}";

            List<NameValueDto> result = new List<NameValueDto>();

            MySqlDataReader rdr = comm2.ExecuteReader();
            while (rdr.Read())
            {
                NameValueDto row = new NameValueDto();

                row.Name = rdr["warehouseId"].ToString();
                row.Value = rdr["organizationId"].ToString();

                result.Add(row);
            }
            rdr.Close();

            conn2.Close();

            return new PagedResultDto<NameValueDto>(result.Count(), result);
            */
        }
    }
}
