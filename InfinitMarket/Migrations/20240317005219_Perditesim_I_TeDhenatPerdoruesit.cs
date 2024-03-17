using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class Perditesim_I_TeDhenatPerdoruesit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailPersonal",
                table: "TeDhenatPerdoruesit");

            migrationBuilder.DropColumn(
                name: "EmriPrindit",
                table: "TeDhenatPerdoruesit");

            migrationBuilder.DropColumn(
                name: "NrPersonal",
                table: "TeDhenatPerdoruesit");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailPersonal",
                table: "TeDhenatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmriPrindit",
                table: "TeDhenatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NrPersonal",
                table: "TeDhenatPerdoruesit",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
