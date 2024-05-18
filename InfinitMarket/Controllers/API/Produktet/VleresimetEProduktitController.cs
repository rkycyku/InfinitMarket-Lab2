using InfinitMarket.Data;
using InfinitMarket.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class VleresimetEProduktitController : ControllerBase
    {
        private readonly IMongoCollection<VlersimetEProduktit>? _vleresimiProduktit;
        public VleresimetEProduktitController(MongoDBService mongoDBService)
        {
            _vleresimiProduktit = mongoDBService.Database?.GetCollection<VlersimetEProduktit>("vleresimetEProduktit");
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
