using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiProduktit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Produkti",
                columns: table => new
                {
                    ProduktiId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmriProduktit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pershkrimi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FotoProduktit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KompaniaId = table.Column<int>(type: "int", nullable: true),
                    KategoriaId = table.Column<int>(type: "int", nullable: true),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produkti", x => x.ProduktiId);
                    table.ForeignKey(
                        name: "FK_Produkti_KategoriaProduktit_KategoriaId",
                        column: x => x.KategoriaId,
                        principalTable: "KategoriaProduktit",
                        principalColumn: "KategoriaId");
                    table.ForeignKey(
                        name: "FK_Produkti_KompanitePartnere_KompaniaId",
                        column: x => x.KompaniaId,
                        principalTable: "KompanitePartnere",
                        principalColumn: "KompaniaID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Produkti_KategoriaId",
                table: "Produkti",
                column: "KategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Produkti_KompaniaId",
                table: "Produkti",
                column: "KompaniaId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Produkti");
        }
    }
}
