using Microsoft.AspNetCore.Mvc;
using Aims.Web.Controllers;

namespace Aims.Web.Public.Controllers
{
    public class AboutController : AimsControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}