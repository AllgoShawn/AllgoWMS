using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Aims.Configuration;
using Aims.Web;

namespace Aims.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class AimsDbContextFactory : IDesignTimeDbContextFactory<AimsDbContext>
    {
        public AimsDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AimsDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder(), addUserSecrets: true);

            AimsDbContextConfigurer.Configure(builder, configuration.GetConnectionString(AimsConsts.ConnectionStringName));

            return new AimsDbContext(builder.Options);
        }
    }
}