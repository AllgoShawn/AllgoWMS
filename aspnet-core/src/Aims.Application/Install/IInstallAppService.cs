using System.Threading.Tasks;
using Abp.Application.Services;
using Aims.Install.Dto;

namespace Aims.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}