using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class InsertimiITeDhenave : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.InsertData(
              table: "AspNetRoles",
              columns: new[] { "Id", "Name", "NormalizedName", "ConcurrencyStamp" },
              values: new object[,]
              {
            { "00000000-0000-0000-0000-000000000000", "User", "USER", "00000000-0000-0000-0000-000000000000" },
            { "01010101-0101-0101-0101-010101010101", "Admin", "ADMIN", "01010101-0101-0101-0101-010101010101" },
            { "02020202-0202-0202-0202-020202020202", "Shites", "SHITES", "02020202-0202-0202-0202-020202020202" },
            { "03030303-0303-0303-0303-030303030303", "Klient", "KLIENT", "03030303-0303-0303-0303-030303030303" },
              });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[]
                {
            "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
            "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
            "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled",
            "LockoutEnd", "LockoutEnabled", "AccessFailedCount"
                },
                values: new object[,]
                {
            {
                "01010101-0101-0101-0101-010101010101", "admin@infinitmarket.com", "ADMIN@INFINITMARKET.COM",
                "admin@infinitmarket.com", "ADMIN@INFINITMARKET.COM", false,
                "AQAAAAEAACcQAAAAEJlO6MbXUfC+q4JVGrZEjKV6z1dDnA323QebRD85vPQJ3ScQEmBr3P8zKSHwu5Cy2w==",
                "PKJ54KGIZB4MOS3BACM2INRJE54VBB32", "9e6bf9b8-daa7-42b1-9529-f17ee6633b0f",
                null, false, false, null, true, 0
            },
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[,]
                {

            { "01010101-0101-0101-0101-010101010101", "00000000-0000-0000-0000-000000000000" },
            { "01010101-0101-0101-0101-010101010101", "01010101-0101-0101-0101-010101010101" },
            { "01010101-0101-0101-0101-010101010101", "02020202-0202-0202-0202-020202020202" },
            { "01010101-0101-0101-0101-010101010101", "03030303-0303-0303-0303-030303030303" },
                });

            migrationBuilder.InsertData(
                table: "Perdoruesit",
                columns: new[] { "UserID", "Emri", "Mbiemri", "Email", "Username", "AspNetUserId" },
                values: new object[,]
                {
            { 1, "Admin", "Admin", "admin@ubt-uni.net", "admin", "01010101-0101-0101-0101-010101010101" },
                });

            migrationBuilder.InsertData(
                table: "TeDhenatPerdoruesit",
                columns: new[] { "TeDhenatID", "NrKontaktit", "Qyteti", "ZipKodi", "Adresa", "Shteti", "UserID", "DataKrijimit", "DataLindjes", "EmailPersonal", "EmriPrindit", "Gjinia", "NrPersonal" },
                values: new object[,]
                {
            { 1, "38344111222", "Prishtine", "10000", "P.A.", "Kosove", 1, "1900-01-01T00:00:00.000Z", "1900-01-01T00:00:00.000Z", "email@gmail.com", "Filani", "M", "1100110011" },
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
