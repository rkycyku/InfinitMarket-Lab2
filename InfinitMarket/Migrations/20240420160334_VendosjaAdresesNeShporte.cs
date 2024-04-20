using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class VendosjaAdresesNeShporte : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdresaPorosisID",
                table: "Shporta",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shporta_AdresaPorosisID",
                table: "Shporta",
                column: "AdresaPorosisID");

            migrationBuilder.AddForeignKey(
                name: "FK_Shporta_AdresatPerdoruesit_AdresaPorosisID",
                table: "Shporta",
                column: "AdresaPorosisID",
                principalTable: "AdresatPerdoruesit",
                principalColumn: "AdresaID");

            migrationBuilder.UpdateData(
                table: "Shporta",
                keyColumn: "ShportaID",
                keyValue: 1,
                column: "AdresaPorosisID",
                value: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shporta_AdresatPerdoruesit_AdresaPorosisID",
                table: "Shporta");

            migrationBuilder.DropIndex(
                name: "IX_Shporta_AdresaPorosisID",
                table: "Shporta");

            migrationBuilder.DropColumn(
                name: "AdresaPorosisID",
                table: "Shporta");
        }
    }
}
