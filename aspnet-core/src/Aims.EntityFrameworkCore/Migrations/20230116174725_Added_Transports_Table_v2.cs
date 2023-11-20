using Microsoft.EntityFrameworkCore.Migrations;

namespace Aims.Migrations
{
    public partial class Added_Transports_Table_v2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "octopus_transports",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "octopus_transports");
        }
    }
}
