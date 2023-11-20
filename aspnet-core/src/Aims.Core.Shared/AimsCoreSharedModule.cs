using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims
{
    public class AimsCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsCoreSharedModule).GetAssembly());
        }
    }
}