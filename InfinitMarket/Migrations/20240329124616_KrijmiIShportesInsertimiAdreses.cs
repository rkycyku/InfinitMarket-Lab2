using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijmiIShportesInsertimiAdreses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeDhenatProduktit_ProduktiId",
                table: "TeDhenatProduktit");

            migrationBuilder.CreateTable(
                name: "TeDhenatShporta",
                columns: table => new
                {
                    TeDhenatShportaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShportaID = table.Column<int>(type: "int", nullable: false),
                    ProduktiID = table.Column<int>(type: "int", nullable: false),
                    SasiaProduktit = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeDhenatShporta", x => x.TeDhenatShportaID);
                    table.ForeignKey(
                        name: "FK_TeDhenatShporta_Produkti_ProduktiID",
                        column: x => x.ProduktiID,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeDhenatShporta_Shporta_ShportaID",
                        column: x => x.ShportaID,
                        principalTable: "Shporta",
                        principalColumn: "ShportaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatProduktit_ProduktiId",
                table: "TeDhenatProduktit",
                column: "ProduktiId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatShporta_ProduktiID",
                table: "TeDhenatShporta",
                column: "ProduktiID");

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatShporta_ShportaID",
                table: "TeDhenatShporta",
                column: "ShportaID");

            migrationBuilder.InsertData(
                table: "AdresatPerdoruesit",
                columns: new[] { "AdresaID", "PerdoruesiID", "Qyteti", "ZipKodi", "Adresa", "Shteti", "Emri", "Mbiemri", "NrKontaktit", "Email"},
                values: new object[,]
                {
            { 1, 1, "Prishtine", "10000", "P.A.", "Kosove", "Admin", "Admin", "+38344111222", "admin@infinitmarket.com"},
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeDhenatShporta");

            migrationBuilder.DropIndex(
                name: "IX_TeDhenatProduktit_ProduktiId",
                table: "TeDhenatProduktit");

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatProduktit_ProduktiId",
                table: "TeDhenatProduktit",
                column: "ProduktiId");
        }
    }
}
