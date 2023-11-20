using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Aims.Web.Public.Views
{
    public abstract class AimsRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected AimsRazorPage()
        {
            LocalizationSourceName = AimsConsts.LocalizationSourceName;
        }
    }
}
