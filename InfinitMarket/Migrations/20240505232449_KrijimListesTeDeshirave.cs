using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimListesTeDeshirave : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListaEDeshirave",
                columns: table => new
                {
                    ListaEDeshiraveID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProduktiID = table.Column<int>(type: "int", nullable: false),
                    KlientiID = table.Column<int>(type: "int", nullable: false),
                    DataKrijimit = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListaEDeshirave", x => x.ListaEDeshiraveID);
                    table.ForeignKey(
                        name: "FK_ListaEDeshirave_Perdoruesit_KlientiID",
                        column: x => x.KlientiID,
                        principalTable: "Perdoruesit",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListaEDeshirave_Produkti_ProduktiID",
                        column: x => x.ProduktiID,
                        principalTable: "Produkti",
                        principalColumn: "ProduktiId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListaEDeshirave_KlientiID",
                table: "ListaEDeshirave",
                column: "KlientiID");

            migrationBuilder.CreateIndex(
                name: "IX_ListaEDeshirave_ProduktiID",
                table: "ListaEDeshirave",
                column: "ProduktiID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListaEDeshirave");
        }
    }
}
