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
    }
}