using Abp;
using Abp.Dapper;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.Configuration;
using Abp.IdentityServer4;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Aims.Configuration;
using Aims.EntityHistory;
using Aims.Migrations.Seed;
using DapperExtensions.Sql;
using System.Collections.Generic;
using System.Reflection;

namespace Aims.EntityFrameworkCore
{
    [DependsOn(
        typeof(AbpZeroCoreEntityFrameworkCoreModule),
        typeof(AimsCoreModule),
        typeof(AbpDapperModule),
        typeof(AbpZeroCoreIdentityServerEntityFrameworkCoreModule)
        )]
    public class AimsEntityFrameworkCoreModule : AbpModule
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

        public override void PreInitialize()
        {
            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<AimsDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        AimsDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        AimsDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });

                Configuration.Modules.AbpEfCore().AddDbContext<ClientDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        ClientDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        var configurationAccessor = IocManager.Resolve<IAppConfigurationAccessor>();
                        ClientDbContextConfigurer.Configure(options.DbContextOptions, configurationAccessor.Configuration["ConnectionStrings:Honeywell"]);
                    }
                });
            }

            // Set this setting to true for enabling entity history.
            Configuration.EntityHistory.IsEnabled = false;

            // Uncomment below line to write change logs for the entities below:
            // Configuration.EntityHistory.Selectors.Add("AimsEntities", EntityHistoryHelper.TrackedTypes);
            // Configuration.CustomConfigProviders.Add(new EntityHistoryConfigProvider(Configuration));
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AimsEntityFrameworkCoreModule).GetAssembly());
            DapperExtensions.DapperExtensions.SetMappingAssemblies(new List<Assembly> { typeof(AimsEntityFrameworkCoreModule).GetAssembly() });
            DapperExtensions.DapperExtensions.SqlDialect = new MySqlDialect();
        }

        public override void PostInitialize()
        {
            var configurationAccessor = IocManager.Resolve<IAppConfigurationAccessor>();

            using (var scope = IocManager.CreateScope())
            {
                if (!SkipDbSeed && scope.Resolve<DatabaseCheckHelper>().Exist(configurationAccessor.Configuration["ConnectionStrings:Default"]))
                {
                    SeedHelper.SeedHostDb(IocManager);
                }
            }
        }
    }
}
