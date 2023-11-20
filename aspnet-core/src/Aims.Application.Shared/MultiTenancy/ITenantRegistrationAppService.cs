using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.Editions.Dto;
using Aims.MultiTenancy.Dto;

namespace Aims.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}