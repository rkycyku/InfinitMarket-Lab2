using Humanizer;
using Microsoft.EntityFrameworkCore.Migrations;
using Stripe;
using System;

#nullable disable

namespace InfinitMarket.Migrations
{
    public partial class VendosjaPerderoueseveTeRi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                 "02020202-0202-0202-0202-020202020202", "shites@infinitmarket.com", "SHITES@INFINITMARKET.COM",
                 "shites@infinitmarket.com", "SHITES@INFINITMARKET.COM", false,
                 "AQAAAAEAACcQAAAAENkKNn7mLh3hM4zeDHZQArPLIHQB0+Vtoaxr9MYbonMFZH7lxaGQaM/cyZU6Bj/pmQ==",
                 "2EJUOJNA5VYQNBVBR6PI6FFQV2SWPAKX", "5cb46f3a-581b-4fc5-8a7e-da38b5d66f86",
                 null, false, false, null, true, 0
             },{
                 "03030303-0303-0303-0303-030303030303", "klinet@infinitmarket.com", "KLIENT@INFINITMARKET.COM",
                 "klient@infinitmarket.com", "KLIENT@INFINITMARKET.COM", false,
                 "AQAAAAEAACcQAAAAEFi6etUZF9xCH7+Mxk5sTbApIdYu40xyonsPREF2R2rWLqOFr3k0dS+JBdpF/XBRNQ==",
                 "BCHXXARXNVZOBBXWS7MSKKEUI72NJAJN", "fa94d173-13fb-47bf-97e2-58834a10be71",
                 null, false, false, null, true, 0
             },
            });
            migrationBuilder.InsertData(
               table: "AspNetUserRoles",
               columns: new[] { "UserId", "RoleId" },
               values: new object[,]
               {

            { "02020202-0202-0202-0202-020202020202", "01010101-0101-0101-0101-010101010101" },
            { "02020202-0202-0202-0202-020202020202", "03030303-0303-0303-0303-030303030303" },
            { "03030303-0303-0303-0303-030303030303", "01010101-0101-0101-0101-010101010101" },
               });

            migrationBuilder.InsertData(
                table: "Perdoruesit",
                columns: new[] { "UserID", "Emri", "Mbiemri", "Email", "EmailFillestar", "AspNetUserId", "DataKrijimit" },
                values: new object[,]
                {
                     { 2, "Shites", "Shites", "shites@infinitmarket.com", "shites@infinitmarket.com", "02020202-0202-0202-0202-020202020202","1900-01-01T00:00:00.000Z" },
                     { 3, "Klient", "Klient", "klient@infinitmarket.com", "klient@infinitmarket.com", "03030303-0303-0303-0303-030303030303","1900-01-01T00:00:00.000Z" },
            });
            migrationBuilder.UpdateData(
                table: "Perdoruesit",
                keyColumn: "UserID",
                keyValue: 1,
                column: "DataKrijimit",
                value: "1900-01-01T00:00:00.000Z");

            migrationBuilder.InsertData(
                table: "TeDhenatPerdoruesit",
                columns: new[] { "TeDhenatID", "NrKontaktit", "Qyteti", "ZipKodi", "Adresa", "Shteti", "UserID", "DataKrijimit", "DataLindjes","Gjinia"},
                values: new object[,]
                {
                    { 2, "+38345111222", "Prishtine", 10000, "P.A.", "Kosove", 2, "1900-01-01T00:00:00.000Z", "1900-01-01T00:00:00.000Z","M"},
                    { 3, "+38346111222", "Prishtine", 10000, "P.A.", "Kosove", 3, "1900-01-01T00:00:00.000Z", "1900-01-01T00:00:00.000Z","F"},
                });

            migrationBuilder.InsertData(
                table: "AdresatPerdoruesit",
                columns: new[] { "AdresaID", "PerdoruesiID", "Qyteti", "ZipKodi", "Adresa", "Shteti", "Email", "NrKontaktit", "Emri", "Mbiemri" },
                values: new object[,]
                {
            { 2, 2,  "Prishtine", 10000,  "P.A.", "Kosove",  "shites@infinitmarket.com", "+38345111222",  "Shites",  "Shites" },
            { 3, 3,  "Prishtine", 10000,  "P.A.", "Kosove",  "klient@infinitmarket.com", "+38346111222",  "Klient",  "Klient" },
                });

            migrationBuilder.InsertData(
                table: "Shporta",
                columns: new[] { "ShportaID", "PerdoruesiID", "TotaliProdukteveNeShporte", "DataEFunditEPerditesimit", "TotProd18TVSH", "TotProd8TVSH", "Totali18TVSH", "Totali8TVSH", "KodiZbritjesID", "AdresaPorosisID" },
                values: new object[,]
                {
            { 2, 2, 0, "1900-01-01T00:00:00.000Z", 0, 0,0, 0, "NukKaZbritje", 2 },
            { 3, 3, 0, "1900-01-01T00:00:00.000Z", 0, 0,0, 0, "NukKaZbritje", 3 },
                });

            


        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
