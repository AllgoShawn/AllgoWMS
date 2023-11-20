using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Organizations;
using Aims.Authorization;
using Aims.Organizations.Dto;
using System.Linq.Dynamic.Core;
using Abp.Extensions;
using Microsoft.EntityFrameworkCore;
using Abp.UI;
using Abp.Dapper.Repositories;
using Aims.Warehouses.Dto;
using Aims.WorkZones;

namespace Aims.Warehouses
{
    [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageWarehouses)]
    public class WarehouseAppService : AimsAppServiceBase
    {
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        private readonly IRepository<WorkZone, long> _workZoneRepository;
        private readonly IDapperRepository<WorkZone, long> _workZoneDapperRepository;
        private readonly IRepository<UserOrganizationUnitWorkZone, long> _userWorkZoneRepository;

        public WarehouseAppService(
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<WorkZone, long> workZoneRepository,
            IDapperRepository<WorkZone, long> workZoneDapperRepository,
            IRepository<UserOrganizationUnitWorkZone, long> userWorkZoneRepository
            )
        {
            _organizationUnitRepository = organizationUnitRepository;
            _workZoneRepository = workZoneRepository;
            _workZoneDapperRepository = workZoneDapperRepository;
            _userWorkZoneRepository = userWorkZoneRepository;
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
    }   
}
