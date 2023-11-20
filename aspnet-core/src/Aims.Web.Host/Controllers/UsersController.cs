using Abp.AspNetCore.Mvc.Authorization;
using Aims.Authorization;
using Aims.Storage;
using Abp.BackgroundJobs;

namespace Aims.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}