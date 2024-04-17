using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiKoditTeZbritjes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KodiZbritjes",
                columns: table => new
                {
                    Kodi = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DataKrijimit = table.Column<DateTime>(type: "datetime2", nullable: true),
                    QmimiZbritjes = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ProduktiId = table.Column<int>(type: "int", nullable: true),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KodiZbritjes", x => x.Kodi);
                    table.ForeignKey(
                        name: "FK_KodiZbritjes_Produkti_ProduktiId",
                        column: x => x.ProduktiId,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_KodiZbritjes_ProduktiId",
                table: "KodiZbritjes",
                column: "ProduktiId");

            migrationBuilder.InsertData(
              table: "KodiZbritjes",
              columns: new[] { "Kodi", "DataKrijimit", "QmimiZbritjes", "ProduktiId", "isDeleted" },
              values: new object[,]
              {
            { "NukKaZbritje", "1900-01-01T00:00:00.000Z", 0, null, "false" }
              });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KodiZbritjes");
        }
    }
}
