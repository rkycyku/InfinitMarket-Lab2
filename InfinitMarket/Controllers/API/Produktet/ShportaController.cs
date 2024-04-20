using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.Produktet
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/Produktet/[controller]")]
    [ApiController]
    public class ShportaController : ControllerBase
    {
        public readonly ApplicationDbContext _context;

        public ShportaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqShporten")]
        public async Task<IActionResult> ShfaqShporten(string userID)
        {
            var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Include(x => x.KodiZbritjes).Include(x => x.Adresa).Where(x => x.Perdoruesi.AspNetUserId == userID).FirstOrDefaultAsync();

            if (shporta == null)
            {
                return BadRequest("Ndodhi nje gabim gjate shfaqjes se shportes!");
            }

            return Ok(shporta);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqProduktetEShportes")]
        public async Task<IActionResult> ShfaqProduktetEShportes(string userID)
        {
            var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Where(x => x.Perdoruesi.AspNetUserId == userID).FirstOrDefaultAsync();

            if(shporta == null)
            {
                return BadRequest("Ndodhi nje gabim gjate shfaqjes se shportes!");
            }

            var TeDhenatShporta = await _context.TeDhenatShporta
                .Include(x => x.Produkti)
                .ThenInclude(x => x.Kategoria)
                .Include(x => x.Produkti)
                .ThenInclude(x => x.TeDhenatProduktit)
                .Where(x => x.ShportaID == shporta.ShportaID)
                .ToListAsync();

            foreach(var prd in TeDhenatShporta)
            {
                if(prd.Produkti?.isDeleted == "true")
                {
                    _context.TeDhenatShporta.Remove(prd);
                    await _context.SaveChangesAsync();

                    shporta.DataEFunditEPerditesimit = DateTime.Now;
                    shporta.TotaliProdukteveNeShporte -= 1;

                    if(prd.Produkti.TeDhenatProduktit.llojiTVSH == 18)
                    {
                        shporta.Totali18TVSH -= prd.SasiaProduktit * prd.Produkti.TeDhenatProduktit.QmimiProduktit;
                        shporta.TotProd18TVSH -= prd.SasiaProduktit;
                    }
                    if (prd.Produkti.TeDhenatProduktit.llojiTVSH == 8)
                    {
                        shporta.Totali8TVSH -= prd.SasiaProduktit * prd.Produkti.TeDhenatProduktit.QmimiProduktit;
                        shporta.TotProd18TVSH -= prd.SasiaProduktit;
                    }

                    _context.Shporta.Update(shporta);
                    await _context.SaveChangesAsync();
                }
            }

            var ListaProdukteve = new List<ShportaPerKthim>();

            foreach(var prd in TeDhenatShporta)
            {
                var produkti = new ShportaPerKthim()
                {
                    EmriProduktit = prd.Produkti.EmriProduktit,
                    isDeleted = prd.Produkti.isDeleted,
                    ProduktiID = prd.ProduktiID,
                    QmimiProduktit = prd.Produkti.TeDhenatProduktit.QmimiProduktit,
                    SasiaProduktitNeShporte = prd.SasiaProduktit,
                    SasiaStokutAktual = prd.Produkti.TeDhenatProduktit.SasiaNeStok,
                    ShportaID = prd.ShportaID,
                    TeDhenatShportaID = prd.TeDhenatShportaID,
                    FotoProduktit = prd.Produkti.FotoProduktit,
                    EmriKategoris = prd.Produkti.Kategoria.LlojiKategoris
                };

                ListaProdukteve.Add(produkti);
            }

            return Ok(ListaProdukteve);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoProduktinNeShporte")]
        public async Task<IActionResult> ShtoProduktinNeShport(string userID, int ProduktiID)
        {
            var perdoruesi = await _context.Perdoruesit.Where(x => x.AspNetUserId == userID).FirstOrDefaultAsync();

            var TVSHProduktit = await _context.TeDhenatProduktit.Where(x => x.ProduktiId == ProduktiID).FirstOrDefaultAsync();

            if (perdoruesi == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }

            var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Where(x => x.PerdoruesiID == perdoruesi.UserID).FirstOrDefaultAsync();

            if (shporta == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }

            var eshteNeShporte = await _context.TeDhenatShporta.Where(x => x.ShportaID == shporta.ShportaID && x.ProduktiID == ProduktiID).FirstOrDefaultAsync();

            if(eshteNeShporte == null)
            {
                TeDhenatShporta shtoNeShporte = new()
                {
                    ProduktiID = ProduktiID,
                    SasiaProduktit = 1,
                    ShportaID = shporta.ShportaID,
                };

                await _context.TeDhenatShporta.AddAsync(shtoNeShporte);
                await _context.SaveChangesAsync();

                shporta.TotaliProdukteveNeShporte += 1;
                shporta.DataEFunditEPerditesimit = DateTime.Now;

                if (TVSHProduktit.llojiTVSH == 18)
                {
                    shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                    shporta.TotProd18TVSH += 1;
                }
                if (TVSHProduktit.llojiTVSH == 8)
                {
                    shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                    shporta.TotProd18TVSH += 1;
                }

                _context.Shporta.Update(shporta);
                await _context.SaveChangesAsync();

                return CreatedAtAction("get", shtoNeShporte.TeDhenatShportaID, shtoNeShporte);
            }
            else
            {
                eshteNeShporte.SasiaProduktit += 1;

                _context.TeDhenatShporta.Update(eshteNeShporte);
                await _context.SaveChangesAsync();

                shporta.DataEFunditEPerditesimit = DateTime.Now;

                if (TVSHProduktit.llojiTVSH == 18)
                {
                    shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                }
                if (TVSHProduktit.llojiTVSH == 8)
                {
                    shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                }

                _context.Shporta.Update(shporta);
                await _context.SaveChangesAsync();

                return Ok(eshteNeShporte);
            }

            
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("menaxhoShporten")]
        public async Task<IActionResult> MenaxhoShporten(string userID, int ProduktiID, string llojiFunksionit)
        {
            var perdoruesi = await _context.Perdoruesit.Where(x => x.AspNetUserId == userID).FirstOrDefaultAsync();

            if (perdoruesi == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }

            var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Where(x => x.PerdoruesiID == perdoruesi.UserID).FirstOrDefaultAsync();

            if (shporta == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }

            var eshteNeShporte = await _context.TeDhenatShporta.Where(x => x.ShportaID == shporta.ShportaID && x.ProduktiID == ProduktiID).FirstOrDefaultAsync();

            var TVSHProduktit = await _context.TeDhenatProduktit.Where(x => x.ProduktiId == ProduktiID).FirstOrDefaultAsync();

            if (eshteNeShporte != null)
            {
                if (llojiFunksionit == "rritje")
                {
                    eshteNeShporte.SasiaProduktit += 1;

                    _context.TeDhenatShporta.Update(eshteNeShporte);
                    await _context.SaveChangesAsync();

                    shporta.DataEFunditEPerditesimit = DateTime.Now;

                    if (TVSHProduktit.llojiTVSH == 18)
                    {
                        shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                    }
                    if (TVSHProduktit.llojiTVSH == 8)
                    {
                        shporta.Totali18TVSH += TVSHProduktit.QmimiProduktit;
                    }

                    _context.Shporta.Update(shporta);
                    await _context.SaveChangesAsync();

                    return Ok(eshteNeShporte);
                }

                if (llojiFunksionit == "ulje")
                {
                    eshteNeShporte.SasiaProduktit -= 1;

                    _context.TeDhenatShporta.Update(eshteNeShporte);
                    await _context.SaveChangesAsync();

                    shporta.DataEFunditEPerditesimit = DateTime.Now;

                    if (TVSHProduktit.llojiTVSH == 18)
                    {
                        shporta.Totali18TVSH -= TVSHProduktit.QmimiProduktit;
                    }
                    if (TVSHProduktit.llojiTVSH == 8)
                    {
                        shporta.Totali18TVSH -= TVSHProduktit.QmimiProduktit;
                    }

                    _context.Shporta.Update(shporta);
                    await _context.SaveChangesAsync();

                    return Ok(eshteNeShporte);
                }

                if (llojiFunksionit == "fshije")
                {
                    _context.TeDhenatShporta.Remove(eshteNeShporte);
                    await _context.SaveChangesAsync();

                    shporta.DataEFunditEPerditesimit = DateTime.Now;
                    shporta.TotaliProdukteveNeShporte -= 1;

                    if (TVSHProduktit.llojiTVSH == 18)
                    {
                        shporta.Totali18TVSH -= eshteNeShporte.SasiaProduktit * TVSHProduktit.QmimiProduktit;
                        shporta.TotProd18TVSH -= 1;
                    }
                    if (TVSHProduktit.llojiTVSH == 8)
                    {
                        shporta.Totali18TVSH -= eshteNeShporte.SasiaProduktit * TVSHProduktit.QmimiProduktit;
                        shporta.TotProd18TVSH -= 1;
                    }

                    _context.Shporta.Update(shporta);
                    await _context.SaveChangesAsync();

                    return Ok(eshteNeShporte);
                }
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoKodinZbritjesNeShporte")]
        public async Task<IActionResult> PerditesoKodinZbritjesNeShporte(string userID, string KodiZbritjes)
        {
            var perdoruesi = await _context.Perdoruesit.Where(x => x.AspNetUserId == userID).FirstOrDefaultAsync();

            if (perdoruesi == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }

            var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Where(x => x.PerdoruesiID == perdoruesi.UserID).FirstOrDefaultAsync();

            if (shporta == null)
            {
                return BadRequest("Ndodhi nje gabim!");
            }
                shporta.KodiZbritjesID = KodiZbritjes;


            _context.Shporta.Update(shporta);
            await _context.SaveChangesAsync();  

            return Ok();
        }

    }

    public class ShportaPerKthim
    {
        public int? TeDhenatShportaID { get; set; }
        public int? ShportaID { get; set; }
        public int? ProduktiID { get; set; }
        public string? EmriProduktit { get; set; }
        public string? FotoProduktit { get; set; }
        public string? EmriKategoris {  get; set; }
        public decimal? QmimiProduktit { get; set; }
        public decimal? SasiaProduktitNeShporte { get; set; }
        public decimal? SasiaStokutAktual { get; set; }
        public string? isDeleted { get; set; }
    }
}
