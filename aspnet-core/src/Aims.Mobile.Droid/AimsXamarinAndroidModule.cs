using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims
{
    [DependsOn(typeof(AimsXamarinSharedModule))]
    public class AimsXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsXamarinAndroidModule).GetAssembly());
        }
    }
}