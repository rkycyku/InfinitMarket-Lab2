using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KategoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public KategoriaController(ApplicationDbContext context,
                                   UserManager<IdentityUser> userManager,
                                   RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // [Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKategorinSipasIDs")]
        public async Task<IActionResult> GetById(int id)
        {
            var kategoria = await _context.KategoriaProduktit.FindAsync(id);
            if (kategoria == null)
            {
                return NotFound();
            }

            return Ok(kategoria);
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpPost]
        [Route("shtoKategorin")]
        public async Task<IActionResult> Post(KategoriaProduktit kategoriaProduktit)
        {
            await _context.KategoriaProduktit.AddAsync(kategoriaProduktit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = kategoriaProduktit.KategoriaId }, kategoriaProduktit);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqKategorit")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var kategorit = _context.KategoriaProduktit
                    .Where(k => k.LlojiKategoris != null)
                    .AsEnumerable()
                    .OrderBy(k => k.LlojiKategoris.ToString())
                    .ToList();

                return Ok(kategorit);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpPut]
        [Route("perditesoKategorin")]
        public async Task<IActionResult> Put(int id, KategoriaProduktit kategoriaProduktit)
        {
            if (id != kategoriaProduktit.KategoriaId)
            {
                return BadRequest();
            }

            _context.Entry(kategoriaProduktit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KategoriaProduktitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //[Authorize(Roles = "Admin, Menaxher")]
        [AllowAnonymous]
        [HttpDelete]
        [Route("fshijKategorin")]
        public async Task<IActionResult> Delete(int id)
        {
            var kategoria = await _context.KategoriaProduktit.FindAsync(id);
            if (kategoria == null)
            {
                return NotFound();
            }

            _context.KategoriaProduktit.Remove(kategoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KategoriaProduktitExists(int id)
        {
            return _context.KategoriaProduktit.Any(e => e.KategoriaId == id);
        }


    }
}
