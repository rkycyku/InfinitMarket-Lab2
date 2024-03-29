﻿// <auto-generated />
using System;
using InfinitMarket.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace InfinitMarket.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240329131524_PerditesimiIShportes")]
    partial class PerditesimiIShportes
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("InfinitMarket.Models.AdresatPerdoruesit", b =>
                {
                    b.Property<int>("AdresaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdresaID"), 1L, 1);

                    b.Property<string>("Adresa")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Emri")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Mbiemri")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NrKontaktit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PerdoruesiID")
                        .HasColumnType("int");

                    b.Property<string>("Qyteti")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Shteti")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ZipKodi")
                        .HasColumnType("int");

                    b.HasKey("AdresaID");

                    b.HasIndex("PerdoruesiID");

                    b.ToTable("AdresatPerdoruesit");
                });

            modelBuilder.Entity("InfinitMarket.Models.KategoriaProduktit", b =>
                {
                    b.Property<int>("KategoriaId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("KategoriaId"), 1L, 1);

                    b.Property<string>("LlojiKategoris")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PershkrimiKategoris")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("isDeleted")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("KategoriaId");

                    b.ToTable("KategoriaProduktit");
                });

            modelBuilder.Entity("InfinitMarket.Models.KompanitePartnere", b =>
                {
                    b.Property<int>("KompaniaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("KompaniaID"), 1L, 1);

                    b.Property<string>("Adresa")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmriKompanis")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("isDeleted")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("KompaniaID");

                    b.ToTable("KompanitePartnere");
                });

            modelBuilder.Entity("InfinitMarket.Models.Perdoruesi", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"), 1L, 1);

                    b.Property<string>("AspNetUserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime?>("DataKrijimit")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmailFillestar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Emri")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Mbiemri")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserID");

                    b.HasIndex("AspNetUserId");

                    b.ToTable("Perdoruesit");
                });

            modelBuilder.Entity("InfinitMarket.Models.Produkti", b =>
                {
                    b.Property<int>("ProduktiId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProduktiId"), 1L, 1);

                    b.Property<string>("EmriProduktit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FotoProduktit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("KategoriaId")
                        .HasColumnType("int");

                    b.Property<int?>("KompaniaId")
                        .HasColumnType("int");

                    b.Property<string>("Pershkrimi")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("isDeleted")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ProduktiId");

                    b.HasIndex("KategoriaId");

                    b.HasIndex("KompaniaId");

                    b.ToTable("Produkti");
                });

            modelBuilder.Entity("InfinitMarket.Models.Shporta", b =>
                {
                    b.Property<int>("ShportaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ShportaID"), 1L, 1);

                    b.Property<DateTime?>("DataEFunditEPerditesimit")
                        .HasColumnType("datetime2");

                    b.Property<int?>("PerdoruesiID")
                        .HasColumnType("int");

                    b.Property<int?>("TotaliProdukteveNeShporte")
                        .HasColumnType("int");

                    b.HasKey("ShportaID");

                    b.HasIndex("PerdoruesiID");

                    b.ToTable("Shporta");
                });

            modelBuilder.Entity("InfinitMarket.Models.SliderOfertat", b =>
                {
                    b.Property<int>("SliderOfertatID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SliderOfertatID"), 1L, 1);

                    b.Property<DateTime?>("DataFillimitOfertes")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataMbarimitOfertes")
                        .HasColumnType("datetime2");

                    b.Property<string>("FotoOferta")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LinkuOfertes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("isDeleted")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SliderOfertatID");

                    b.ToTable("SliderOfertat");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatPerdoruesit", b =>
                {
                    b.Property<int>("TeDhenatID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TeDhenatID"), 1L, 1);

                    b.Property<string>("Adresa")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DataKrijimit")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataLindjes")
                        .HasColumnType("datetime2");

                    b.Property<string>("Gjinia")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NrKontaktit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Qyteti")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Shteti")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.Property<int?>("ZipKodi")
                        .HasColumnType("int");

                    b.HasKey("TeDhenatID");

                    b.HasIndex("UserID")
                        .IsUnique();

                    b.ToTable("TeDhenatPerdoruesit");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatProduktit", b =>
                {
                    b.Property<int>("TeDhenatProduktitID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TeDhenatProduktitID"), 1L, 1);

                    b.Property<DateTime?>("DataKrijimit")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataPerditsimit")
                        .HasColumnType("datetime2");

                    b.Property<int>("ProduktiId")
                        .HasColumnType("int");

                    b.Property<decimal?>("QmimiBleres")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal?>("QmimiProduktit")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int?>("SasiaNeStok")
                        .HasColumnType("int");

                    b.HasKey("TeDhenatProduktitID");

                    b.HasIndex("ProduktiId")
                        .IsUnique();

                    b.ToTable("TeDhenatProduktit");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatShporta", b =>
                {
                    b.Property<int>("TeDhenatShportaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TeDhenatShportaID"), 1L, 1);

                    b.Property<DateTime?>("KohaEVendosjesNeShportes")
                        .HasColumnType("datetime2");

                    b.Property<int>("ProduktiID")
                        .HasColumnType("int");

                    b.Property<int?>("SasiaProduktit")
                        .HasColumnType("int");

                    b.Property<int>("ShportaID")
                        .HasColumnType("int");

                    b.HasKey("TeDhenatShportaID");

                    b.HasIndex("ProduktiID");

                    b.HasIndex("ShportaID");

                    b.ToTable("TeDhenatShporta");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("InfinitMarket.Models.AdresatPerdoruesit", b =>
                {
                    b.HasOne("InfinitMarket.Models.Perdoruesi", "Perdoruesi")
                        .WithMany()
                        .HasForeignKey("PerdoruesiID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Perdoruesi");
                });

            modelBuilder.Entity("InfinitMarket.Models.Perdoruesi", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", "AspNetUser")
                        .WithMany()
                        .HasForeignKey("AspNetUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AspNetUser");
                });

            modelBuilder.Entity("InfinitMarket.Models.Produkti", b =>
                {
                    b.HasOne("InfinitMarket.Models.KategoriaProduktit", "Kategoria")
                        .WithMany()
                        .HasForeignKey("KategoriaId");

                    b.HasOne("InfinitMarket.Models.KompanitePartnere", "KompanitePartnere")
                        .WithMany()
                        .HasForeignKey("KompaniaId");

                    b.Navigation("Kategoria");

                    b.Navigation("KompanitePartnere");
                });

            modelBuilder.Entity("InfinitMarket.Models.Shporta", b =>
                {
                    b.HasOne("InfinitMarket.Models.Perdoruesi", "Perdoruesi")
                        .WithMany()
                        .HasForeignKey("PerdoruesiID");

                    b.Navigation("Perdoruesi");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatPerdoruesit", b =>
                {
                    b.HasOne("InfinitMarket.Models.Perdoruesi", "User")
                        .WithOne("TeDhenatPerdoruesit")
                        .HasForeignKey("InfinitMarket.Models.TeDhenatPerdoruesit", "UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatProduktit", b =>
                {
                    b.HasOne("InfinitMarket.Models.Produkti", "Produkti")
                        .WithOne("TeDhenatProduktit")
                        .HasForeignKey("InfinitMarket.Models.TeDhenatProduktit", "ProduktiId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Produkti");
                });

            modelBuilder.Entity("InfinitMarket.Models.TeDhenatShporta", b =>
                {
                    b.HasOne("InfinitMarket.Models.Produkti", "Produkti")
                        .WithMany()
                        .HasForeignKey("ProduktiID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("InfinitMarket.Models.Shporta", "Shporta")
                        .WithMany()
                        .HasForeignKey("ShportaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Produkti");

                    b.Navigation("Shporta");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("InfinitMarket.Models.Perdoruesi", b =>
                {
                    b.Navigation("TeDhenatPerdoruesit");
                });

            modelBuilder.Entity("InfinitMarket.Models.Produkti", b =>
                {
                    b.Navigation("TeDhenatProduktit");
                });
#pragma warning restore 612, 618
        }
    }
}
