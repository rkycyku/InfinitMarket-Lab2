using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class KategoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KategoriaController(ApplicationDbContext context)
        {
            _context = context;
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

        // [AllowAnonymous]
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

        //[AllowAnonymous]
        [AllowAnonymous]
        [HttpPost]
        [Route("shtoKategorin")]
        public async Task<IActionResult> Post(KategoriaProduktit kategoriaProduktit)
        {
            await _context.KategoriaProduktit.AddAsync(kategoriaProduktit);
            await _context.SaveChangesAsync();

            return CreatedAtAction("get", kategoriaProduktit.KategoriaId, kategoriaProduktit);
        }

        //[AllowAnonymous]
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

            return Ok();
        }
    }
}
