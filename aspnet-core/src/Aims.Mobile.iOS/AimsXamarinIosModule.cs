using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims
{
    [DependsOn(typeof(AimsXamarinSharedModule))]
    public class AimsXamarinIosModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsXamarinIosModule).GetAssembly());
        }
    }
}