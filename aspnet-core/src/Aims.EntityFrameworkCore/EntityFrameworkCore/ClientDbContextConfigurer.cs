using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Aims.EntityFrameworkCore
{
    public static class ClientDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ClientDbContext> builder, string connectionString)
        {
            builder.UseMySql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<ClientDbContext> builder, DbConnection connection)
        {
            builder.UseMySql(connection);
        }
    }
}
