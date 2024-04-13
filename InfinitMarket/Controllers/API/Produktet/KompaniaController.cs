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
    public class KompaniaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KompaniaController(ApplicationDbContext context)
        {
            _context = context;
        }

        //[Authorize(Policy = "punonAdministrat")]
        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKompanit")]
        public async Task<IActionResult> ShfaqKompanit()
        {
            var kompanit = await _context.KompanitePartnere
                    .Where(k => k.isDeleted == "false")
                    .OrderBy(k => k.EmriKompanis)
                    .ToListAsync();

            return Ok(kompanit);
        }

        // [Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKompaninSipasIDs")]
        public async Task<IActionResult> ShfaqKompaninSipasIDs(int id)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if (kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kompania nuk u gjet");
            }

            return Ok(kompania);
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpPost]
        [Route("shtoKompanin")]
        public async Task<IActionResult> ShtoKompanin(KompanitePartnere kompaniaPartnere)
        {
            await _context.KompanitePartnere.AddAsync(kompaniaPartnere);
            await _context.SaveChangesAsync();

            return CreatedAtAction("get", kompaniaPartnere.KompaniaID, kompaniaPartnere);
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpPut]
        [Route("perditesoKompanin")]
        public async Task<IActionResult> PerditesoKompanin(int id, KompanitePartnere kompaniaPartnere)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if(kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kompania nuk u gjet");
            }

            kompania.EmriKompanis = kompaniaPartnere.EmriKompanis;
            kompania.Adresa = kompaniaPartnere.Adresa;

            _context.KompanitePartnere.Update(kompania);
            await _context.SaveChangesAsync();

            return Ok(kompania);
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpDelete]
        [Route("fshijKompanin")]
        public async Task<IActionResult> FshijKompanin(int id)
        {
            var kompania = await _context.KompanitePartnere.FindAsync(id);

            if (kompania == null || kompania.isDeleted == "true")
            {
                return BadRequest("Kategoria nuk u gjet");
            }

            kompania.isDeleted = "true";

            _context.KompanitePartnere.Update(kompania);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
