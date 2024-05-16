using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/TeNdryshme/[controller]")]
    [ApiController]
    public class ContactFormController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public ContactFormController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Policy = "punonAdministrat")]
        [HttpGet]
        [Route("shfaqMesazhet")]
        public async Task<IActionResult> ShfaqMesazhet()
        {
            List<ContactForm> ContactForm = await _context.ContactForm
                .Include(x => x.User)
                .OrderByDescending(x => x.MesazhiId)
                .ToListAsync();

            var mesazhet = ContactForm.Select(x => new
            {
                x.Emri,
                x.Email,
                x.UserId,
                x.Statusi,
                x.Mesazhi,
                x.DataDergeses,
                x.MesazhiId,
                User = x.User != null ? new
                {
                    x.User.UserID,
                    x.User.Email
                } : null
            });

            return Ok(ContactForm);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqMesazhetNgaUseri")]
        public async Task<IActionResult> GetMesazhetUserit(int idUserit)
        {
            List<ContactForm> ContactForm = await _context.ContactForm
                .Include(x => x.User)
                .OrderByDescending(x => x.MesazhiId)
                .Where(x => x.UserId == idUserit)
                .ToListAsync();

            var mesazhet = ContactForm.Select(x => new
            {
                x.Emri,
                x.Email,
                x.UserId,
                x.Statusi,
                x.Mesazhi,
                x.DataDergeses,
                x.MesazhiId,
                User = x.User != null ? new
                {
                    x.User.UserID,
                    x.User.Email
                } : null
            });

            return Ok(mesazhet);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqMesazhinSipasIDs")]
        public async Task<IActionResult> Get(int id)
        {
            var msg = await _context.ContactForm.FirstOrDefaultAsync(x => x.MesazhiId == id);

            return Ok(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoMesazhin")]
        public async Task<IActionResult> Post(ContactForm contactform)
        {
            await _context.ContactForm.AddAsync(contactform);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", contactform.MesazhiId, contactform);

        }

        [AllowAnonymous]
        [HttpPut]
        [Route("konfirmoMesazhin")]
        public async Task<IActionResult> Put(int id, [FromBody] ContactForm m)
        {
            var mesazhi = await _context.ContactForm.FirstOrDefaultAsync(x => x.MesazhiId == id);
            if (mesazhi == null)
            {
                return BadRequest("Nuk ka asnje mesazhe me kete ID");
            }
            mesazhi.Statusi = "Mesazhi eshte Pranuar dhe eshte Pergjigjur ne email";
            _context.ContactForm.Update(mesazhi);
            await _context.SaveChangesAsync();


            return Ok(mesazhi);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("fshiMesazhin")]
        public async Task<ActionResult> Delete(int id)
        {
            var mesazhi = await _context.ContactForm.FirstOrDefaultAsync(x => x.MesazhiId == id);

            if (mesazhi == null)
                return BadRequest("Invalid id");

            _context.ContactForm.Remove(mesazhi);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
