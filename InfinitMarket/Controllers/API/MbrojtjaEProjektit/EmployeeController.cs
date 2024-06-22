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
    public class EmployeeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqEmployee")]
        public async Task<IActionResult> ShfaqEmployee()
        {
            var employee = await _context.Employee.ToListAsync();

            return Ok(employee);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqEmployeeNgaID")]
        public async Task<IActionResult> ShfaqEmployeeNgaID(int EmployeeId)
        {
            var employee = await _context.Employee.FirstOrDefaultAsync(x => x.EmployeeId == EmployeeId);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("ShtoEmployee")]
        public async Task<IActionResult> ShtoEmployee([FromBody] Employee employee)
        {
            await _context.Employee.AddAsync(employee);

            await _context.SaveChangesAsync();

            return CreatedAtAction("ShfaqEmployee", employee.EmployeeId, employee);
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("PerditesoEmployee")]
        public async Task<IActionResult> PerditesoEmployee(int EmployeeId, [FromBody] Employee p)
        {
            var employee = await _context.Employee.FirstOrDefaultAsync(x => x.EmployeeId == EmployeeId);

            if (employee == null)
            {
                return NotFound();
            }

            employee.FullName = p.FullName;
            employee.IsActive = p.IsActive;

            _context.Employee.Update(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijEmployee")]
        public async Task<IActionResult> FshijEmployee(int EmployeeId)
        {
            var employee = await _context.Employee.FirstOrDefaultAsync(x => x.EmployeeId == EmployeeId);

            if (employee == null)
            {
                return NotFound();
            }

            _context.Employee.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
