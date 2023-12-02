using Abp.Application.Services.Dto;
using Abp.Dapper.Repositories;
using System.Linq;
using System.Threading.Tasks;
using Aims.Custom;

namespace Aims.Custom
{
    public class CustomLookupAppService : AimsAppServiceBase
    {
        private readonly IDapperRepository<Custom.Lookup, long> _customLookupDapperRepository;

        public CustomLookupAppService
        (
            IDapperRepository<Custom.Lookup, long> customLookupDapperRepository
        )
        {
            _customLookupDapperRepository = customLookupDapperRepository;
        }

        public async Task<PagedResultDto<NameValueDto>> GetLookup(GetLookupInput input)
        {
            string _tenantStatement = $@" @TenantId = {AbpSession.TenantId} ";
            string _source = $@" @Source = {input.source}";
            string _lookup_type = $@" @Lookup_Type = {input.lookup_type}";

            if (AbpSession.TenantId == null)
            {
                _tenantStatement = " @TenantId = NULL ";
            }
            if (input.source == null)
            {
                _source = " @Source = NULL";
            }
            if (input.lookup_type == null)
            {
                _lookup_type = " @Lookup_Type = NULL ";
            }

            var selectQuery = $@"EXEC [dbo].[getCustomLookup]
                                {_tenantStatement},
                                {_source},
                                {_lookup_type}";

            var result = _customLookupDapperRepository.Query(selectQuery);

            return new PagedResultDto<NameValueDto>(
                result.Count(),
                result.Select(u =>
                    new NameValueDto(
                        u.description.ToString(),
                        u.description.ToString()
                        )
                    ).ToList()
            );
        }
    }
}