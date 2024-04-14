using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class PerditesimiIShportesMeTvsh : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "llojiTVSH",
                table: "TeDhenatProduktit",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotProd18TVSH",
                table: "Shporta",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotProd8TVSH",
                table: "Shporta",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Totali18TVSH",
                table: "Shporta",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Totali8TVSH",
                table: "Shporta",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.UpdateData(
            table: "Shporta",
            keyColumn: "ShportaID",
            keyValue: 1,
            column: "TotProd18TVSH",
            value: 0);

            migrationBuilder.UpdateData(
                table: "Shporta",
                keyColumn: "ShportaID",
                keyValue: 1,
                column: "TotProd8TVSH",
                value: 0);

            migrationBuilder.UpdateData(
            table: "Shporta",
            keyColumn: "ShportaID",
            keyValue: 1,
            column: "Totali18TVSH",
            value: 0);

            migrationBuilder.UpdateData(
                table: "Shporta",
                keyColumn: "ShportaID",
                keyValue: 1,
                column: "Totali8TVSH",
                value: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "llojiTVSH",
                table: "TeDhenatProduktit");

            migrationBuilder.DropColumn(
                name: "TotProd18TVSH",
                table: "Shporta");

            migrationBuilder.DropColumn(
                name: "TotProd8TVSH",
                table: "Shporta");

            migrationBuilder.DropColumn(
                name: "Totali18TVSH",
                table: "Shporta");

            migrationBuilder.DropColumn(
                name: "Totali8TVSH",
                table: "Shporta");
        }
    }
}
