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
using Microsoft.IdentityModel.Tokens;

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
                .Where(x => x.ProduktiId == id && x.isDeleted == "false")
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
                    SasiaNeStok = 0,
                    QmimiBleres = 0,
                    QmimiProduktit = 0,
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

            return Ok(produkti.ProduktiId);
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

            if (!string.IsNullOrEmpty(produktiData.EmriProduktit))
            {
                existingProdukti.EmriProduktit = produktiData.EmriProduktit;
            }

            if (!string.IsNullOrEmpty(produktiData.Pershkrimi))
            {
                existingProdukti.Pershkrimi = produktiData.Pershkrimi;
            }

            if (!string.IsNullOrEmpty(produktiData.FotoProduktit))
            {
                existingProdukti.FotoProduktit = produktiData.FotoProduktit;
            }

            if (produktiData.KompaniaId.HasValue && produktiData.KompaniaId > 0)
            {
                existingProdukti.KompaniaId = produktiData.KompaniaId;
            }

            if (produktiData.KategoriaId.HasValue && produktiData.KategoriaId > 0)
            {
                existingProdukti.KategoriaId = produktiData.KategoriaId;
            }

            if (!string.IsNullOrEmpty(produktiData.isDeleted))
            {
                existingProdukti.isDeleted = produktiData.isDeleted;
            }

            if (existingProdukti.TeDhenatProduktit != null && produktiData.TeDhenatProduktit != null)
            {
                var teDhenatProduktit = existingProdukti.TeDhenatProduktit;

                if (produktiData.TeDhenatProduktit.SasiaNeStok.HasValue && produktiData.TeDhenatProduktit.SasiaNeStok > 0)
                {
                    teDhenatProduktit.SasiaNeStok = produktiData.TeDhenatProduktit.SasiaNeStok;
                }

                if (produktiData.TeDhenatProduktit.QmimiBleres.HasValue && produktiData.TeDhenatProduktit.QmimiBleres > 0)
                {
                    teDhenatProduktit.QmimiBleres = produktiData.TeDhenatProduktit.QmimiBleres;
                }

                if (produktiData.TeDhenatProduktit.QmimiProduktit.HasValue && produktiData.TeDhenatProduktit.QmimiProduktit > 0)
                {
                    teDhenatProduktit.QmimiProduktit = produktiData.TeDhenatProduktit.QmimiProduktit;
                }

                // Always update modification date
                teDhenatProduktit.DataPerditsimit = DateTime.Now;

                if (produktiData.TeDhenatProduktit.llojiTVSH.HasValue && produktiData.TeDhenatProduktit.llojiTVSH > 0)
                {
                    teDhenatProduktit.llojiTVSH = produktiData.TeDhenatProduktit.llojiTVSH;
                }
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
