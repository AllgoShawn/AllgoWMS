using Abp.Auditing;
using Microsoft.AspNetCore.Mvc;

namespace Aims.Web.Controllers
{
    public class HomeController : AimsControllerBase
    {
        [DisableAuditing]
        public IActionResult Index()
        {
            return RedirectToAction("Index", "Ui");
        }
    }
}
