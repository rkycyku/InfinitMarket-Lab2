using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class RIlindVendosjaNeMbrojtje : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.DropTable(
                name: "Satellite");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Planet");

            migrationBuilder.CreateTable(
                name: "Building",
                columns: table => new
                {
                    BuildingID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Building", x => x.BuildingID);
                });

            migrationBuilder.CreateTable(
                name: "Renovation",
                columns: table => new
                {
                    RenovationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cost = table.Column<double>(type: "float", nullable: true),
                    BuildingID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Renovation", x => x.RenovationID);
                    table.ForeignKey(
                        name: "FK_Renovation_Building_BuildingID",
                        column: x => x.BuildingID,
                        principalTable: "Building",
                        principalColumn: "BuildingID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Renovation_BuildingID",
                table: "Renovation",
                column: "BuildingID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Renovation");

            migrationBuilder.DropTable(
                name: "Building");

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeId);
                });

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
                name: "Contract",
                columns: table => new
                {
                    ContractID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contract", x => x.ContractID);
                    table.ForeignKey(
                        name: "FK_Contract_Employee_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Satellite",
                columns: table => new
                {
                    SatelliteId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanetId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "IX_Contract_EmployeeID",
                table: "Contract",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Satellite_PlanetId",
                table: "Satellite",
                column: "PlanetId");
        }
    }
}
