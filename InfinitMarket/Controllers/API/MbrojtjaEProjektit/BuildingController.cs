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
    public class BuildingController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BuildingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqBuilding")]
        public async Task<IActionResult> ShfaqBuilding()
        {
            var Building = await _context.Building.ToListAsync();

            return Ok(Building);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqBuildingNgaID")]
        public async Task<IActionResult> ShfaqBuildingNgaID(int BuildingID)
        {
            var Building = await _context.Building.FirstOrDefaultAsync(x => x.BuildingID == BuildingID);

            if (Building == null)
            {
                return NotFound();
            }

            return Ok(Building);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoBuilding")]
        public async Task<IActionResult> ShtoBuilding([FromBody] Building Building)
        {
            await _context.Building.AddAsync(Building);

            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqBuilding", Building.BuildingID, Building);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoBuilding")]
        public async Task<IActionResult> PerditesoBuilding(int BuildingID, [FromBody] Building p)
        {
            var Building = await _context.Building.FirstOrDefaultAsync(x => x.BuildingID == BuildingID);

            if (Building == null)
            {
                return NotFound();
            }

            Building.Name = p.Name;
            Building.Location = p.Location;

            _context.Building.Update(Building);
            await _context.SaveChangesAsync();

            return Ok(Building);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijBuilding")]
        public async Task<IActionResult> FshijBuilding(int BuildingID)
        {
            var Building = await _context.Building.FirstOrDefaultAsync(x => x.BuildingID == BuildingID);

            if (Building == null)
            {
                return NotFound();
            }

            _context.Building.Remove(Building);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
