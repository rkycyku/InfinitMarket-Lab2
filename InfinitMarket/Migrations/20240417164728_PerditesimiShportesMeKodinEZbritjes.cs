using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class PerditesimiShportesMeKodinEZbritjes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KodiZbritjesID",
                table: "Shporta",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shporta_KodiZbritjesID",
                table: "Shporta",
                column: "KodiZbritjesID");

            migrationBuilder.AddForeignKey(
                name: "FK_Shporta_KodiZbritjes_KodiZbritjesID",
                table: "Shporta",
                column: "KodiZbritjesID",
                principalTable: "KodiZbritjes",
                principalColumn: "Kodi");

            migrationBuilder.UpdateData(
                table: "Shporta",
                keyColumn: "ShportaID",
                keyValue: 1,
                column: "KodiZbritjesID",
                value: "NukKaZbritje");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shporta_KodiZbritjes_KodiZbritjesID",
                table: "Shporta");

            migrationBuilder.DropIndex(
                name: "IX_Shporta_KodiZbritjesID",
                table: "Shporta");

            migrationBuilder.DropColumn(
                name: "KodiZbritjesID",
                table: "Shporta");
        }
    }
}
