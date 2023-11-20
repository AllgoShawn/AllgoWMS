using Microsoft.AspNetCore.Mvc;
using Aims.Web.Controllers;

namespace Aims.Web.Public.Controllers
{
    public class HomeController : AimsControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}