using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace Aims.Startup
{
    [DependsOn(typeof(AimsCoreModule))]
    public class AimsGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}