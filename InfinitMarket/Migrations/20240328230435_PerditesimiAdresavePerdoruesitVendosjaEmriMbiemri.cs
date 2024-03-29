using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class PerditesimiAdresavePerdoruesitVendosjaEmriMbiemri : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Emri",
                table: "AdresatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mbiemri",
                table: "AdresatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Emri",
                table: "AdresatPerdoruesit");

            migrationBuilder.DropColumn(
                name: "Mbiemri",
                table: "AdresatPerdoruesit");
        }
    }
}
