using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class PerditesimiAdresavePerdoruesit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "AdresatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NrKontaktit",
                table: "AdresatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "AdresatPerdoruesit");

            migrationBuilder.DropColumn(
                name: "NrKontaktit",
                table: "AdresatPerdoruesit");
        }
    }
}
