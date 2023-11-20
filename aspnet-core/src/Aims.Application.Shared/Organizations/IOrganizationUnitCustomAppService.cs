using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Aims.Organizations.Dto;

namespace Aims.Organizations
{
    public interface IOrganizationUnitCustomAppService : IApplicationService
    {
        Task<PagedResultDto<OrganizationUnitDto>> GetOrganizationUnits(GetOrganizationUnitCustomInput input);
    }
}
