using Abp.Application.Services;
using Aims.Dto;
using Aims.Logging.Dto;

namespace Aims.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
