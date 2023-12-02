using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Dapper.Repositories;
using Abp.Linq.Extensions;
using Abp.Organizations;
using Aims.Authorization;
using System.Linq.Dynamic.Core;
using Abp.Extensions;
using Microsoft.EntityFrameworkCore;
using Abp.UI;

using Aims.Warehouses.Dto;
using Aims.WorkZones;
using Castle.DynamicProxy.Contributors;
using System;
using Microsoft.EntityFrameworkCore.Internal;
using System.Threading;
using System.Collections.Generic;
using Aims.ASN;

namespace Aims.Warehouses
{
    [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageWarehouses)]
    public class WarehouseAppService : AimsAppServiceBase
    {
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        private readonly IRepository<WorkZone, long> _workZoneRepository;
        private readonly IDapperRepository<WorkZone, long> _workZoneDapperRepository;
        private readonly IRepository<UserOrganizationUnitWorkZone, long> _userWorkZoneRepository;
        private readonly IDapperRepository<WarehouseMaster, long> _warehouseMasterDapperRepository;

        public WarehouseAppService(
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<WorkZone, long> workZoneRepository,
            IDapperRepository<WorkZone, long> workZoneDapperRepository,
            IRepository<UserOrganizationUnitWorkZone, long> userWorkZoneRepository,
            IDapperRepository<WarehouseMaster, long> warehouseMasterDapperRepository
            )
        {
            _organizationUnitRepository = organizationUnitRepository;
            _workZoneRepository = workZoneRepository;
            _workZoneDapperRepository = workZoneDapperRepository;
            _userWorkZoneRepository = userWorkZoneRepository;
            _warehouseMasterDapperRepository = warehouseMasterDapperRepository;

        }

        public async Task<PagedResultDto<WarehouseListDto>> GetWarehouses(GetWarehouseInput input)
        {
            var query = from warehouse in _workZoneRepository.GetAll()
                        join ou in _organizationUnitRepository.GetAll() on warehouse.OrganizationUnitId equals ou.Id
                        where warehouse.TenantId == AbpSession.TenantId
                        && warehouse.OrganizationUnitId == input.Id
                        && warehouse.Type == "Warehouse"
                        && warehouse.WarehouseId == null
                        && warehouse.IsDeleted == false
                        select new
                        {
                            warehouse
                        };

            var totalCount = await query.WhereIf(
                                       !input.Filter.IsNullOrWhiteSpace(),
                                       u => u.warehouse.Code.Contains(input.Filter)
                                   ).CountAsync();

            var items = await query.WhereIf(
                                       !input.Filter.IsNullOrWhiteSpace(),
                                       u => u.warehouse.Code.Contains(input.Filter)).OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var warehouseMemberCounts = await _userWorkZoneRepository.GetAll()
                .GroupBy(x => x.WorkZoneId)
                .Select(groupedUsers => new
                {
                    workZoneId = groupedUsers.Key,
                    count = groupedUsers.Count()
                }).ToDictionaryAsync(x => x.workZoneId, y => y.count);

            var workZoneCounts = await _workZoneRepository.GetAll()
                .Where(x => x.WarehouseId != null && x.Type != "Warehouse")
                .GroupBy(x => x.WarehouseId)
                .Select(groupedWorkZones => new
                {
                    warehouseId = groupedWorkZones.Key,
                    count = groupedWorkZones.Count()
                }).ToDictionaryAsync(x => x.warehouseId, y => y.count);

            return new PagedResultDto<WarehouseListDto>(
                totalCount,
                items.Select(item =>
                {
                    var warehouseDto = ObjectMapper.Map<WarehouseListDto>(item.warehouse);
                    warehouseDto.MemberCount = warehouseMemberCounts.ContainsKey((long)item.warehouse.Id) ? warehouseMemberCounts[(long)item.warehouse.Id] : 0;
                    warehouseDto.WorkZoneCount = workZoneCounts.ContainsKey((long)item.warehouse.Id) ? workZoneCounts[(long)item.warehouse.Id] : 0;
                    warehouseDto.UpdatedTime = item.warehouse.LastModificationTime != null ? item.warehouse.LastModificationTime : item.warehouse.CreationTime;
                    return warehouseDto;
                }).ToList());
        }

        public async Task CreateWarehouse(CreateWarehouseInput input)
        {
            var warehouses = await _workZoneRepository.GetAll()
                .Where(x => x.TenantId == AbpSession.TenantId 
                && x.OrganizationUnitId == input.OrganizationUnitId 
                && x.Code == input.Code 
                && x.Type == "Warehouse" && x.WarehouseId == null)
                .ToListAsync();

            if (warehouses.Any(x => x.Code == input.Code))
            {
                throw new UserFriendlyException("There is already a warehouse with the same Id : " + input.Code);
            }

            string Query = $@"
                INSERT INTO AbpOrganizationUnitWorkZones 
                (CreationTime, CreatorUserId, IsDeleted, TenantId, OrganizationUnitId, Code, Type) 
                VALUES (GETDATE(), @UserId, 0, @TenantId, @OrganizationUnitId, @Code, 'Warehouse')";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                OrganizationUnitId = input.OrganizationUnitId,
                Code = input.Code
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);

            var selectQuery = $@"
                SELECT TOP 1 Id FROM AbpOrganizationUnitWorkZones
                WHERE IsDeleted = 0 AND TenantId = @TenantId 
                AND OrganizationUnitId = @OrganizationUnitId 
                AND Code = @Code AND Type = 'Warehouse' AND WarehouseId IS NULL;";
            
            var warehouse = _workZoneDapperRepository.Query(selectQuery, para);
        }

        public async Task UpdateWarehouse(UpdateWarehouseInput input)
        {
            var warehouses = await _workZoneRepository.GetAll()
                .Where(x => x.TenantId == AbpSession.TenantId
                && x.OrganizationUnitId == input.OrganizationUnitId
                && x.Code == input.Code
                && x.Type == "Warehouse" && x.WarehouseId == null)
                .ToListAsync();

            if (warehouses.Any(x => x.Code == input.Code))
            {
                throw new UserFriendlyException("There is already a warehouse with the same Id : " + input.Code);
            }

            string Query = $@"
                              UPDATE AbpOrganizationUnitWorkZones 
                              SET Code = @Code, 
                              LastModificationTime = GETDATE(), 
                              LastModifierUserId = @UserId 
                              WHERE Id = @Id AND IsDeleted = 0 
                              AND TenantId = @TenantId 
                              AND OrganizationUnitId = @OrganizationUnitId;
                             ";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                Id = input.Id,
                OrganizationUnitId = input.OrganizationUnitId,
                Code = input.Code
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);
        }

        public async Task UpdateToDeleteWarehouse(UpdateWarehouseInput input)
        {
            string Query = $@"
                              UPDATE AbpOrganizationUnitWorkZones
                              SET IsDeleted = 1, 
                              DeletionTime = GETDATE(), 
                              DeleterUserId = @UserId 
                              WHERE Id = @Id AND IsDeleted = 0 
                              AND TenantId = @TenantId 
                              AND OrganizationUnitId = @OrganizationUnitId;
                             ";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                Id = input.Id,
                OrganizationUnitId = input.OrganizationUnitId
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);
        }

        public async Task CreateWarehouseMasterAsync(GetWarehouseMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";
            
            if(AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string query = $@"EXEC [dbo].[t_warehouse_create]
                              @UserId = {AbpSession.UserId},
                              {_tenantStatement},
                              @whse_code = '{input.whse_code}',
                              @whse_name = '{input.whse_name}',
                              @status = '{input.status}',
                              @country = '{input.country}',
                              @state = '{input.state}',
                              @city = '{input.city}',
                              @address = '{input.address}',
                              @address1 = '{input.address1}',
                              @address2 = '{input.address2}',
                              @zip = '{input.zip}',
                              @contact = '{input.contact}',
                              @contact_tel = '{input.contact_tel}',
                              @contact_fax = '{input.contact_fax}',
                              @contact_email = '{input.contact_email}',
                              @contact_title = '{input.contact_title}',
                              @remarks = '{input.remarks}'";
            
            if(warehouseExist(input.whse_code))
            {
                throw new UserFriendlyException(L($"Warehouse code '{input.whse_code}': '{input.whse_name}' already exists.")); 
            }
            else
            {
                await _warehouseMasterDapperRepository.ExecuteAsync(query);
            }
        }

        private bool warehouseExist(string whse_code)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string query = $@"EXEC [dbo].[t_warehouse_checkDuplicate]
                              {_tenantStatement},
                              @whse_code = '{whse_code}'";

            var warehouse = _warehouseMasterDapperRepository.Query(query);
            
            return warehouse.Any();
        }

        public async Task<PagedResultDto<WarehouseMasterDto>> GetWarehouseMasterListingAsync(GetWarehouseMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId}";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            var countQuery = $@"EXEC [dbo].[t_warehouse_getWarehouseListing]
                                @CountMode = 1,
                                @UserId = {AbpSession.UserId},
                                {_tenantStatement},
                                @Sorting = '{input.Sorting}',
                                @SkipCount = {input.SkipCount},
                                @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @whseCodeFilter = '{input.whseCodeFilter}',
                                @whseNameFilter = '{input.whseNameFilter}',
                                @whseStatusFilter = '{input.whseStatusFilter}'
                               ";

            var selectQuery = $@"EXEC [dbo].[t_warehouse_getWarehouseListing]
                                @CountMode = 0,
                                @UserId = {AbpSession.UserId},
                                {_tenantStatement},
                                @Sorting = '{input.Sorting}',
                                @SkipCount = {input.SkipCount},
                                @MaxResultCount = {input.MaxResultCount},
                                @Filter = '{input.Filter}',
                                @whseCodeFilter = '{input.whseCodeFilter}',
                                @whseNameFilter = '{input.whseNameFilter}',
                                @whseStatusFilter = '{input.whseStatusFilter}'
                               ";

            var counts = _warehouseMasterDapperRepository.Query(countQuery);
            Console.WriteLine("count = " + counts);
            var countDto = ObjectMapper.Map<List<WarehouseMasterDto>>(counts);

            var warehouseMasterList = _warehouseMasterDapperRepository.Query(selectQuery);

            var warehouseMasterListDto = ObjectMapper.Map<List<WarehouseMasterDto>>(warehouseMasterList);

            return new PagedResultDto<WarehouseMasterDto>(countDto.Count, warehouseMasterListDto);
        }

        public async Task<WarehouseMasterDto> GetWarehouseMasterByIdAsync(long Id)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if(AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string query = $@"EXEC [dbo].[t_warehouse_getWarehouseMasterById]
                            @Id = {Id},
                            @UserId = {AbpSession.UserId},
                            {_tenantStatement}";

            var warehouseInfo = _warehouseMasterDapperRepository.Query(query);

            var warehouseInfoDto = ObjectMapper.Map<List<WarehouseMasterDto>>(warehouseInfo);

            return warehouseInfoDto[0];
        }

        public async Task EditWarehouseMasterAsync(GetWarehouseMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }
            

            string query = $@"EXEC [dbo].[t_warehouse_editWarehouseMaster]
		                          @UserId = {AbpSession.UserId},
                                  {_tenantStatement},
                                  @Id = {input.id},
                                  @whse_name = '{input.whse_name}',
                                  @status = '{input.status}',
                                  @country = '{input.country}',
                                  @state = '{input.state}',
                                  @city = '{input.city}',
                                  @address = '{input.address}',
                                  @address1 = '{input.address1}',
                                  @address2 = '{input.address2}',
                                  @zip = '{input.zip}',
                                  @contact = '{input.contact}',
                                  @contact_tel = '{input.contact_tel}',
                                  @contact_fax = '{input.contact_fax}',
                                  @contact_email = '{input.contact_email}',
                                  @contact_title = '{input.contact_title}',
                                  @remarks = '{input.remarks}'";

            await _warehouseMasterDapperRepository.ExecuteAsync(query);
        }

        public async Task confirmDeleteAsync(GetWarehouseMasterInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }

            string query = $@"EXEC [dbo].[t_warehouse_confirmDelete]
                            @UserId = {AbpSession.UserId},
                            {_tenantStatement},
                            @Id = {input.id}";

            await _warehouseMasterDapperRepository.ExecuteAsync(query);
        }

    }   
}
