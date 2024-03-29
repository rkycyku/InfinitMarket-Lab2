using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiTeDhenatProduktit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeDhenatProduktit",
                columns: table => new
                {
                    TeDhenatProduktitID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProduktiId = table.Column<int>(type: "int", nullable: false),
                    SasiaNeStok = table.Column<int>(type: "int", nullable: true),
                    QmimiBleres = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    QmimiProduktit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DataKrijimit = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataPerditsimit = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeDhenatProduktit", x => x.TeDhenatProduktitID);
                    table.ForeignKey(
                        name: "FK_TeDhenatProduktit_Produkti_ProduktiId",
                        column: x => x.ProduktiId,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatProduktit_ProduktiId",
                table: "TeDhenatProduktit",
                column: "ProduktiId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeDhenatProduktit");
        }
    }
}
