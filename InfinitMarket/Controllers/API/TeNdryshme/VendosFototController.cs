using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using InfinitMarket.Data;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/TeNdryshme/[controller]")]
    public class VendosFototController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VendosFototController(ApplicationDbContext context)
        {
            _context = context;
        }

       /* [Authorize(Roles = "Admin, Menaxher")]
        [HttpPost]
        [Route("EditoProduktin")]
        public async Task<IActionResult> EditoProduktin(IFormFile foto, string fotoVjeterProduktit)
        {
            if (foto == null || foto.Length == 0)
            {
                return BadRequest("Ju lutem vendosni foton");
            }

            var follderi = Path.Combine("..", "..", "infinitmarketweb", "public", "img", "products");

            if (!fotoVjeterProduktit.Equals("ProduktPaFoto.png"))
            {
                var fotoVjeter = Path.Combine(follderi, fotoVjeterProduktit);

                if (System.IO.File.Exists(fotoVjeter))
                {
                    System.IO.File.Delete(fotoVjeter);
                }
            }

            var emriUnikFotos = GjeneroEmrinUnikFotos(foto.FileName);

            var fotoERe = Path.Combine(follderi, emriUnikFotos);

            using (var stream = new FileStream(fotoERe, FileMode.Create))
            {
                await foto.CopyToAsync(stream);
            }

            return Ok(emriUnikFotos);
        }*/

        [Authorize(Roles = "Admin, Menaxher")]
        [HttpPost]
        [Route("ShtoOfertenSlider")]
        public async Task<IActionResult> ShtoOfertenSlider(IFormFile foto)
        {
            if (foto == null || foto.Length == 0)
            {
                return BadRequest("Ju lutem vendosni foton");
            }

            var emriUnikFotos = GjeneroEmrinUnikFotos(foto.FileName);

            var follderi = Path.Combine("..", "infinitmarketweb", "public", "img", "ofertat", emriUnikFotos);

            using (var stream = new FileStream(follderi, FileMode.Create))
            {
                await foto.CopyToAsync(stream);
            }

            return Ok(emriUnikFotos);
        }

        private string GjeneroEmrinUnikFotos(string emriFotos)
        {
            string emriUnikIFotos = Guid.NewGuid().ToString("N") + Path.GetExtension(emriFotos);

            return emriUnikIFotos;
        }
    }
}
