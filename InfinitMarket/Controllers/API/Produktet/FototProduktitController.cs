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
    public class FototProduktitController : ControllerBase
    {
        private readonly IMongoCollection<FototProduktit>? _fototProduktit;
        public FototProduktitController(MongoDBService mongoDBService)
        {
            _fototProduktit = mongoDBService.Database?.GetCollection<FototProduktit>("fotoProduktit");
        }


        [Authorize]
        [HttpGet]
        [Route("ShfaqFototEProduktitPerGallery")]
        public async Task<IActionResult> ShfaqFototEProduktit(int produktiId)
        {
            var filter = Builders<FototProduktit>.Filter.Eq(x => x.ProduktiID, produktiId);
            var fotoProduktit = await _fototProduktit.Find(filter).ToListAsync();

            return fotoProduktit is not null ? Ok(fotoProduktit) : NotFound();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("VendosFotonEProduktitPerGallery")]
        public async Task<IActionResult> VendosFotonEProduktitPerGallery(FototProduktit foto)
        {
            await _fototProduktit.InsertOneAsync(foto);
            return CreatedAtAction(nameof(ShfaqFototEProduktit), new { id = foto.Id }, foto);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("FshijFotonEProduktitPerGallery")]
        public async Task<ActionResult> FshijFotonEProduktitPerGallery(string id)
        {
            var filter = Builders<FototProduktit>.Filter.Eq(x => x.Id, id);
            var fotoProduktit = await _fototProduktit.Find(filter).FirstOrDefaultAsync();
            await _fototProduktit.DeleteOneAsync(filter);

            var follderi = Path.Combine("..", "infinitmarketweb", "public", "img", "produktet");

            if (!fotoProduktit.EmriFotos.Equals("ProduktPaFoto.png"))
            {
                var fotoVjeter = Path.Combine(follderi, fotoProduktit.EmriFotos);

                if (System.IO.File.Exists(fotoVjeter))
                {
                    System.IO.File.Delete(fotoVjeter);
                }
            }

            return Ok("Foto u fshi me sukses!");
        }
    }
}
