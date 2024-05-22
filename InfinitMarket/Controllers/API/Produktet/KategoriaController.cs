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
    public class KategoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public KategoriaController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKategorit")]
        public async Task<IActionResult> ShfaqKategorit()
        {
            var kategorit = await _context.KategoriaProduktit
                    .Where(k => k.isDeleted == "false")
                    .OrderBy(k => k.LlojiKategoris)
                    .ToListAsync();

            return Ok(kategorit);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKategorinSipasIDs")]
        public async Task<IActionResult> ShfaqKategorinSipasIDs(int id)
        {
            var kategoria = await _context.KategoriaProduktit.FindAsync(id);
            if (kategoria == null || kategoria.isDeleted == "true")
            {
                return BadRequest("Kategoria nuk u gjet");
            }

            return Ok(kategoria);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoKategorin")]
        public async Task<IActionResult> Post(KategoriaProduktit kategoriaProduktit)
        {
            await _context.KategoriaProduktit.AddAsync(kategoriaProduktit);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "KategoriaProduktit", kategoriaProduktit.KategoriaId.ToString(), $"Eshte Shtuar Kategoria e Produktit: {kategoriaProduktit.LlojiKategoris}");

            return CreatedAtAction("get", kategoriaProduktit.KategoriaId, kategoriaProduktit);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("perditesoKategorin")]
        public async Task<IActionResult> PerditesoKategorin(int id, KategoriaProduktit kategoriaProduktit)
        {
            var kategoria = await _context.KategoriaProduktit.FindAsync(id);

            if(kategoria == null || kategoria.isDeleted == "true")
            {
                return BadRequest("Kategoria nuk u gjet");
            }

            kategoria.PershkrimiKategoris = kategoriaProduktit.PershkrimiKategoris;
            kategoria.LlojiKategoris = kategoriaProduktit.LlojiKategoris;

            _context.KategoriaProduktit.Update(kategoria);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Perditeso", "KategoriaProduktit", kategoriaProduktit.KategoriaId.ToString(), $"Eshte Perditesuar Kategoria e Produktit: {kategoriaProduktit.LlojiKategoris}");

            return Ok(kategoria);
        }

        //[AllowAnonymous]
        [AllowAnonymous]
        [HttpDelete]
        [Route("fshijKategorin")]
        public async Task<IActionResult> FshijKategorin(int id)
        {
            var kategoria = await _context.KategoriaProduktit.FindAsync(id);
            if (kategoria == null || kategoria.isDeleted == "true")
            {
                return BadRequest("Kategoria nuk u gjet");
            }

            kategoria.isDeleted = "true";

            _context.KategoriaProduktit.Update(kategoria);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "KategoriaProduktit", kategoria.KategoriaId.ToString(), $"Eshte larguar Kategoria e Produktit: {kategoria.LlojiKategoris}");

            return Ok();
        }
    }
}
