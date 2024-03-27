using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeNdryshmeController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public TeNdryshmeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("/ShfaqOfertatSlider")]
        public async Task<IActionResult> ShfaqOfertatESlider()
        {
            var ofertat = await _context.SliderOfertat.ToListAsync();

            return Ok(ofertat);
        }

        [HttpPost]
        [Route("/VendosOfertatSlider")]
        public async Task<IActionResult> VendosOfertatSlider(SliderOfertat so)
        {
            await _context.SliderOfertat.AddAsync(so);
            await _context.SaveChangesAsync();

            return CreatedAtAction("get", so.SliderOfertatID, so);
        }
    }
}
