using InfinitMarket.Data;
using InfinitMarket.Models;
using InfinitMarket.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/TeNdryshme/[controller]")]
    public class KodiZbritjeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public KodiZbritjeController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpGet]
        [Route("ShfaqKodet")]
        public async Task<IActionResult> ShfaqKodet()
        {
            var kodet = await _context.KodiZbritjes
                .Include(x => x.Produkti)
                .OrderByDescending(x => x.DataKrijimit)
                .Where(x => x.isDeleted == "false" && x.Kodi != "NukKaZbritje")
                .ToListAsync();

            return Ok(kodet);
        }

        [Authorize]
        [HttpGet]
        [Route("GjejKodin")]
        public async Task<IActionResult> GjejKodin(string kodi)
        {
            var kodiZbritjes = await _context.KodiZbritjes
                .Include(x => x.Produkti)
                .Where(x => x.Kodi.Equals(kodi))
                .FirstOrDefaultAsync();

            if (kodiZbritjes == null || kodiZbritjes.isDeleted == "true")
            {
                return NotFound();
            }

            return Ok(kodiZbritjes);
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpPost]
        [Route("ShtoKodin")]
        public async Task<IActionResult> ShtoKodin(KodiZbritjes kodiZbritjes)
        {
            await _context.KodiZbritjes.AddAsync(kodiZbritjes);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "KodiZbrijes", kodiZbritjes.Kodi.ToString(), $"Kodi i Zbritjes u shtua: {kodiZbritjes.Kodi} - Shuma: {kodiZbritjes.QmimiZbritjes} €");

            return CreatedAtAction("ShfaqKodet", kodiZbritjes.Kodi, kodiZbritjes);
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpPut]
        [Route("PerditesoTeDhenatEKodit")]
        public async Task<IActionResult> PerditesoTeDhenatEKodit(String kodi, [FromBody] KodiZbritjes k)
        {
            var teDhenatKodit = await _context.KodiZbritjes.FirstOrDefaultAsync(x => x.Kodi.Equals(kodi));

            if (teDhenatKodit == null || teDhenatKodit.isDeleted == "true")
            {
                return NotFound();
            }

            if (k.QmimiZbritjes > 0)
            {
                teDhenatKodit.QmimiZbritjes = k.QmimiZbritjes;
            }

            if (k.ProduktiId == 0)
            {
                teDhenatKodit.ProduktiId = null;
            }
            else
            {
                teDhenatKodit.ProduktiId = k.ProduktiId;
            }

            _context.KodiZbritjes.Update(teDhenatKodit);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Perditeso", "KodiZbrijes", kodi.ToString(), $"Kodi i Zbritjes u perditesua: {kodi} - Shuma: {k.QmimiZbritjes} €");

            return Ok(teDhenatKodit);
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpDelete]
        [Route("FshijKodin")]
        public async Task<IActionResult> Delete(String kodi)
        {
            var teDhenatKodit = await _context.KodiZbritjes.FirstOrDefaultAsync(x => x.Kodi.Equals(kodi));

            if (teDhenatKodit == null || teDhenatKodit.isDeleted == "true")
            {
                return NotFound();
            }

            teDhenatKodit.isDeleted = "true";

            _context.KodiZbritjes.Update(teDhenatKodit);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "KodiZbrijes", kodi.ToString(), $"Kodi i Zbritjes u Fshi: {kodi}");

            return NoContent();
        }
    }
}
