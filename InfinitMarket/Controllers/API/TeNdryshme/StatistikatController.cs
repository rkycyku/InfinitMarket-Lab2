using InfinitMarket.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/TeNdryshme/[controller]")]
    public class StatistikatController : Controller
    {
        private readonly ApplicationDbContext _context;

        public StatistikatController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("totaleTeNdryshme")]
        public async Task<IActionResult> GetTotaleTeNdryshme()
        {
            /*PERGJITHSHME*/
            var totShitjeve = await _context.Porosit.SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);
            var totUser = await _context.Perdoruesit.CountAsync();
            var totProdukteve = await _context.Produkti.CountAsync();
            var totPorosive = await _context.Porosit.CountAsync();
            /*PERGJITHSHME*/

            /*DITA E SOTME*/
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var totPorosiveSotme = await _context.Porosit
                .Where(p => p.DataPorosis >= today && p.DataPorosis < tomorrow)
                .CountAsync();
            var totShitjeveSotme = await _context.Porosit
                .Where(p => p.DataPorosis >= today && p.DataPorosis < tomorrow)
                .SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);

            /*DITA E SOTME*/

            /*MUJORE*/
            var dataESotme = DateTime.Today;
            var ditaEPareMuajit = new DateTime(dataESotme.Year, dataESotme.Month, 1);
            var ditaEFunditMuajit = ditaEPareMuajit.AddMonths(1).AddDays(-1);

            var totPorosiveMujore = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaEPareMuajit && p.DataPorosis <= ditaEFunditMuajit)
                .CountAsync();

            var totShitjeveMujore = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaEPareMuajit && p.DataPorosis <= ditaEFunditMuajit)
                .SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);
            /*MUJORE*/

            /*TE MEPARSHME*/

            /*DITA E DJESHME*/
            var ditaDjeshme = DateTime.Today.AddDays(-1);
            var totPorosiveDjeshme = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaDjeshme && p.DataPorosis < today)
                .CountAsync();
            var totShitjeveDjeshme = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaDjeshme && p.DataPorosis < today)
                .SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);
            /* DITA E DJESHME*/

            /*MUAJI I KALUAR*/
            var dataMuajinKaluar = dataESotme.AddMonths(-1);
            var ditaEPareMuajitKaluar = new DateTime(dataMuajinKaluar.Year, dataMuajinKaluar.Month, 1);
            var ditaEFunditMuajitKaluar = ditaEPareMuajitKaluar.AddMonths(1).AddDays(-1);

            var totPorosiveMujoreKaluar = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaEPareMuajitKaluar && p.DataPorosis <= ditaEFunditMuajitKaluar)
                .CountAsync();

            var totShitjeveMujoreKaluar = await _context.Porosit
                .Where(p => p.DataPorosis >= ditaEPareMuajitKaluar && p.DataPorosis <= ditaEFunditMuajitKaluar)
                .SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);
            /* MUAJI I KALUAR*/

            /*TE MEPARSHME*/

            var totalet = new
            {
                /* PERGJITHSHME*/

                TotaliShitjeve = totShitjeve,
                TotaliUsers = totUser,
                TotaliProdukteve = totProdukteve,
                TotaliPorosive = totPorosive,
                /* PERGJITHSHME
  */

                //DITA E SOTME

                TotaliPorosiveSotme = totPorosiveSotme,
                TotaliShitjeveSotme = totShitjeveSotme,
                //DITA E SOTME


                //MUJORE

                TotaliPorosiveKeteMuaj = totPorosiveMujore,
                TotaliShitjeveKeteMuaj = totShitjeveMujore,
                // MUJORE


                //TE MEPARSHME


                //DITA E DJESHME

                TotaliPorosiveDjeshme = totPorosiveDjeshme,
                TotaliShitjeveDjeshme = totShitjeveDjeshme,
                // DITA E DJESHME


                //MUAJI I KALUAR

                TotaliPorosiveMuajinKaluar = totPorosiveMujoreKaluar,
                TotaliShitjeveMuajinKaluar = totShitjeveMujoreKaluar,
                //MUAJI I KALUAR


                //TE MEPARSHME

            };

            return Ok(totalet);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("15PerdoruesitMeSeShumtiBlerje")]
        public async Task<IActionResult> GetTop15()
        {
            var bleresit = await _context.Perdoruesit
                .Select(e => new
                {
                    User = new
                    {
                        id = e.UserID,
                        emri = e.Emri,
                        mbiemri = e.Mbiemri,
                    },
                    TotaliPorosive = e.Porosit.Count(),
                    TotaliBlerjeve = e.Porosit.Sum(q => q.Totali18TVSH + q.Totali8TVSH - q.Zbritja),
                })
                .OrderByDescending(g => g.TotaliPorosive)
                .ThenByDescending(g => g.TotaliBlerjeve)
                .Take(15)
                .ToListAsync();

            return Ok(bleresit);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("15ProduktetMeTeShitura")]
        public async Task<IActionResult> GetTop15Prod()
        {
            var produktet = await _context.Produkti
                .Select(e => new
                {
                    Produkti = new
                    {
                        e.ProduktiId,
                        e.EmriProduktit,
                        e.FotoProduktit,
                        e.TeDhenatProduktit.SasiaNeStok,
                        e.TeDhenatProduktit.QmimiBleres,
                        e.TeDhenatProduktit.QmimiProduktit,
                        e.TeDhenatProduktit.llojiTVSH,
                        e.ZbritjaQmimitProduktit.QmimiMeZbritjeProduktit
                    },
                    TotaliPorosive = e.TeDhenatEPorosis.Sum(q => q.SasiaPorositur),
                    TotaliBlerjeve = e.TeDhenatEPorosis.Sum(q => q.SasiaPorositur * q.QmimiProduktit),
                })
                .OrderByDescending(g => g.TotaliPorosive)
                .ThenByDescending(g => g.TotaliBlerjeve)
                .Take(15)
                .ToListAsync();

            return Ok(produktet);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("TotaletJavore")]
        public async Task<IActionResult> GetShitjetJavore()
        {
            var dataESotme = DateTime.Today;
            var dataFillimit = dataESotme;
            var dataMbarimit = dataESotme.AddDays(-6); ;

            int totaliPorosiveJavore = 0;
            decimal totaliShitjeveJavore = 0;

            var totaletDitore = new List<Object>();

            for (var date = dataFillimit; date >= dataMbarimit; date = date.AddDays(-1))
            {
                var tomorrow = date.AddDays(1);

                var totalPorosive = await _context.Porosit
                    .Where(p => p.DataPorosis >= date && p.DataPorosis < tomorrow)
                    .CountAsync();

                totaliPorosiveJavore += totalPorosive;

                var totalShitjeve = await _context.Porosit
                    .Where(p => p.DataPorosis >= date && p.DataPorosis < tomorrow)
                    .SumAsync(p => p.Totali18TVSH + p.Totali8TVSH - p.Zbritja);

                totaliShitjeveJavore += (decimal)totalShitjeve;

                var totaliDitor = new
                {
                    Data = date,
                    totaliPorosiveDitore = totalPorosive,
                    totaliShitjeveDitore = totalShitjeve
                };

                totaletDitore.Add(totaliDitor);
            }

            var totalet = new
            {
                totaletDitore,
                TotaletJavore = new
                {
                    TotaliShitjeveJavore = totaliShitjeveJavore,
                    TotaliPorosiveJavore = totaliPorosiveJavore,
                }
            };

            return Ok(totalet);
        }

    }
}