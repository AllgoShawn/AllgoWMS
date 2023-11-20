using System.Data.SqlClient;
using MySql.Data.MySqlClient;
using Shouldly;
using Xunit;

namespace Aims.Tests.General
{
    // ReSharper disable once InconsistentNaming
    public class ConnectionString_Tests
    {
        [Fact]
        public void SqlConnectionStringBuilder_Test()
        {   
            var csb = new MySqlConnectionStringBuilder("Server=localhost; Database=Aims; Trusted_Connection=True;");
            csb["Database"].ShouldBe("Aims");
        }
    }
}
