using Abp.AspNetCore.Mvc.ViewComponents;

namespace Aims.Web.Public.Views
{
    public abstract class AimsViewComponent : AbpViewComponent
    {
        protected AimsViewComponent()
        {
            LocalizationSourceName = AimsConsts.LocalizationSourceName;
        }
    }
}