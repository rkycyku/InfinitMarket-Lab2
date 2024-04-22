using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiITabelesSePorosive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Porosit",
                columns: table => new
                {
                    IdPorosia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Totali18TVSH = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Totali8TVSH = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DataPorosis = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StatusiPorosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdKlienti = table.Column<int>(type: "int", nullable: true),
                    Zbritja = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotaliProdukteve = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Porosit", x => x.IdPorosia);
                    table.ForeignKey(
                        name: "FK_Porosit_Perdoruesit_IdKlienti",
                        column: x => x.IdKlienti,
                        principalTable: "Perdoruesit",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "TeDhenatEPorosis",
                columns: table => new
                {
                    IdDetajet = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QmimiTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SasiaPorositur = table.Column<int>(type: "int", nullable: true),
                    IdPorosia = table.Column<int>(type: "int", nullable: true),
                    IdProdukti = table.Column<int>(type: "int", nullable: true),
                    QmimiProduktit = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeDhenatEPorosis", x => x.IdDetajet);
                    table.ForeignKey(
                        name: "FK_TeDhenatEPorosis_Porosit_IdPorosia",
                        column: x => x.IdPorosia,
                        principalTable: "Porosit",
                        principalColumn: "IdPorosia");
                    table.ForeignKey(
                        name: "FK_TeDhenatEPorosis_Produkti_IdProdukti",
                        column: x => x.IdProdukti,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Porosit_IdKlienti",
                table: "Porosit",
                column: "IdKlienti");

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatEPorosis_IdPorosia",
                table: "TeDhenatEPorosis",
                column: "IdPorosia");

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatEPorosis_IdProdukti",
                table: "TeDhenatEPorosis",
                column: "IdProdukti");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeDhenatEPorosis");

            migrationBuilder.DropTable(
                name: "Porosit");
        }
    }
}
