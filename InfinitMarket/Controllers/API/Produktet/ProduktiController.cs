using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using InfinitMarket.Data;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class ProduktiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProduktiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqProduktet")]
        public async Task<ActionResult> Get()
        {
            var produkti = await _context.Produkti
                .Where(p => p.isDeleted == "false")
                .OrderByDescending(p => p.ProduktiId)
                .Select(p => new
                {
                    p.ProduktiId,
                    p.EmriProduktit,
                    p.Pershkrimi,
                    p.FotoProduktit,
                    p.KategoriaId,
                    p.Kategoria.LlojiKategoris,
                    p.KompaniaId,
                    p.KompanitePartnere.EmriKompanis,
                    p.TeDhenatProduktit.SasiaNeStok,
                    p.TeDhenatProduktit.QmimiBleres,
                    p.TeDhenatProduktit.QmimiProduktit,
                    p.TeDhenatProduktit.DataKrijimit,
                    p.TeDhenatProduktit.DataPerditsimit
                })
                .ToListAsync();

            return Ok(produkti);
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqProduktetAll")]
        public async Task<ActionResult> GetAll()
        {
            var produkti = await _context.Produkti
                .OrderByDescending(x => x.ProduktiId)
                .Select(x => new
                {
                    x.ProduktiId,
                    x.EmriProduktit,
                    x.Pershkrimi,
                    x.FotoProduktit,
                    x.KategoriaId,
                    x.Kategoria.LlojiKategoris,
                    x.KompaniaId,
                    x.KompanitePartnere.EmriKompanis,
                    x.TeDhenatProduktit.SasiaNeStok,
                    x.TeDhenatProduktit.QmimiBleres,
                    x.TeDhenatProduktit.QmimiProduktit,
                    x.TeDhenatProduktit.DataKrijimit,
                    x.TeDhenatProduktit.DataPerditsimit
                })
                .ToListAsync();

            return Ok(produkti);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqProduktinSipasIDsAll/{id}")]
        public async Task<ActionResult> shfaqSipasIDsAll(int id)
        {
            var produkti = await _context.Produkti
                .Where(x => x.ProduktiId == id)
                .Select(x => new
                {
                    x.ProduktiId,
                    x.EmriProduktit,
                    x.Pershkrimi,
                    x.FotoProduktit,
                    x.KategoriaId,
                    x.Kategoria.LlojiKategoris,
                    x.KompaniaId,
                    x.KompanitePartnere.EmriKompanis,
                    x.TeDhenatProduktit.SasiaNeStok,
                    x.TeDhenatProduktit.QmimiBleres,
                    x.TeDhenatProduktit.QmimiProduktit,
                    x.TeDhenatProduktit.DataKrijimit,
                    x.TeDhenatProduktit.DataPerditsimit
                })
                .FirstOrDefaultAsync();

            if (produkti == null)
            {
                return NotFound();
            }

            return Ok(produkti);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoProdukt")]
        public async Task<ActionResult> ShtoProdukt([FromBody] Produkti produkti)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Produkti.Add(produkti);
                    await _context.SaveChangesAsync();
                    return Ok("Produkti u shtua me sukses!");
                }
                else
                {
                    return BadRequest("Të dhënat e produktit nuk janë valide.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Gabim gjatë shtimit të produktit: {ex.Message}");
            }
        }


    }
}
