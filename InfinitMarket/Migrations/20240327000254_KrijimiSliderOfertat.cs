using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiSliderOfertat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SliderOfertat",
                columns: table => new
                {
                    SliderOfertatID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LinkuOfertes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataFillimitOfertes = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataMbarimitOfertes = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SliderOfertat", x => x.SliderOfertatID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SliderOfertat");
        }
    }
}
