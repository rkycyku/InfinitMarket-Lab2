using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Route("api/TeNdryshme/[controller]")]
    [ApiController]
    public class OfertatSliderController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public OfertatSliderController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ShfaqOfertatSlider")]
        public async Task<IActionResult> ShfaqOfertatESlider()
        {
            var ofertat = await _context.SliderOfertat.Where(x => x.isDeleted == "false").ToListAsync();

            return Ok(ofertat);
        }

        [HttpPost]
        [Route("VendosOfertatSlider")]
        public async Task<IActionResult> VendosOfertatSlider(SliderOfertat so)
        {
            await _context.SliderOfertat.AddAsync(so);
            await _context.SaveChangesAsync();

            return CreatedAtAction("get", so.SliderOfertatID, so);
        }

        [HttpDelete]
        [Route("FshijOfertenSlider")]
        public async Task<IActionResult> FshijOfertenSlider(int id)
        {
            var oferta = await _context.SliderOfertat.FindAsync(id);

            if (oferta == null || oferta.isDeleted == "true")
            {
                return BadRequest("Oferta nuk u gjet");
            }

            oferta.isDeleted = "true";

            _context.SliderOfertat.Update(oferta);
            await _context.SaveChangesAsync();

            return Ok("Oferta u fshi me sukses");
        }
    }
}
