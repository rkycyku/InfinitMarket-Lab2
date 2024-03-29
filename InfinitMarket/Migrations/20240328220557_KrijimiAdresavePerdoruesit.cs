using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiAdresavePerdoruesit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdresatPerdoruesit",
                columns: table => new
                {
                    AdresaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PerdoruesiID = table.Column<int>(type: "int", nullable: false),
                    Qyteti = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ZipKodi = table.Column<int>(type: "int", nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Shteti = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdresatPerdoruesit", x => x.AdresaID);
                    table.ForeignKey(
                        name: "FK_AdresatPerdoruesit_Perdoruesit_PerdoruesiID",
                        column: x => x.PerdoruesiID,
                        principalTable: "Perdoruesit",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdresatPerdoruesit_PerdoruesiID",
                table: "AdresatPerdoruesit",
                column: "PerdoruesiID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdresatPerdoruesit");
        }
    }
}
