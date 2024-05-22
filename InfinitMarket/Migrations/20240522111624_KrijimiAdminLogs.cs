using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiAdminLogs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StafiId = table.Column<int>(type: "int", nullable: true),
                    Veprimi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Entiteti = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EntitetiId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Koha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Detaje = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminLogs_Perdoruesit_StafiId",
                        column: x => x.StafiId,
                        principalTable: "Perdoruesit",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminLogs_StafiId",
                table: "AdminLogs",
                column: "StafiId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminLogs");
        }
    }
}
