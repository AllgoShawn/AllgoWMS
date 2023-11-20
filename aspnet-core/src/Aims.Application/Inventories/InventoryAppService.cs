using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using Abp.Domain.Repositories;
using Aims.Configuration;
using Aims.Dto;
using Aims.Inventories.Exporting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace Aims.Inventories
{
    public class InventoryAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<Inventory, long> _inventoriesDapperRepository;
        private readonly IInventoryListExcelExporter _inventoryListExcelExporter;
        private readonly IInventoryBySkuListExcelExporter _inventoryBySkuListExcelExporter;
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public InventoryAppService
        (
            IDapperRepository<Inventory, long> inventoriesDapperRepository,
            IInventoryListExcelExporter inventoryListExcelExporter,
            IInventoryBySkuListExcelExporter inventoryBySkuListExcelExporter,
            IWebHostEnvironment env
        )
        {
            _inventoriesDapperRepository = inventoriesDapperRepository;
            _inventoryListExcelExporter = inventoryListExcelExporter;
            _inventoryBySkuListExcelExporter = inventoryBySkuListExcelExporter;
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public async Task<PagedResultDto<InventoryMasterDto>> GetInventoryListingAsync(GetInventoryInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var _minQtyFilter = $@"@MinQtyFilter = {input.MinQtyFilter}";
            if(input.MinQtyFilter == null)
            {
                _minQtyFilter = $@"@MinQtyFilter = NULL";
            }

            var _maxQtyFilter = $@"@MaxQtyFilter = {input.MaxQtyFilter}";
            if (input.MaxQtyFilter == null)
            {
                _maxQtyFilter = $@"@MaxQtyFilter = NULL";
            }

            var _minQtyAllocatedFilter = $@"@MinQtyAllocatedFilter = {input.MinQtyAllocatedFilter}";
            if (input.MinQtyAllocatedFilter == null)
            {
                _minQtyAllocatedFilter = $@"@MinQtyAllocatedFilter = NULL";
            }

            var _maxQtyAllocatedFilter = $@"@MaxQtyAllocatedFilter = {input.MaxQtyAllocatedFilter}";
            if (input.MaxQtyAllocatedFilter == null)
            {
                _maxQtyAllocatedFilter = $@"@MaxQtyAllocatedFilter = NULL";
            }

            var _minQtyDamagedFilter = $@"@MinQtyDamagedFilter = {input.MinQtyDamagedFilter}";
            if (input.MinQtyDamagedFilter == null)
            {
                _minQtyDamagedFilter = $@"@MinQtyDamagedFilter = NULL";
            }

            var _maxQtyDamagedFilter = $@"@MaxQtyDamagedFilter = {input.MaxQtyDamagedFilter}";
            if (input.MaxQtyDamagedFilter == null)
            {
                _maxQtyDamagedFilter = $@"@MaxQtyDamagedFilter = NULL";
            }

            var _minQtyInTransitFilter = $@"@MinQtyInTransitFilter = {input.MinQtyInTransitFilter}";
            if (input.MinQtyInTransitFilter == null)
            {
                _minQtyInTransitFilter = $@"@MinQtyInTransitFilter = NULL";
            }

            var _maxQtyInTransitFilter = $@"@MaxQtyInTransitFilter = {input.MaxQtyInTransitFilter}";
            if (input.MaxQtyInTransitFilter == null)
            {
                _maxQtyInTransitFilter = $@"@MaxQtyInTransitFilter = NULL";
            }

            var countQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @OrganizationFilter = '{input.OrganizationFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @LotNumFilter = '{input.LotNumFilter}',
                                @DescrFilter = '{input.DescrFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter},
                                {_minQtyAllocatedFilter},
                                {_maxQtyAllocatedFilter},
                                {_minQtyDamagedFilter},
                                {_maxQtyDamagedFilter},
                                {_minQtyInTransitFilter},
                                {_maxQtyInTransitFilter}
                               ";

            var selectQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @OrganizationFilter = '{input.OrganizationFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @LotNumFilter = '{input.LotNumFilter}',
                                @DescrFilter = '{input.DescrFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter},
                                {_minQtyAllocatedFilter},
                                {_maxQtyAllocatedFilter},
                                {_minQtyDamagedFilter},
                                {_maxQtyDamagedFilter},
                                {_minQtyInTransitFilter},
                                {_maxQtyInTransitFilter}
                               ";

            var counts = _inventoriesDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<InventoryMasterDto>>(counts);

            var inventoryList = _inventoriesDapperRepository.Query(selectQuery);

            var inventoryListDto = ObjectMapper.Map<List<InventoryMasterDto>>(inventoryList);
          
            return new PagedResultDto<InventoryMasterDto>(countDto.Count, inventoryListDto);
        }

        public async Task<FileDto> GetDataToExportInventoryListingAsync(GetInventoryInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var _minQtyFilter = $@"@MinQtyFilter = {input.MinQtyFilter}";
            if (input.MinQtyFilter == null)
            {
                _minQtyFilter = $@"@MinQtyFilter = NULL";
            }

            var _maxQtyFilter = $@"@MaxQtyFilter = {input.MaxQtyFilter}";
            if (input.MaxQtyFilter == null)
            {
                _maxQtyFilter = $@"@MaxQtyFilter = NULL";
            }

            var _minQtyAllocatedFilter = $@"@MinQtyAllocatedFilter = {input.MinQtyAllocatedFilter}";
            if (input.MinQtyAllocatedFilter == null)
            {
                _minQtyAllocatedFilter = $@"@MinQtyAllocatedFilter = NULL";
            }

            var _maxQtyAllocatedFilter = $@"@MaxQtyAllocatedFilter = {input.MaxQtyAllocatedFilter}";
            if (input.MaxQtyAllocatedFilter == null)
            {
                _maxQtyAllocatedFilter = $@"@MaxQtyAllocatedFilter = NULL";
            }

            var _minQtyDamagedFilter = $@"@MinQtyDamagedFilter = {input.MinQtyDamagedFilter}";
            if (input.MinQtyDamagedFilter == null)
            {
                _minQtyDamagedFilter = $@"@MinQtyDamagedFilter = NULL";
            }

            var _maxQtyDamagedFilter = $@"@MaxQtyDamagedFilter = {input.MaxQtyDamagedFilter}";
            if (input.MaxQtyDamagedFilter == null)
            {
                _maxQtyDamagedFilter = $@"@MaxQtyDamagedFilter = NULL";
            }

            var _minQtyInTransitFilter = $@"@MinQtyInTransitFilter = {input.MinQtyInTransitFilter}";
            if (input.MinQtyInTransitFilter == null)
            {
                _minQtyInTransitFilter = $@"@MinQtyInTransitFilter = NULL";
            }

            var _maxQtyInTransitFilter = $@"@MaxQtyInTransitFilter = {input.MaxQtyInTransitFilter}";
            if (input.MaxQtyInTransitFilter == null)
            {
                _maxQtyInTransitFilter = $@"@MaxQtyInTransitFilter = NULL";
            }

            var selectQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @OrganizationFilter = '{input.OrganizationFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @LotNumFilter = '{input.LotNumFilter}',
                                @DescrFilter = '{input.DescrFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter},
                                {_minQtyAllocatedFilter},
                                {_maxQtyAllocatedFilter},
                                {_minQtyDamagedFilter},
                                {_maxQtyDamagedFilter},
                                {_minQtyInTransitFilter},
                                {_maxQtyInTransitFilter}
                               ";

            var inventoryList = _inventoriesDapperRepository.Query(selectQuery);

            var inventoryListDto = ObjectMapper.Map<List<InventoryMasterDto>>(inventoryList);

            return _inventoryListExcelExporter.ExportToFile(inventoryListDto);
        }

        public async Task<PagedResultDto<InventoryBySkuMasterDto>> GetInventoryBySkuListingAsync(GetInventoryBySkuInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var _minQtyFilter = $@"@MinQtyFilter = {input.MinQtyFilter}";
            if (input.MinQtyFilter == null)
            {
                _minQtyFilter = $@"@MinQtyFilter = NULL";
            }

            var _maxQtyFilter = $@"@MaxQtyFilter = {input.MaxQtyFilter}";
            if (input.MaxQtyFilter == null)
            {
                _maxQtyFilter = $@"@MaxQtyFilter = NULL";
            }

            var countQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryBySkuList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter}
                               ";

            var selectQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryBySkuList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter}
                               ";

            var counts = _inventoriesDapperRepository.Query(countQuery);

            var countDto = ObjectMapper.Map<List<InventoryBySkuMasterDto>>(counts);

            var inventoryList = _inventoriesDapperRepository.Query(selectQuery);

            var inventoryListDto = ObjectMapper.Map<List<InventoryBySkuMasterDto>>(inventoryList);

            return new PagedResultDto<InventoryBySkuMasterDto>(countDto.Count, inventoryListDto);
        }

        public async Task<FileDto> GetDataToExportInventoryBySkuListingAsync(GetInventoryBySkuInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var _minQtyFilter = $@"@MinQtyFilter = {input.MinQtyFilter}";
            if (input.MinQtyFilter == null)
            {
                _minQtyFilter = $@"@MinQtyFilter = NULL";
            }

            var _maxQtyFilter = $@"@MaxQtyFilter = {input.MaxQtyFilter}";
            if (input.MaxQtyFilter == null)
            {
                _maxQtyFilter = $@"@MaxQtyFilter = NULL";
            }

            var countQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryBySkuList]
                                @CountMode = 1,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter}
                               ";

            var selectQuery = $@"EXEC [dbo].[inv_lot_loc_getInventoryBySkuList]
                                @CountMode = 0,
		                        @UserId = {AbpSession.UserId},
		                        {_tenantStatement},
		                        @Sorting = '{input.Sorting}',
		                        @SkipCount = {input.SkipCount},
		                        @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @SkuFilter = '{input.SkuFilter}',
                                @WarehouseFilter = '{input.WarehouseFilter}',
                                @StatusFilter = '{input.StatusFilter}',
                                {_minQtyFilter},
                                {_maxQtyFilter}
                               ";

            var inventoryList = _inventoriesDapperRepository.Query(selectQuery);

            var inventoryBySkuListDto = ObjectMapper.Map<List<InventoryBySkuMasterDto>>(inventoryList);

            return _inventoryBySkuListExcelExporter.ExportToFile(inventoryBySkuListDto);
        }

        public async Task dataSyncAsync()
        {
            MySqlConnection conn2 = new MySqlConnection(_appConfiguration["ConnectionStrings:Honeywell"]);

            conn2.Open();

            List<InventoryMasterDto> list = new List<InventoryMasterDto>();

            var selectQuery = $@" select * from inv_lot_loc_id ";

            using (MySqlCommand cmd = new MySqlCommand(selectQuery, conn2))
            {
                //cmd.Parameters.AddWithValue("@pname", x);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    StringBuilder sb = new StringBuilder();
                    while (reader.Read())
                    {
                        var row = new InventoryMasterDto();

                        row.organizationId = reader.GetString("organizationId");
                        row.warehouseId = reader.GetString("warehouseId");
                        row.locationId = reader.GetString("locationId");
                        row.lotNum = reader.GetString("lotNum");
                        row.traceId = reader.GetString("traceId");
                        row.customerId = reader.GetString("customerId");
                        row.sku = reader.GetString("sku");
                        row.qty = reader.GetDecimal("qty");
                        row.qtyAllocated = reader.GetDecimal("qtyAllocated");
                        row.qtyRpIn = reader.GetDecimal("qtyRpIn");
                        row.qtyRpOut = reader.GetDecimal("qtyRpOut");
                        row.qtyMvIn = reader.GetDecimal("qtyMvIn");
                        row.qtyMvOut = reader.GetDecimal("qtyMvOut");
                        row.qtyOnHold = reader.GetDecimal("qtyOnHold");
                        row.grossWeight = reader.GetDecimal("grossWeight");
                        row.netWeight = reader.GetDecimal("netWeight");
                        row.cubic = reader.GetDecimal("cubic");
                        row.price = reader.GetDecimal("price");
                        row.qtyPa = reader.GetDecimal("qtyPa");
                        row.oprSeqFlag = reader.GetString("oprSeqFlag");
                        if(reader["inLocTime"] != DBNull.Value)
                        {
                            row.inLocTime = reader.GetDateTime("inLocTime");
                        }
                        else
                        {
                            row.inLocTime = null;
                        }
                        row.addTime = reader.GetDateTime("addTime");
                        row.addWho = reader.GetString("addWho");
                        row.editTime = reader.GetDateTime("editTime");
                        row.editWho = reader.GetString("editWho");

                        list.Add(row);
                    }
                }
            }

            conn2.Close();

            string DeleteQuery = $@"
                                    DELETE FROM inv_lot_loc_id;
                                  ";

            await _inventoriesDapperRepository.ExecuteAsync(DeleteQuery);

            foreach (InventoryMasterDto item in list)
            {
                string InsertQuery = $@"
                                    INSERT INTO inv_lot_loc_id (CreationTime, CreatorUserId, TenantId, addWho, addTime, editWho, editTime, organizationId,
                                    warehouseId,  locationId, lotNum, traceId, customerId, sku, qty,  qtyAllocated, qtyRpIn,  qtyRpOut,  qtyMvIn,  qtyMvOut,  qtyOnHold,  
                                    grossWeight, netWeight, cubic,  price,  qtyPa,  oprSeqFlag,  inLocTime)
                                    VALUES (GETDATE(), @UserId, @TenantId, @addWho, @addTime, @editWho, @editTime, @organizationId, 
                                    @warehouseId, @locationId, @lotNum, @traceId, @customerId, @sku, @qty, @qtyAllocated, @qtyRpIn, @qtyRpOut, @qtyMvIn, @qtyMvOut, @qtyOnHold,  
                                    @grossWeight, @netWeight, @cubic, @price, @qtyPa, @oprSeqFlag, @inLocTime)
                                  ";

                var para = new
                {
                    TenantId = AbpSession.TenantId,
                    UserId = AbpSession.UserId,
                    organizationId = item.organizationId,
                    warehouseId = item.warehouseId,
                    locationId = item.locationId,
                    lotNum = item.lotNum,
                    traceId = item.traceId,
                    customerId = item.customerId,
                    sku = item.sku,
                    qty = item.qty,
                    qtyAllocated = item.qtyAllocated,
                    qtyRpIn = item.qtyRpIn,
                    qtyRpOut = item.qtyRpOut,
                    qtyMvIn = item.qtyMvIn,
                    qtyMvOut = item.qtyMvOut,
                    qtyOnHold = item.qtyOnHold,
                    grossWeight = item.grossWeight,
                    netWeight = item.netWeight,
                    cubic = item.cubic,
                    price = item.price,
                    qtyPa = item.qtyPa,
                    oprSeqFlag = item.oprSeqFlag,
                    inLocTime = item.inLocTime,
                    addTime = item.addTime,
                    addWho = item.addWho,
                    editTime = item.editTime,
                    editWho = item.editWho
                };

                await _inventoriesDapperRepository.ExecuteAsync(InsertQuery, para);
            }
        }
    }
}
