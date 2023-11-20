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
using Aims.Authorization.Roles;
using Abp.Dapper.Repositories;
using Abp.UI;
using System.Collections.Generic;
using Aims.Common;
using Aims.OrganizationUnits;
using Aims.Warehouses;
using Aims.WorkZones;

namespace Aims.Organizations
{
    [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits)]
    public class OrganizationUnitCustomAppService : AimsAppServiceBase
    {
        private readonly OrganizationUnitManager _organizationUnitManager;
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        private readonly IDapperRepository<OrganizationUnitCustom, long> _organizationUnitDapperRepository;
        private readonly IRepository<UserOrganizationUnit, long> _userOrganizationUnitRepository;
        private readonly IDapperRepository<UserOrganizationUnit, long> _userOrganizationUnitDapperRepository;
        private readonly IRepository<OrganizationUnitRole, long> _organizationUnitRoleRepository;
        private readonly IRepository<WorkZone, long> _workZoneRepository;
        private readonly IRepository<UserRole, long> _userRoleRepository;
        private readonly RoleManager _roleManager;

        public OrganizationUnitCustomAppService(
            OrganizationUnitManager organizationUnitManager,
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IDapperRepository<OrganizationUnitCustom, long> organizationUnitDapperRepository,
            IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository,
            IDapperRepository<UserOrganizationUnit, long> userOrganizationUnitDapperRepository,
            IRepository<WorkZone, long> workZoneRepository,
            IRepository<UserRole, long> userRoleRepository,
            RoleManager roleManager,
            IRepository<OrganizationUnitRole, long> organizationUnitRoleRepository)
        {
            _organizationUnitManager = organizationUnitManager;
            _organizationUnitRepository = organizationUnitRepository;
            _organizationUnitDapperRepository = organizationUnitDapperRepository;
            _userOrganizationUnitRepository = userOrganizationUnitRepository;
            _userOrganizationUnitDapperRepository = userOrganizationUnitDapperRepository;
            _workZoneRepository = workZoneRepository;
            _userRoleRepository = userRoleRepository;
            _roleManager = roleManager;
            _organizationUnitRoleRepository = organizationUnitRoleRepository;
        }

        public async Task<PagedResultDto<OrganizationUnitDto>> GetOrganizationUnits(GetOrganizationUnitCustomInput input)
        {
            var adminTenant = "AND TenantId IS NULL ";
            
            if(AbpSession.TenantId != null)
            {
                adminTenant = $@"AND TenantId = {AbpSession.TenantId} ";
            }

            var selectQuery = $@"SELECT Id, Code, DisplayName, Type
                                 FROM AbpOrganizationUnits WHERE IsDeleted = 0 {adminTenant}
                                 ORDER BY {input.Sorting} OFFSET {input.SkipCount} ROWS FETCH NEXT {input.MaxResultCount} ROWS ONLY;";

            var organizationUnits = _organizationUnitDapperRepository.Query(selectQuery);

            var totalCount = await _organizationUnitRepository.GetAll().CountAsync();

            var warehouseCounts = await _workZoneRepository.GetAll()
                .Where(x => x.Type == "Warehouse" && x.WarehouseId == null)
                .GroupBy(x => x.OrganizationUnitId)
                .Select(groupedWarehouses => new
                {
                    organizationUnitId = groupedWarehouses.Key,
                    count = groupedWarehouses.Count()
                }).ToDictionaryAsync(x => x.organizationUnitId, y => y.count);

            return new PagedResultDto<OrganizationUnitDto>(
                totalCount,
                organizationUnits.Select(ou =>
                {
                    var organizationUnitDto = ObjectMapper.Map<OrganizationUnitDto>(ou);
                    organizationUnitDto.WarehouseCount = warehouseCounts.ContainsKey((long)ou.Id) ? warehouseCounts[(long)ou.Id] : 0;
                    //organizationUnitDto.RoleCount = organizationUnitRoleCounts.ContainsKey((long)ou.Id) ? organizationUnitRoleCounts[(long)ou.Id] : 0;
                    return organizationUnitDto;
                }).ToList());
        }

        public async Task<PagedResultDto<OrganizationUnitUserListDto>> GetOrganizationUnitUsers(GetOrganizationUnitUsersInput input)
        {
            var query = from ouUser in _userOrganizationUnitRepository.GetAll()
                        join ou in _organizationUnitRepository.GetAll() on ouUser.OrganizationUnitId equals ou.Id
                        join user in UserManager.Users on ouUser.UserId equals user.Id
                        where ouUser.OrganizationUnitId == input.Id
                        select new
                        {
                            ouUser,
                            user
                        };

            var totalCount = await query.CountAsync();
            var items = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            return new PagedResultDto<OrganizationUnitUserListDto>(
                totalCount,
                items.Select(item =>
                {
                    var organizationUnitUserDto = ObjectMapper.Map<OrganizationUnitUserListDto>(item.user);
                    organizationUnitUserDto.AddedTime = item.ouUser.CreationTime;

                    var roles = "";
                    var roleIds = _userRoleRepository.GetAll().Where(x => x.UserId == item.user.Id).Select(i => i.RoleId).ToList();

                    var last = roleIds.Last();
                    foreach (var roleId in roleIds)
                    {
                        if (roleId.Equals(last))
                        {
                            roles += _roleManager.Roles.Where(x => x.Id == roleId).Select(i => i.DisplayName).FirstOrDefault();
                        }
                        else
                        {
                            roles += _roleManager.Roles.Where(x => x.Id == roleId).Select(i => i.DisplayName).FirstOrDefault() + ", ";
                        }
                    }

                    if (string.IsNullOrEmpty(roles))
                    {
                        roles = "Guest";
                    }

                    //organizationUnitUserDto.UserRole = roles;

                    return organizationUnitUserDto;
                }).ToList());
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers)]
        public async Task<PagedResultDto<NameValueDto>> FindUsers(FindOrganizationUnitUsersInput input)
        {
            var userIdsInOrganizationUnit = _userOrganizationUnitRepository.GetAll()
                .Where(uou => uou.OrganizationUnitId == input.OrganizationUnitId)
                .Select(uou => uou.UserId);

            var query = UserManager.Users
                .Where(u => _userRoleRepository.GetAll().Where(x => x.UserId == u.Id &&
                (x.TenantId != AbpSession.TenantId)).Any())
                .WhereIf(
                    !input.Filter.IsNullOrWhiteSpace(),
                    u =>
                        u.Name.Contains(input.Filter) ||
                        u.Surname.Contains(input.Filter) ||
                        u.UserName.Contains(input.Filter) ||
                        u.EmailAddress.Contains(input.Filter)
                );

            var userCount = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.Name)
                .ThenBy(u => u.Surname)
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<NameValueDto>(
                userCount,
                users.Select(u =>
                    new NameValueDto(
                        //u.Name + " " + u.Surname + " (" + u.EmailAddress + ")",
                        u.UserName.ToString(),
                        u.UserName.ToString()
                    )
                ).ToList()
            );
        }
    }
}
