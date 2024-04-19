using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class TeDhenatEDetajeve : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeDhenatEDetajeve");
        }
    }
}
