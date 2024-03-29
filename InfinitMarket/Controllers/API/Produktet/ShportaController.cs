using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class ShportaController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public ShportaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqProduktetEShportes")]
        public async Task<IActionResult> ShfaqProduktetEShportes(int ShportaID)
        {
            var shporta = await _context.TeDhenatShporta.Include(x => x.Produkti).Where(x => x.ShportaID == ShportaID).ToListAsync();

            return Ok(shporta);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoProduktinNeShporte")]
        public async Task<IActionResult> ShtoProduktinNeShport(TeDhenatShporta teDhenatShporta)
        {
            await _context.TeDhenatShporta.AddAsync(teDhenatShporta);
            await _context.SaveChangesAsync();

            var shporta = await _context.Shporta.FindAsync(teDhenatShporta.ShportaID);

            if(shporta == null) {
                return BadRequest("Ndodhi nje gabim!");
            }

            shporta.TotaliProdukteveNeShporte += 1;
            shporta.DataEFunditEPerditesimit = DateTime.Now;

            _context.Shporta.Update(shporta);
            await _context.SaveChangesAsync(); 

            return CreatedAtAction("get", teDhenatShporta.TeDhenatShportaID, teDhenatShporta);
        }
    }
}
