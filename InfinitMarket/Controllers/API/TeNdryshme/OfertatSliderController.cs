using InfinitMarket.Data;
using InfinitMarket.Models;
using InfinitMarket.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/TeNdryshme/[controller]")]
    [ApiController]
    public class OfertatSliderController : ControllerBase
    {
        public readonly ApplicationDbContext _context;
        private readonly IAdminLogService _adminLogService;

        public OfertatSliderController(ApplicationDbContext context, IAdminLogService adminLogService)
        {
            _context = context;
            _adminLogService = adminLogService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqOfertatSlider")]
        public async Task<IActionResult> ShfaqOfertatESlider()
        {
            var dataAktuale = DateTime.Now;

            var ofertatEVjetra = await _context.SliderOfertat
                .Where(x => x.isDeleted == "false" && x.DataMbarimitOfertes <= dataAktuale)
                .ToListAsync();

            if (ofertatEVjetra.Count > 0)
            {
                foreach(var oferta in ofertatEVjetra)
                {
                    oferta.isDeleted = "true";
                    _context.SliderOfertat.Update(oferta);
                    await _context.SaveChangesAsync();
                }
            }

            var ofertat = await _context.SliderOfertat
                .Where(x => x.isDeleted == "false")
                .ToListAsync();

            return Ok(ofertat);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("VendosOfertatSlider")]
        public async Task<IActionResult> VendosOfertatSlider(SliderOfertat so)
        {
            await _context.SliderOfertat.AddAsync(so);
            await _context.SaveChangesAsync();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Shto", "SliderOfertat", so.SliderOfertatID.ToString(), $"Eshte Shtuar Oferta e re");

            return CreatedAtAction("get", so.SliderOfertatID, so);
        }

        [AllowAnonymous]
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

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _adminLogService.LogAsync(userId, "Fshij", "SliderOfertat", id.ToString(), $"Eshte Larguar oferta");

            return Ok("Oferta u fshi me sukses");
        }
    }
}
