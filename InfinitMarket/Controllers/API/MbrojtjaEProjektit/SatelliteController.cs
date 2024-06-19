using InfinitMarket.Data;
using InfinitMarket.Models.MbrojtjaEProjektit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers.MbrojtjaProjektit
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/MbrojtjaEProjektit/[controller]")]
    public class SatelliteController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SatelliteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqSatelitet")]
        public async Task<IActionResult> ShfaqSatelitet()
        {
            var satelitet = await _context.Satellite.Include(x => x.Planet).Where(x => x.isDeleted == "false").ToListAsync();

            return Ok(satelitet);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqSatelitinNgaID")]
        public async Task<IActionResult> ShfaqSatelitinNgaID(int SatelitiId)
        {
            var sateliti = await _context.Satellite.Include(x => x.Planet).FirstOrDefaultAsync(x => x.SatelliteId == SatelitiId);

            if (sateliti == null || sateliti.isDeleted == "true")
            {
                return NotFound();
            }

            return Ok(sateliti);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoSatelitin")]
        public async Task<IActionResult> ShtoSatelitin([FromBody] Satellite sateliti)
        {
            await _context.Satellite.AddAsync(sateliti);
            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqSatelitet", sateliti.SatelliteId, sateliti);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoSatelitin")]
        public async Task<IActionResult> PerditesoSatelitin(int SatelitiId, [FromBody] Satellite s)
        {
            var sateliti = await _context.Satellite.FirstOrDefaultAsync(x => x.SatelliteId == SatelitiId);

            if (sateliti == null || sateliti.isDeleted == "true")
            {
                return NotFound();
            }

            sateliti.Name = s.Name;
            sateliti.PlanetId = s.PlanetId;

            _context.Satellite.Update(sateliti);
            await _context.SaveChangesAsync();

            return Ok(sateliti);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijSatelitin")]
        public async Task<IActionResult> FshijSatelitin(int SatelitiId)
        {
            var sateliti = await _context.Satellite.FirstOrDefaultAsync(x => x.SatelliteId == SatelitiId);

            if (sateliti == null || sateliti.isDeleted == "true")
            {
                return NotFound();
            }

            sateliti.isDeleted = "true";

            _context.Satellite.Update(sateliti);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
