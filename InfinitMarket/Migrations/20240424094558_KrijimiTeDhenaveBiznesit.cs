using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class KrijimiTeDhenaveBiznesit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bankat",
                columns: table => new
                {
                    BankaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmriBankes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumriLlogaris = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdresaBankes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Valuta = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bankat", x => x.BankaID);
                });

            migrationBuilder.CreateTable(
                name: "TeDhenatBiznesit",
                columns: table => new
                {
                    IDTeDhenatBiznesit = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmriIBiznesit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShkurtesaEmritBiznesit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NUI = table.Column<int>(type: "int", nullable: true),
                    NF = table.Column<int>(type: "int", nullable: true),
                    NrTVSH = table.Column<int>(type: "int", nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NrKontaktit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Logo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeDhenatBiznesit", x => x.IDTeDhenatBiznesit);
                });

            migrationBuilder.InsertData(
                table: "TeDhenatBiznesit",
                columns: new[] { "IDTeDhenatBiznesit", "EmriIBiznesit", "ShkurtesaEmritBiznesit", "NUI", "NF", "NrTVSH", "Adresa", "NrKontaktit", "Email", "Logo" },
                values: new object[,]
                {
                    { 1, "", "", "0", "0", "0", "", "0", "", "PaLogo.png"}
                });

            migrationBuilder.InsertData(
                table: "Bankat",
                columns: new[] { "BankaID", "EmriBankes", "NumriLlogaris", "AdresaBankes", "Valuta" },
                values: new object[,]
                {
                    { 1, "NLB Banka SH. A.", "1111000011110000", "Ukshin Hoti nr 124, Prishtinë, Kosovë", "Euro"},
                    { 2, "Raiffeisen Bank Kosovo", "2222000022220000", "Prishtinë, Kosovë", "Euro"},
                    { 3, "NLB Banka SH. A.", "3333000033330000", "Ukshin Hoti nr 124, Prishtinë, Kosovë", "Dollar"},
                    { 4, "Raiffeisen Bank Kosovo", "4444000044440000", "Prishtinë, Kosovë", "Dollar"},
                    { 5, "NLB Banka SH. A.", "5555000055550000", "Ukshin Hoti nr 124, Prishtinë, Kosovë", "Franga Zvicerane"},
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bankat");

            migrationBuilder.DropTable(
                name: "TeDhenatBiznesit");
        }
    }
}
