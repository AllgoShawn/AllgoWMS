using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Aims.Migrations
{
    public partial class Added_Transports_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "octopus_transports",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    TNo = table.Column<string>(maxLength: 30, nullable: true),
                    ShipFromCode = table.Column<string>(maxLength: 60, nullable: true),
                    ShipToCode = table.Column<string>(maxLength: 60, nullable: true),
                    Driver = table.Column<long>(nullable: false),
                    Status = table.Column<string>(maxLength: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_octopus_transports", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "octopus_transports");
        }
    }
}
