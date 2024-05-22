using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Services
{
    public class AdminLogService : IAdminLogService
    {
        private readonly ApplicationDbContext _context;

        public AdminLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(string userId, string veprimi, string entiteti, string entitetiId, string detaje)
        {
            var stafi = await _context.Perdoruesit.Where(x => x.EmailFillestar == userId).FirstOrDefaultAsync();

            if (stafi == null)
            {
                throw new Exception("User not found 2");
            }

            var log = new AdminLogs
            {
                StafiId = stafi.UserID,
                Veprimi = veprimi,
                Entiteti = entiteti,
                EntitetiId = entitetiId,
                Koha = DateTime.UtcNow,
                Detaje = detaje
            };

            _context.AdminLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
