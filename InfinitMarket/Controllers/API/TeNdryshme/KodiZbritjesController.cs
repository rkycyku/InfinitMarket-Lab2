using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/TeNdryshme/[controller]")]
    public class KodiZbritjeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public KodiZbritjeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
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

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoKodin")]
        public async Task<IActionResult> ShtoKodin(KodiZbritjes kodiZbritjes)
        {
            await _context.KodiZbritjes.AddAsync(kodiZbritjes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqKodet", kodiZbritjes.Kodi, kodiZbritjes);
        }

        [AllowAnonymous]
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

            return Ok(teDhenatKodit);
        }

        [AllowAnonymous]
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

            return NoContent();
        }
    }
}
