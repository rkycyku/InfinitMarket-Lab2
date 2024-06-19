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
    public class PlanetController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PlanetController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqPlanetet")]
        public async Task<IActionResult> ShfaqPlanete()
        {
            var planetet = await _context.Planet.Where(x => x.isDeleted == "false").ToListAsync();

            return Ok(planetet);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqPlanetinNgaID")]
        public async Task<IActionResult> ShfaqPlanetinNgaID(int PlanetiId)
        {
            var planeti = await _context.Planet.FirstOrDefaultAsync(x => x.PlanetId == PlanetiId);

            if (planeti == null || planeti.isDeleted == "true")
            {
                return NotFound();
            }

            return Ok(planeti);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoPlanetin")]
        public async Task<IActionResult> Post([FromBody] Planet planeti)
        {
            await _context.Planet.AddAsync(planeti);

            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqPlanete", planeti.PlanetId, planeti);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoPlanetin")]
        public async Task<IActionResult> PerditesoPlanetin(int PlanetiId, [FromBody] Planet p)
        {
            var planeti = await _context.Planet.FirstOrDefaultAsync(x => x.PlanetId == PlanetiId);

            if (planeti == null || planeti.isDeleted == "true")
            {
                return NotFound();
            }

            planeti.Name = p.Name;
            planeti.Type = p.Type;

            _context.Planet.Update(planeti);
            await _context.SaveChangesAsync();

            return Ok(planeti);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijPlanetin")]
        public async Task<IActionResult> FshijPlanetin(int PlanetiId)
        {
            var planeti = await _context.Planet.FirstOrDefaultAsync(x => x.PlanetId == PlanetiId);

            if (planeti == null || planeti.isDeleted == "true")
            {
                return NotFound();
            }

            planeti.isDeleted = "true";

            _context.Planet.Update(planeti);
            await _context.SaveChangesAsync();

            var satelitet = await _context.Satellite.Where(x => x.PlanetId == planeti.PlanetId).ToListAsync();

            foreach (var sateliti in satelitet)
            {
                if (sateliti.isDeleted == "false")
                {
                    sateliti.isDeleted = "true";

                    _context.Satellite.Update(sateliti);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok();
        }
    }
}
