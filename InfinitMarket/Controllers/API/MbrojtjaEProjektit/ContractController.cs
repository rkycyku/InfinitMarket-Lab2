using InfinitMarket.Data;
using InfinitMarket.Models.MbrojtjaEProjektit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers.MbrojtjaProjektit
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/MbrojtjaEProjektit/[controller]")]
    public class ContractController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ContractController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqContract")]
        public async Task<IActionResult> ShfaqContract()
        {
            var contract = await _context.Contract.Include(x => x.Employee).ToListAsync();

            return Ok(contract);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqContractNgaID")]
        public async Task<IActionResult> ShfaqContractNgaID(int ContractID)
        {
            var contract = await _context.Contract.Include(x => x.Employee).FirstOrDefaultAsync(x => x.ContractID == ContractID);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoContract")]
        public async Task<IActionResult> ShtoContract([FromBody] Contract contract)
        {
            await _context.Contract.AddAsync(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqContract", contract.ContractID, contract);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoContract")]
        public async Task<IActionResult> PerditesoContract(int ContractID, [FromBody] Contract s)
        {
            var contract = await _context.Contract.FirstOrDefaultAsync(x => x.ContractID == ContractID);

            if (contract == null)
            {
                return NotFound();
            }

            contract.Name = s.Name;
            contract.StartDate = s.StartDate;
            contract.EmployeeID = s.EmployeeID;

            _context.Contract.Update(contract);
            await _context.SaveChangesAsync();

            return Ok(contract);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijContract")]
        public async Task<IActionResult> FshijContract(int ContractID)
        {
            var contract = await _context.Contract.FirstOrDefaultAsync(x => x.ContractID == ContractID);

            if (contract == null)
            {
                return NotFound();
            }

            _context.Contract.Remove(contract);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
