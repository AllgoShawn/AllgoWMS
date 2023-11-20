using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Aims.Configure;
using Aims.Startup;
using Aims.Test.Base;

namespace Aims.GraphQL.Tests
{
    [DependsOn(
        typeof(AimsGraphQLModule),
        typeof(AimsTestBaseModule))]
    public class AimsGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsGraphQLTestModule).GetAssembly());
        }
    }
}