using InfinitMarket.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers.API.TeNdryshme
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/TeNryshme/[controller]")]
    [ApiController]
    public class AdminLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminLogsController(ApplicationDbContext context) 
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("ShfaqGjurmimet")]
        public async Task<IActionResult> ShfaqGjurmimet()
        {
            var gjurmimet = await _context.AdminLogs.Include(x => x.Stafi).ToListAsync();

            return Ok(gjurmimet);
        }
    }
}
