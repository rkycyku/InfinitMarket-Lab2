using InfinitMarket.Data;
using InfinitMarket.Models;
using InfinitMarket.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class KompaniaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public KompaniaController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [Authorize]
        [HttpGet]
        [Route("shfaqKompanit")]
        public async Task<IActionResult> ShfaqKompanit()
        {
            var kompanit = await _context.KompanitePartnere
                    .Where(k => k.isDeleted == "false")
                    .OrderBy(k => k.EmriKompanis)
                    .ToListAsync();

            return Ok(kompanit);
        }

        [Authorize]
        [HttpGet]
        [Route("shfaqKompaninSipasIDs")]
        public async Task<IActionResult> ShfaqKompaninSipasIDs(int id)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if (kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kompania nuk u gjet");
            }

            return Ok(kompania);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("shtoKompanin")]
        public async Task<IActionResult> ShtoKompanin(KompanitePartnere kompaniaPartnere)
        {
            await _context.KompanitePartnere.AddAsync(kompaniaPartnere);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "KompanitePartnere", kompaniaPartnere.KompaniaID.ToString(), $"Eshte Shtuar Kompania: {kompaniaPartnere.EmriKompanis}");

            return CreatedAtAction("get", kompaniaPartnere.KompaniaID, kompaniaPartnere);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("perditesoKompanin")]
        public async Task<IActionResult> PerditesoKompanin(int id, KompanitePartnere kompaniaPartnere)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if(kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kompania nuk u gjet");
            }

            kompania.EmriKompanis = kompaniaPartnere.EmriKompanis;
            kompania.Adresa = kompaniaPartnere.Adresa;

            _context.KompanitePartnere.Update(kompania);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Perditeso", "KompanitePartnere", kompaniaPartnere.KompaniaID.ToString(), $"Eshte Perditesuar Kompania: {kompaniaPartnere.EmriKompanis}");

            return Ok(kompania);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("fshijKompanin")]
        public async Task<IActionResult> FshijKompanin(int id)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if (kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kategoria nuk u gjet");
            }

            kompania.isDeleted = "true";

            _context.KompanitePartnere.Update(kompania);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "KompanitePartnere", kompania.KompaniaID.ToString(), $"Eshte Larguar Kompania: {kompania.EmriKompanis}");

            return Ok();
        }
    }
}
