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
using Aims.Warehouses;
using Aims.WorkZones.Dto;
using System.Collections.Generic;
using Aims.Warehouses.Dto;

namespace Aims.WorkZones
{
    [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageWorkZones)]
    public class WorkZoneAppService : AimsAppServiceBase
    {
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        private readonly IRepository<WorkZone, long> _workZoneRepository;
        private readonly IDapperRepository<WorkZone, long> _workZoneDapperRepository;
        private readonly IRepository<UserOrganizationUnitWorkZone, long> _userWorkZoneRepository;
        private readonly IDapperRepository<UserOrganizationUnitWorkZone, long> _userWorkZoneDapperRepository;
        private readonly IRepository<UserRole, long> _userRoleRepository;

        public WorkZoneAppService(
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<WorkZone, long> workZoneRepository,
            IDapperRepository<WorkZone, long> workZoneDapperRepository,
            IRepository<UserOrganizationUnitWorkZone, long> userWorkZoneRepository,
            IDapperRepository<UserOrganizationUnitWorkZone, long> userWorkZoneDapperRepository,
            IRepository<UserRole, long> userRoleRepository
            )
        {
            _organizationUnitRepository = organizationUnitRepository;
            _workZoneRepository = workZoneRepository;
            _workZoneDapperRepository = workZoneDapperRepository;
            _userWorkZoneRepository = userWorkZoneRepository;
            _userWorkZoneDapperRepository = userWorkZoneDapperRepository;
            _userRoleRepository = userRoleRepository;
        }

        public async Task<PagedResultDto<WorkZoneListDto>> GetWorkZones(GetWorkZoneInput input)
        {
            var query = from workZone in _workZoneRepository.GetAll()
                        join ou in _organizationUnitRepository.GetAll() on workZone.OrganizationUnitId equals ou.Id
                        where workZone.TenantId == AbpSession.TenantId
                        && workZone.OrganizationUnitId == input.organizationUnitId
                        && workZone.Type != "Warehouse"
                        && workZone.IsDeleted == false
                        select new
                        {
                            workZone
                        };

            var totalCount = await query.WhereIf(
                                       input.warehouseId != null,
                                       u => u.workZone.WarehouseId == input.warehouseId)
                                       .WhereIf(
                                       !input.Filter.IsNullOrWhiteSpace(),
                                       u => u.workZone.Code.Contains(input.Filter))
                                       .WhereIf(
                                       !input.Type.IsNullOrWhiteSpace(),
                                       u => u.workZone.Type.Contains(input.Type))
                                       .WhereIf(
                                       input.warehouseId > 0,
                                       u => u.workZone.WarehouseId == input.warehouseId).CountAsync();

            var items = await query.WhereIf(
                                   input.warehouseId != null,
                                   u => u.workZone.WarehouseId == input.warehouseId)
                                    .WhereIf(
                                   !input.Filter.IsNullOrWhiteSpace(),
                                   u => u.workZone.Code.Contains(input.Filter))
                                   .WhereIf(
                                   !input.Type.IsNullOrWhiteSpace(),
                                   u => u.workZone.Type.Contains(input.Type))
                                   .WhereIf(
                                   input.warehouseId > 0,
                                   u => u.workZone.WarehouseId == input.warehouseId).OrderBy(input.Sorting).PageBy(input).ToListAsync();

            var workZoneMemberCounts = await _userWorkZoneRepository.GetAll()
                .GroupBy(x => x.WorkZoneId)
                .Select(groupedUsers => new
                {
                    workZoneId = groupedUsers.Key,
                    count = groupedUsers.Count()
                }).ToDictionaryAsync(x => x.workZoneId, y => y.count);

            return new PagedResultDto<WorkZoneListDto>(
                totalCount,
                items.Select(item =>
                {
                    var workZoneDto = ObjectMapper.Map<WorkZoneListDto>(item.workZone);
                    workZoneDto.WarehouseCode = _workZoneRepository.GetAll().Where(x => x.Id == item.workZone.WarehouseId).Select(n => n.Code).FirstOrDefault();
                    workZoneDto.WarehouseId = item.workZone.WarehouseId;
                    workZoneDto.MemberCount = workZoneMemberCounts.ContainsKey((long)item.workZone.Id) ? workZoneMemberCounts[(long)item.workZone.Id] : 0;
                    workZoneDto.UpdatedTime = item.workZone.LastModificationTime != null ? item.workZone.LastModificationTime : item.workZone.CreationTime;
                    return workZoneDto;
                }).ToList());
        }

        public async Task<ListResultDto<WarehouseListDto>> GetWarehouses(GetWarehouseInput input)
        {
            List<WarehouseListDto> list = new List<WarehouseListDto>();

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

            var items = await query.OrderBy(input.Sorting).ToListAsync();

            list = ObjectMapper.Map<List<WarehouseListDto>>(items.Select(x => x.warehouse).ToList());

            return new ListResultDto<WarehouseListDto>(list);
        }

        public async Task CreateWorkZone(CreateWorkZoneInput input)
        {
            var workzones = await _workZoneRepository.GetAll().
                Where(x => x.TenantId == AbpSession.TenantId 
                && x.OrganizationUnitId == input.OrganizationUnitId
                && x.WarehouseId == input.WarehouseId
                && x.Code == input.Code).ToListAsync();

            if (workzones.Any(x => x.Code == input.Code))
            {
                throw new UserFriendlyException("There is already a workzone with the same Id : " + input.Code);
            }

            string Query = $@"
                INSERT INTO AbpOrganizationUnitWorkZones 
                (CreationTime, CreatorUserId, IsDeleted, TenantId, OrganizationUnitId, WarehouseId, Code, Type) 
                VALUES 
                (GETDATE(), @UserId, 0, @TenantId, @OrganizationUnitId, @WarehouseId, @Code, @Type)";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                OrganizationUnitId = input.OrganizationUnitId,
                WarehouseId = input.WarehouseId,
                Code = input.Code,
                Type = input.Type
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);

            var selectQuery = $@"
                SELECT TOP 1 Id FROM AbpOrganizationUnitWorkZones 
                WHERE IsDeleted = 0 AND TenantId = @TenantId 
                AND OrganizationUnitId = @OrganizationUnitId 
                AND WarehouseId = @WarehouseId 
                AND Code = @Code;";

            var workzone = _workZoneDapperRepository.Query(selectQuery, para);
        }

        public async Task UpdateWorkZone(UpdateWorkZoneInput input)
        {
            var workzones = await _workZoneRepository.GetAll().
                Where(x => x.TenantId == AbpSession.TenantId 
                && x.OrganizationUnitId == input.OrganizationUnitId
                && x.WarehouseId == input.WarehouseId
                && x.Code == input.Code).ToListAsync();

            if (workzones.Any(x => x.Code == input.Code))
            {
                throw new UserFriendlyException("There is already a workzone with the same Id : " + input.Code);
            }

            string Query = $@"
                              UPDATE AbpOrganizationUnitWorkZones 
                              SET Code = @Code, Type = @Type, 
                              LastModificationTime = GETDATE(), LastModifierUserId = @UserId 
                              WHERE Id = @Id AND IsDeleted = 0 AND TenantId = @TenantId 
                              AND OrganizationUnitId = @OrganizationUnitId
                              AND WarehouseId = @WarehouseId;
                             ";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                Id = input.Id,
                OrganizationUnitId = input.OrganizationUnitId,
                WarehouseId = input.WarehouseId,
                Code = input.Code,
                Type = input.Type
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);
        }

        public async Task UpdateToDeleteWorkZone(UpdateWorkZoneInput input)
        {
            string Query = $@"
                              UPDATE AbpOrganizationUnitWorkZones 
                              SET IsDeleted = 1, DeletionTime = GETDATE(), DeleterUserId = @UserId
                              WHERE Id = @Id AND IsDeleted = 0 AND TenantId = @TenantId 
                              AND OrganizationUnitId = @OrganizationUnitId
                              AND WarehouseId = @WarehouseId;
                             ";

            var para = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                Id = input.Id,
                OrganizationUnitId = input.OrganizationUnitId,
                WarehouseId = input.WarehouseId
            };

            await _workZoneDapperRepository.ExecuteAsync(Query, para);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers)]
        public async Task<PagedResultDto<NameValueDto>> FindWorkZoneUsers(FindWorkZoneUsersInput input)
        {
            string _tenantStatement = $@" u.TenantId = {AbpSession.TenantId} ";
            string _roletenantStatement = $@" TenantId = {AbpSession.TenantId} ";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " u.TenantId IS NULL ";
                _roletenantStatement = " TenantId IS NULL ";
            }

            var selectQuery = $@"SELECT u.Id, u.UserName AS Code from AbpUsers u 
                                 JOIN AbpUserRoles ur ON u.Id = ur.UserId
                                 WHERE {_tenantStatement} 
                                 AND ur.RoleId = (SELECT TOP 1 Id FROM AbpRoles WHERE {_roletenantStatement} AND DisplayName = '{input.Type}')
                               ";

            var result = _workZoneDapperRepository.Query(selectQuery);

            return new PagedResultDto<NameValueDto>(
                result.Count(),
                result.Select(u =>
                    new NameValueDto(
                        u.Code,
                        u.Id.ToString()
                    )
                ).ToList()
            );
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers)]
        public async Task<ListResultDto<NameValueDto>> FindSelectedWorkZoneUsers(FindWorkZoneUsersInput input)
        {
            var userIdsInOrganizationUnit = _userWorkZoneRepository.GetAll()
                .Where(uwz => uwz.WorkZoneId == input.WorkZoneId && 

                _workZoneRepository.GetAll()
                .Where(x => x.Id == input.WorkZoneId)
                .Select(u => u.Type).FirstOrDefault() == input.Type

                ).Select(uou => uou.UserId);

            var query = UserManager.Users
                .Where(u => userIdsInOrganizationUnit.Contains(u.Id));

            var userCount = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.Name)
                .ThenBy(u => u.Surname)
                .PageBy(input)
                .ToListAsync();

            return new ListResultDto<NameValueDto>(
                users.Select(u =>
                    new NameValueDto(
                        u.UserName,
                        u.Id.ToString()
                    )
                ).ToList()
            );
        }

        public async Task AddUsersToWorkZone(UsersToWorkZoneInput input)
        {
            string DeleteQuery = $@"
                              DELETE FROM AbpUserOrganizationUnitWorkZones WHERE TenantId IS NULL AND WorkZoneId = @WorkZoneId;
                             ";

            if (AbpSession.TenantId != null)
            {
                DeleteQuery = $@"
                              DELETE FROM AbpUserOrganizationUnitWorkZones WHERE TenantId = @TenantId AND WorkZoneId = @WorkZoneId;
                             ";
            }
            var DeletePara = new
            {
                UserId = AbpSession.UserId,
                TenantId = AbpSession.TenantId,
                WorkZoneId = input.WorkZoneId
            };

            await _userWorkZoneDapperRepository.ExecuteAsync(DeleteQuery, DeletePara);

            foreach (var userId in input.UserIds)
            {
                string InsertQuery = $@"
                              INSERT INTO AbpUserOrganizationUnitWorkZones (CreationTime, CreatorUserId, IsDeleted, TenantId, WorkZoneId, UserId)
                              VALUES (GETDATE(), @UserId, 0, @TenantId, @WorkZoneId, @AssignedToUserId)
                             ";

                var InsertPara = new
                {
                    UserId = AbpSession.UserId,
                    TenantId = AbpSession.TenantId,
                    AssignedToUserId = userId,
                    WorkZoneId = input.WorkZoneId
                };

                await _userWorkZoneDapperRepository.ExecuteAsync(InsertQuery, InsertPara);
            }
        }
    }
}
