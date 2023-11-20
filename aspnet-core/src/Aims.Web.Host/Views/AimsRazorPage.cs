using Abp.AspNetCore.Mvc.Views;

namespace Aims.Web.Views
{
    public abstract class AimsRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected AimsRazorPage()
        {
            LocalizationSourceName = AimsConsts.LocalizationSourceName;
        }
    }
}
