using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class MbrojtjaProjektit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Planet",
                columns: table => new
                {
                    PlanetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planet", x => x.PlanetId);
                });

            migrationBuilder.CreateTable(
                name: "Satellite",
                columns: table => new
                {
                    SatelliteId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlanetId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Satellite", x => x.SatelliteId);
                    table.ForeignKey(
                        name: "FK_Satellite_Planet_PlanetId",
                        column: x => x.PlanetId,
                        principalTable: "Planet",
                        principalColumn: "PlanetId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Satellite_PlanetId",
                table: "Satellite",
                column: "PlanetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Satellite");

            migrationBuilder.DropTable(
                name: "Planet");

            migrationBuilder.CreateTable(
                name: "KategoriteEDetajeve",
                columns: table => new
                {
                    KategoriaDetajeveId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DetajetJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmriKategoriseDetajeve = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KategoriteEDetajeve", x => x.KategoriaDetajeveId);
                });

            migrationBuilder.CreateTable(
                name: "TeDhenatEDetajeve",
                columns: table => new
                {
                    TeDhenatEDetajeveId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KategoriaDetajeveId = table.Column<int>(type: "int", nullable: false),
                    TeDhenatJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeDhenatEDetajeve", x => x.TeDhenatEDetajeveId);
                    table.ForeignKey(
                        name: "FK_TeDhenatEDetajeve_KategoriteEDetajeve_KategoriaDetajeveId",
                        column: x => x.KategoriaDetajeveId,
                        principalTable: "KategoriteEDetajeve",
                        principalColumn: "KategoriaDetajeveId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeDhenatEDetajeve_KategoriaDetajeveId",
                table: "TeDhenatEDetajeve",
                column: "KategoriaDetajeveId");
        }
    }
}
