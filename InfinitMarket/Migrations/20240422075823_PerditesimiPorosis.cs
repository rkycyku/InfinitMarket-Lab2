using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class PerditesimiPorosis : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QmimiTotal",
                table: "TeDhenatEPorosis");

            migrationBuilder.AddColumn<int>(
                name: "AdresaID",
                table: "Porosit",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LlojiPageses",
                table: "Porosit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LlojiTransportit",
                table: "Porosit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QmimiTransportit",
                table: "Porosit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Porosit_AdresaID",
                table: "Porosit",
                column: "AdresaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Porosit_AdresatPerdoruesit_AdresaID",
                table: "Porosit",
                column: "AdresaID",
                principalTable: "AdresatPerdoruesit",
                principalColumn: "AdresaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Porosit_AdresatPerdoruesit_AdresaID",
                table: "Porosit");

            migrationBuilder.DropIndex(
                name: "IX_Porosit_AdresaID",
                table: "Porosit");

            migrationBuilder.DropColumn(
                name: "AdresaID",
                table: "Porosit");

            migrationBuilder.DropColumn(
                name: "LlojiPageses",
                table: "Porosit");

            migrationBuilder.DropColumn(
                name: "LlojiTransportit",
                table: "Porosit");

            migrationBuilder.DropColumn(
                name: "QmimiTransportit",
                table: "Porosit");

            migrationBuilder.AddColumn<decimal>(
                name: "QmimiTotal",
                table: "TeDhenatEPorosis",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
