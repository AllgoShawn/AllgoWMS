using System;
using Abp.Configuration.Startup;
using Abp.Domain.Uow;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Aims.Configuration;
using Aims.Web;

namespace Aims.EntityFrameworkCore
{
    public class MyConnectionStringResolver : DefaultConnectionStringResolver
    {
        private readonly IConfigurationRoot _appConfiguration;

        public MyConnectionStringResolver(IAbpStartupConfiguration configuration, IHostingEnvironment hostingEnvironment)
            : base(configuration)
        {
            _appConfiguration =
                AppConfigurations.Get(hostingEnvironment.ContentRootPath, hostingEnvironment.EnvironmentName);
        }

        public override string GetNameOrConnectionString(ConnectionStringResolveArgs args)
        {
            if (args["DbContextConcreteType"] as Type == typeof(ClientDbContext))
            {
                return _appConfiguration.GetConnectionString(AimsConsts.ClientConnectionStringName);
            }

            return base.GetNameOrConnectionString(args);
        }
    }
}
