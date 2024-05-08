using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiZbritjeveTeProduktit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZbritjaQmimitProduktit",
                columns: table => new
                {
                    ZbritjaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProduktiId = table.Column<int>(type: "int", nullable: false),
                    QmimiPaZbritjeProduktit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    QmimiMeZbritjeProduktit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DataZbritjes = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataSkadimit = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZbritjaQmimitProduktit", x => x.ZbritjaID);
                    table.ForeignKey(
                        name: "FK_ZbritjaQmimitProduktit_Produkti_ProduktiId",
                        column: x => x.ProduktiId,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ZbritjaQmimitProduktit_ProduktiId",
                table: "ZbritjaQmimitProduktit",
                column: "ProduktiId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZbritjaQmimitProduktit");
        }
    }
}
