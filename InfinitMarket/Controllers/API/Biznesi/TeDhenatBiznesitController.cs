using InfinitMarket.Data;
using InfinitMarket.Models;
using InfinitMarket.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace InfinitMarket.Controllers.API.Biznesi
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("/api/Biznesi/[controller]")]
    public class TeDhenatBiznesitController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public TeDhenatBiznesitController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqTeDhenat")]
        public async Task<IActionResult> ShfaqTeDhenat()
        {
            var teDhenat = await _context.TeDhenatBiznesit.FirstOrDefaultAsync();

            return Ok(teDhenat);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("PerditesoTeDhenat")]
        public async Task<IActionResult> PerditesoTeDhenat([FromBody] TeDhenatBiznesit k)
        {
            var teDhenat = await _context.TeDhenatBiznesit.Where(x => x.IDTeDhenatBiznesit == 1).FirstOrDefaultAsync();
            if (teDhenat == null)
            {
                return NotFound();
            }

            teDhenat.NrKontaktit = k.NrKontaktit;
            teDhenat.NF = k.NF;
            teDhenat.NUI = k.NUI;
            teDhenat.Email = k.Email;
            teDhenat.EmriIBiznesit = k.EmriIBiznesit;
            teDhenat.ShkurtesaEmritBiznesit = k.ShkurtesaEmritBiznesit;
            teDhenat.NrTVSH = k.NrTVSH;
            teDhenat.Adresa = k.Adresa;
            teDhenat.Logo = k.Logo;

            _context.TeDhenatBiznesit.Update(teDhenat);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Perditeso", "TeDhenatBiznesit", k.IDTeDhenatBiznesit.ToString(), $"Eshte bere perditesimi i te dhenave te Biznesit");

            return Ok(teDhenat);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqBankat")]
        public async Task<IActionResult> ShfaqBankat()
        {
            var bankat = await _context.Bankat.OrderBy(x => x.EmriBankes).ToListAsync();

            return Ok(bankat);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqBankenNgaID")]
        public async Task<IActionResult> ShfaqBankenNgaID(int id)
        {
            var bankaNgaID = await _context.Bankat
                .Where(x => x.BankaID == id).ToListAsync();

            if (bankaNgaID == null)
            {
                return NotFound();
            }

            return Ok(bankaNgaID);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("ShtoBanken")]
        public async Task<IActionResult> ShtoBanken(Bankat banka)
        {
            await _context.Bankat.AddAsync(banka);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "Bankat", banka.BankaID.ToString(), $"Eshte shtuar Banka: {banka.EmriBankes} - Nr. Llogaris: {banka.NumriLlogaris}");

            return CreatedAtAction("ShfaqBankat", banka.BankaID, banka);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("FshijBanken")]
        public async Task<IActionResult> FshijBanken(int id)
        {
            var banka = await _context.Bankat.FirstOrDefaultAsync(x => x.BankaID == id);

            if (banka == null)
            {
                return NotFound();
            }

            _context.Bankat.Remove(banka);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "Bankat", banka.BankaID.ToString(), $"Eshte Larguar Banka: {banka.EmriBankes} - Nr.Llogaris: {banka.NumriLlogaris}");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("PerditesoBanken")]
        public async Task<IActionResult> PerditesoBanken(int id, [FromBody] Bankat b)
        {
            var banka = _context.Bankat.FirstOrDefault(x => x.BankaID == id);
            if (banka == null)
            {
                return NotFound();
            }

            if (!b.EmriBankes.IsNullOrEmpty())
            {
                banka.EmriBankes = b.EmriBankes;
            }
            if (!b.Valuta.IsNullOrEmpty())
            {
                banka.Valuta = b.Valuta;
            }
            if (!b.AdresaBankes.IsNullOrEmpty())
            {
                banka.AdresaBankes = b.AdresaBankes;
            }
            if (!b.NumriLlogaris.IsNullOrEmpty())
            {
                banka.NumriLlogaris = b.NumriLlogaris;
            }

            _context.Bankat.Update(banka);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "Bankat", banka.BankaID.ToString(), $"Eshte shtuar Banka: {banka.EmriBankes} - Shuma: {banka.NumriLlogaris}");

            return Ok(banka);
        }
    }
}
