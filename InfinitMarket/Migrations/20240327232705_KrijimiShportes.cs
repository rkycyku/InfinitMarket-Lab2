using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiShportes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Shporta",
                columns: table => new
                {
                    ShportaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PerdoruesiID = table.Column<int>(type: "int", nullable: true),
                    TotaliProdukteveNeShporte = table.Column<int>(type: "int", nullable: true),
                    DataEFunditEPerditesimit = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shporta", x => x.ShportaID);
                    table.ForeignKey(
                        name: "FK_Shporta_Perdoruesit_PerdoruesiID",
                        column: x => x.PerdoruesiID,
                        principalTable: "Perdoruesit",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shporta_PerdoruesiID",
                table: "Shporta",
                column: "PerdoruesiID");

            migrationBuilder.InsertData(
                table: "Shporta",
                columns: new[] { "ShportaID", "PerdoruesiID", "TotaliProdukteveNeShporte", "DataEFunditEPerditesimit" },
                values: new object[,]
                {
            { 1, 1, 0, "1900-01-01T00:00:00.000Z" },
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Shporta");
        }
    }
}
