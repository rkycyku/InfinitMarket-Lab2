using InfinitMarket.Data;
using InfinitMarket.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using System.Linq;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class VleresimetEProduktitController : ControllerBase
    {
        private readonly IMongoCollection<VlersimetEProduktit>? _vleresimiProduktit;
        private readonly ApplicationDbContext _context;

        public VleresimetEProduktitController(MongoDBService mongoDBService, ApplicationDbContext context)
        {
            _vleresimiProduktit = mongoDBService.Database?.GetCollection<VlersimetEProduktit>("vleresimetEProduktit");
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("KontrolloALejohetVleresimi")]
        public async Task<IActionResult> KontrolloALejohetVleresimi(int produktiId, int userID)
        {
            // Get all orders for the client
            var porositKlientit = await _context.Porosit
                .Where(p => p.IdKlienti == userID)
                .Select(p => p.IdPorosia)
                .ToListAsync();

            var eshteBlereProdukti = await _context.TeDhenatEPorosis
                .AnyAsync(t => t.IdProdukti == produktiId && porositKlientit.Contains((int)t.IdPorosia));

            if (eshteBlereProdukti)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqVleresimetPerProduktin")]
        public async Task<IActionResult> ShfaqVleresimetPerProduktin(int produktiId)
        {
            var filter = Builders<VlersimetEProduktit>.Filter.Eq(x => x.ProduktiID, produktiId);
            var vleresimiProduktit = await _vleresimiProduktit.Find(filter).ToListAsync();

            return vleresimiProduktit is not null ? Ok(vleresimiProduktit) : NotFound();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("VendosVleresimetPerProduktin")]
        public async Task<IActionResult> VendosVleresimetPerProduktin(VlersimetEProduktit vleresimi)
        {
            await _vleresimiProduktit.InsertOneAsync(vleresimi);
            return CreatedAtAction(nameof(ShfaqVleresimetPerProduktin), new { id = vleresimi.Id }, vleresimi);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("NdryshoVleresiminEProduktit")]
        public async Task<IActionResult> NdryshoVleresiminEProduktit(string id, VlersimetEProduktit vleresimi)
        {
            var filter = Builders<VlersimetEProduktit>.Filter.Eq(x => x.Id, id);
            var vleresimiAktual = await _vleresimiProduktit.Find(filter).FirstOrDefaultAsync();

            if (vleresimiAktual == null)
            {
                return NotFound();
            }

            vleresimiAktual.VlersimiTekst = vleresimi.VlersimiTekst;
            vleresimiAktual.VlersimiYll = vleresimi.VlersimiYll;

            var updateResult = await _vleresimiProduktit.ReplaceOneAsync(filter, vleresimi);

            if (updateResult.IsAcknowledged && updateResult.ModifiedCount > 0)
            {
                return Ok("Vleresimi u ndryshua me sukses!");
            }
            else
            {
                return StatusCode(500, "Diçka shkoi keq gjatë ndryshimit të vleresimit.");
            }
        }


        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijVleresiminEProduktit")]
        public async Task<ActionResult> FshijVleresiminEProduktit(string id)
        {
            var filter = Builders<VlersimetEProduktit>.Filter.Eq(x => x.Id, id);
            var vleresimiProduktit = await _vleresimiProduktit.Find(filter).FirstOrDefaultAsync();
            await _vleresimiProduktit.DeleteOneAsync(filter);

            return Ok("vleresimi u fshi me sukses!");
        }
    }
}
