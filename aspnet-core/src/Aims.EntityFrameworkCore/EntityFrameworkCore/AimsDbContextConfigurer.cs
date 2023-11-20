using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Aims.EntityFrameworkCore
{
    public static class AimsDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AimsDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<AimsDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}