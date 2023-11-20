using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims
{
    [DependsOn(typeof(AimsCoreSharedModule))]
    public class AimsApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsApplicationSharedModule).GetAssembly());
        }
    }
}