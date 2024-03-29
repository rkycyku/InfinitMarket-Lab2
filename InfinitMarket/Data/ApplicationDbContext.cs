using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using InfinitMarket;
using InfinitMarket.Models;

namespace InfinitMarket.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Perdoruesi> Perdoruesit { get; set; }
        public DbSet<TeDhenatPerdoruesit> TeDhenatPerdoruesit { get; set; }
        public DbSet<SliderOfertat> SliderOfertat { get; set; }
        public DbSet<Shporta> Shporta { get; set; }
        public DbSet<KategoriaProduktit> KategoriaProduktit { get; set; }
        public DbSet<KompanitePartnere> KompanitePartnere { get; set; }
        public DbSet<AdresatPerdoruesit> AdresatPerdoruesit { get; set; }
        public DbSet<Produkti> Produkti { get; set; }
        public DbSet<TeDhenatProduktit> TeDhenatProduktit { get; set; }
        public DbSet<TeDhenatShporta> TeDhenatShporta { get; set; }
    }
}