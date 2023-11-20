using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Aims.Configuration;
using Aims.Web;

namespace Aims.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class ClientDbContextFactory : IDesignTimeDbContextFactory<ClientDbContext>
    {
        public ClientDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ClientDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder(), addUserSecrets: true);

            ClientDbContextConfigurer.Configure(builder, configuration.GetConnectionString(AimsConsts.ClientConnectionStringName));

            return new ClientDbContext(builder.Options);
        }
    }
}