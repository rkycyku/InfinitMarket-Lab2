using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/Produktet/[controller]")]
    public class ZbritjaQmimitProduktitController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ZbritjaQmimitProduktitController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqZbritjet")]
        public async Task<IActionResult> get()
        {
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

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoZbritjenProduktit")]
        public async Task<IActionResult> Post(ZbritjaQmimitProduktit zbritja)
        {
            await _context.ZbritjaQmimitProduktit.AddAsync(zbritja);
            await _context.SaveChangesAsync();

            return CreatedAtAction("get", zbritja.ProduktiId, zbritja);
        }

        [AllowAnonymous]
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

            return NoContent();
        }
    }
}
