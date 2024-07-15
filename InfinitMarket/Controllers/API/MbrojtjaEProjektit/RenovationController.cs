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
    public class RenovationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RenovationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqRenovation")]
        public async Task<IActionResult> ShfaqRenovation()
        {
            var Renovation = await _context.Renovation.Include(x => x.Building).ToListAsync();

            return Ok(Renovation);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqRenovationNgaID")]
        public async Task<IActionResult> ShfaqRenovationNgaID(int RenovationID)
        {
            var Renovation = await _context.Renovation.Include(x => x.Building).FirstOrDefaultAsync(x => x.RenovationID == RenovationID);

            if (Renovation == null)
            {
                return NotFound();
            }

            return Ok(Renovation);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoRenovation")]
        public async Task<IActionResult> ShtoRenovation([FromBody] Renovation Renovation)
        {
            await _context.Renovation.AddAsync(Renovation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqRenovation", Renovation.RenovationID, Renovation);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoRenovation")]
        public async Task<IActionResult> PerditesoRenovation(int RenovationID, [FromBody] Renovation s)
        {
            var Renovation = await _context.Renovation.FirstOrDefaultAsync(x => x.RenovationID == RenovationID);

            if (Renovation == null)
            {
                return NotFound();
            }

            Renovation.Description = s.Description;
            Renovation.Cost = s.Cost;
            Renovation.BuildingID = s.BuildingID;

            _context.Renovation.Update(Renovation);
            await _context.SaveChangesAsync();

            return Ok(Renovation);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijRenovation")]
        public async Task<IActionResult> FshijRenovation(int RenovationID)
        {
            var Renovation = await _context.Renovation.FirstOrDefaultAsync(x => x.RenovationID == RenovationID);

            if (Renovation == null)
            {
                return NotFound();
            }

            _context.Renovation.Remove(Renovation);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
