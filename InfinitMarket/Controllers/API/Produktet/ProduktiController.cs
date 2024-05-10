using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using InfinitMarket.Data;
using InfinitMarket.Entities;
using MongoDB.Driver;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class ProduktiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMongoCollection<FototProduktit>? _fototProduktit;

        public ProduktiController(ApplicationDbContext context, MongoDBService mongoDBService)
        {
            _context = context;
            _fototProduktit = mongoDBService.Database?.GetCollection<FototProduktit>("fotoProduktit");
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
                    p.TeDhenatProduktit.DataPerditsimit,
                    p.TeDhenatProduktit.llojiTVSH,
                    p.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit
                })
                .ToListAsync();

            return Ok(produkti);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("Shfaq15ProduktetMeTeFundit")]
        public async Task<ActionResult> Shfaq15ProduktetMeTeFundit()
        {
            var Kthe15TeFundit = await _context.Produkti
               .Where(p => p.isDeleted == "false")
               .OrderByDescending(x => x.ProduktiId)
               .Take(15)
               .Select(x => new
               {
                   x.ProduktiId,
                   x.EmriProduktit,
                   x.FotoProduktit,
                   x.TeDhenatProduktit.SasiaNeStok,
                   x.TeDhenatProduktit.QmimiBleres,
                   x.TeDhenatProduktit.QmimiProduktit,
                   x.TeDhenatProduktit.llojiTVSH,
                   x.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit
               })
               .ToListAsync();

            return Ok(Kthe15TeFundit);
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
                    x.TeDhenatProduktit.DataPerditsimit,
                    x.TeDhenatProduktit.llojiTVSH,
                    x.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit
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
                    x.TeDhenatProduktit.DataPerditsimit,
                    x.TeDhenatProduktit.llojiTVSH,
                    x.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit
                })
                .FirstOrDefaultAsync();

            var filter = Builders<FototProduktit>.Filter.Eq(x => x.ProduktiID, id);
            var fotoProduktit = await _fototProduktit.Find(filter).ToListAsync();

            var ProduktiMeFotoGallery = new
            {
                produkti,
                fotoProduktit
            };


            if (produkti == null)
            {
                return NotFound();
            }

            return Ok(ProduktiMeFotoGallery);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoProdukt")]
        public async Task<ActionResult> ShtoProdukt([FromBody] Produkti produktiData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var produkti = new Produkti
            {
                EmriProduktit = produktiData.EmriProduktit,
                Pershkrimi = produktiData.Pershkrimi,
                FotoProduktit = produktiData.FotoProduktit,
                KompaniaId = produktiData.KompaniaId,
                KategoriaId = produktiData.KategoriaId,
                isDeleted = produktiData.isDeleted,
                TeDhenatProduktit = new TeDhenatProduktit
                {
                    SasiaNeStok = produktiData.TeDhenatProduktit.SasiaNeStok,
                    QmimiBleres = produktiData.TeDhenatProduktit.QmimiBleres,
                    QmimiProduktit = produktiData.TeDhenatProduktit.QmimiProduktit,
                    llojiTVSH = produktiData.TeDhenatProduktit.llojiTVSH,
                    DataKrijimit = DateTime.Now,
                    DataPerditsimit = DateTime.Now
                }
            };

            try
            {
                _context.Produkti.Add(produkti);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Data saved successfully.");
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijProduktin/{id}")]
        public async Task<ActionResult> FshijProduktin(int id)
        {
            var produkti = await _context.Produkti.FindAsync(id);
            if (produkti == null)
            {
                return NotFound();
            }

            produkti.isDeleted = "true";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Produkti u fshi me sukses.");
        }


        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoProduktin/{id}")]
        public async Task<ActionResult> PerditesoProduktin(int id, [FromBody] Produkti produktiData)
        {
            if (id != produktiData.ProduktiId)
            {
                return BadRequest("Product ID in the request body does not match the route parameter.");
            }

            var existingProdukti = await _context.Produkti
                .Include(p => p.TeDhenatProduktit)
                .FirstOrDefaultAsync(p => p.ProduktiId == id);

            if (existingProdukti == null)
            {
                return NotFound("Produkti nuk u gjet.");
            }

            existingProdukti.EmriProduktit = produktiData.EmriProduktit;
            existingProdukti.Pershkrimi = produktiData.Pershkrimi;
            existingProdukti.FotoProduktit = produktiData.FotoProduktit;
            existingProdukti.KompaniaId = produktiData.KompaniaId;
            existingProdukti.KategoriaId = produktiData.KategoriaId;
            existingProdukti.isDeleted = produktiData.isDeleted;

            if (existingProdukti.TeDhenatProduktit != null && produktiData.TeDhenatProduktit != null)
            {
                existingProdukti.TeDhenatProduktit.SasiaNeStok = produktiData.TeDhenatProduktit.SasiaNeStok;
                existingProdukti.TeDhenatProduktit.QmimiBleres = produktiData.TeDhenatProduktit.QmimiBleres;
                existingProdukti.TeDhenatProduktit.QmimiProduktit = produktiData.TeDhenatProduktit.QmimiProduktit;
                existingProdukti.TeDhenatProduktit.DataPerditsimit = DateTime.Now;
                existingProdukti.TeDhenatProduktit.llojiTVSH = produktiData.TeDhenatProduktit.llojiTVSH;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Product u perditesua me sukses.");
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoStokunQmimin")]
        public async Task<ActionResult> PerditesoStokunQmimin(int id, int stoku, decimal qmimiBleres, decimal qmimiShites)
        {
            var produkti = await _context.Produkti.Include(x => x.TeDhenatProduktit).Where(x => x.ProduktiId == id).FirstOrDefaultAsync();

            if (produkti == null)
            {
                return BadRequest("Produkti nuk u gjet!");
            }

            produkti.TeDhenatProduktit.SasiaNeStok += stoku;
            produkti.TeDhenatProduktit.QmimiBleres = qmimiBleres;
            produkti.TeDhenatProduktit.QmimiProduktit = qmimiShites;
            produkti.TeDhenatProduktit.DataPerditsimit = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok("Produkti u perditesua me sukses.");
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoKategorineEDetajet")]
        public async Task<ActionResult> ShtoKategorineEDetajet([FromBody] KategoriteEDetajeve kategoriaData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var kategoria = new KategoriteEDetajeve
            {
                EmriKategoriseDetajeve = kategoriaData.EmriKategoriseDetajeve,
                DetajetJson = kategoriaData.DetajetJson
            };

            try
            {
                _context.KategoriteEDetajeve.Add(kategoria);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Kategoria e detajeve u shtua me sukses.");
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqKategoriteEDetajet")]
        public async Task<ActionResult> ShfaqKategoriteEDetajet()
        {
            var kategorite = await _context.KategoriteEDetajeve.ToListAsync();

            return Ok(kategorite);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqKategorineEDetajet/{id}")]
        public async Task<ActionResult> ShfaqKategorineEDetajet(int id)
        {
            var kategoria = await _context.KategoriteEDetajeve.FindAsync(id);

            if (kategoria == null)
            {
                return NotFound();
            }

            return Ok(kategoria);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoTeDhenatEDetajeve")]
        public async Task<ActionResult> ShtoTeDhenatEDetajeve([FromBody] TeDhenatEDetajeve teDhenatData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var teDhenat = new TeDhenatEDetajeve
            {
                KategoriaDetajeveId = teDhenatData.KategoriaDetajeveId,
                TeDhenatJson = teDhenatData.TeDhenatJson
            };

            try
            {
                _context.TeDhenatEDetajeve.Add(teDhenat);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("TeDhenatEDetajeve u shtua me sukses.");
        }
    }
}
