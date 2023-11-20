using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims
{
    public class AimsClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsClientModule).GetAssembly());
        }
    }
}
