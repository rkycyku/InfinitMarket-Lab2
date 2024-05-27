using InfinitMarket.Data;
using InfinitMarket.Models;
using InfinitMarket.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/Produktet/[controller]")]
    public class ZbritjaQmimitProduktitController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public ZbritjaQmimitProduktitController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [Authorize]
        [HttpGet]
        [Route("shfaqZbritjet")]
        public async Task<IActionResult> get()
        {
            var dataAktuale = DateTime.Now;

            var ZbritjetEVjetra = await _context.ZbritjaQmimitProduktit
                .Where(x => x.DataSkadimit <= dataAktuale)
                .ToListAsync(); 

            if (ZbritjetEVjetra.Count > 0)
            {
                foreach (var zbritja in ZbritjetEVjetra)
                {
                    var produkti = await _context.ZbritjaQmimitProduktit.FirstOrDefaultAsync(x => x.ZbritjaID == zbritja.ZbritjaID);

                    if (produkti == null)
                    {
                        return BadRequest("Zbritja nuk u gjet!");
                    }

                    _context.ZbritjaQmimitProduktit.Remove(produkti);
                    await _context.SaveChangesAsync();
                }
            }

            var prodMeZbritje = await _context.Produkti
                .Where(x => x.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit != null)
                .Select(x => new
                {
                    x.EmriProduktit,
                    x.ZbritjaQmimitProduktit.ProduktiId,
                    x.ZbritjaQmimitProduktit.QmimiPaZbritjeProduktit,
                    x.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit,
                    x.ZbritjaQmimitProduktit.DataZbritjes,
                    x.ZbritjaQmimitProduktit.DataSkadimit,
                    x.ZbritjaQmimitProduktit.ZbritjaID
                }).ToListAsync();

            return Ok(prodMeZbritje);
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpPost]
        [Route("shtoZbritjenProduktit")]
        public async Task<IActionResult> Post(ZbritjaQmimitProduktit zbritja)
        {
            await _context.ZbritjaQmimitProduktit.AddAsync(zbritja);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "ZbritjaQmimitProduktit", zbritja.ZbritjaID.ToString(), $"Eshte Shtuar Zbritja per produktin: {zbritja.ProduktiId}");

            return CreatedAtAction("get", zbritja.ProduktiId, zbritja);
        }

        [Authorize(Roles = "Admin, Shites")]
        [HttpDelete]
        [Route("fshijZbritjenProduktit")]
        public async Task<IActionResult> Delete(int id)
        {
            var produkti = await _context.ZbritjaQmimitProduktit.FirstOrDefaultAsync(x => x.ZbritjaID == id);

            if (produkti == null)
            {
                return BadRequest("Zbritja nuk u gjet!");
            }

            _context.ZbritjaQmimitProduktit.Remove(produkti);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "ZbritjaQmimitProduktit", id.ToString(), $"Eshte Larguar Zbritja per produktin: {produkti.ProduktiId}");

            return NoContent();
        }
    }
}
