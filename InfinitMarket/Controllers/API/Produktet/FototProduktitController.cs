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


        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqFototEProduktitPerGallery")]
        public async Task<IActionResult> ShfaqFototEProduktit(int produktiId)
        {
            var filter = Builders<FototProduktit>.Filter.Eq(x => x.ProduktiID, produktiId);
            var fotoProduktit = await _fototProduktit.Find(filter).ToListAsync();

            return fotoProduktit is not null ? Ok(fotoProduktit) : NotFound();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShfaqFotonEProduktitPerGallery")]
        public async Task<IActionResult> ShfaqFotonEProduktitPerGallery(FototProduktit foto)
        {
            await _fototProduktit.InsertOneAsync(foto);
            return CreatedAtAction(nameof(ShfaqFototEProduktit), new { id = foto.Id }, foto);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijFotonEProduktitPerGallery")]
        public async Task<ActionResult> FshijFotonEProduktitPerGallery(string id)
        {
            var filter = Builders<FototProduktit>.Filter.Eq(x => x.Id, id);
            await _fototProduktit.DeleteOneAsync(filter);

            return Ok();
        }
    }
}
