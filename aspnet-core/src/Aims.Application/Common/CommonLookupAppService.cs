using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using Aims.Common.Dto;
using Aims.Editions;
using Aims.Editions.Dto;

namespace Aims.Common
{
    [AbpAuthorize]
    public class CommonLookupAppService : AimsAppServiceBase, ICommonLookupAppService
    {
        private readonly EditionManager _editionManager;

        public CommonLookupAppService(EditionManager editionManager)
        {
            _editionManager = editionManager;
        }

        public async Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false)
        {
            var subscribableEditions = (await _editionManager.Editions.Cast<SubscribableEdition>().ToListAsync())
                .WhereIf(onlyFreeItems, e => e.IsFree)
                .OrderBy(e => e.MonthlyPrice);

            return new ListResultDto<SubscribableEditionComboboxItemDto>(
                subscribableEditions.Select(e => new SubscribableEditionComboboxItemDto(e.Id.ToString(), e.DisplayName, e.IsFree)).ToList()
            );
        }

        public async Task<PagedResultDto<NameValueDto>> FindUsers(FindUsersInput input)
        {
            if (AbpSession.TenantId != null)
            {
                //Prevent tenants to get other tenant's users.
                input.TenantId = AbpSession.TenantId;
            }

            using (CurrentUnitOfWork.SetTenantId(input.TenantId))
            {
                var query = UserManager.Users
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
                            u.FullName + " (" + u.EmailAddress + ")",
                            u.Id.ToString()
                            )
                        ).ToList()
                    );
            }
        }

        public GetDefaultEditionNameOutput GetDefaultEditionName()
        {
            return new GetDefaultEditionNameOutput
            {
                Name = EditionManager.DefaultEditionName
            };
        }

        public async Task<PagedResultDto<NameValueDto>> getStatusTypes(GetLookupInput input)
        {
            string _tenantStatement = $@" @Tenant_Id = {AbpSession.TenantId} ";
            string _source = $@" @Source = {input.source}";
            string _lookup_type = $@" @Lookup_Type = {input.lookup_type}";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @Tenant_Id IS NULL ";
            }
            if(input.source == null)
            {
                _source = " @Source IS NULL";
            }
            if(input.lookup_type == null)
            {
                _lookup_type = " @Lookup_Type IS NULL ";
            }

            var selectQuery = $@"EXEC [dbo].[getCommonLookup]
                                {_tenantStatement},
                                {_source},
                                {_lookup_type}";
        }
    }
}
