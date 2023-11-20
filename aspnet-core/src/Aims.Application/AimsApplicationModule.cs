using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Aims.Authorization;

namespace Aims
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(AimsApplicationSharedModule),
        typeof(AimsCoreModule)
        )]
    public class AimsApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsApplicationModule).GetAssembly());
        }
    }
}