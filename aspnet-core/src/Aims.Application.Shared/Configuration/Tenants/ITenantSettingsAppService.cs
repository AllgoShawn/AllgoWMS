using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.Configuration.Tenants.Dto;

namespace Aims.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
