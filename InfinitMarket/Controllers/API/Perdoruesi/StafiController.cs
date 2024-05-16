﻿using InfinitMarket.Auth;
using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InfinitMarket.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;

namespace InfinitMarket.Controllers
{
    [Route("api/Perdoruesi/[controller]")]
    [ApiController]
    public class StafiController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public StafiController(
            UserManager<IdentityUser> userManager,
           RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("KontrolloPerdoruesin")]
        public async Task<IActionResult> KontrolloPerdoruesin(string email)
        {
            var perdoruesiEkziston = await _userManager.FindByEmailAsync(email);

            if (perdoruesiEkziston != null)
            {
                return Ok(true);
            }
            return Ok(false);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("RegjistroStafin")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            if (ModelState.IsValid)
            {
                var perdoruesiEkziston = await _userManager.FindByEmailAsync(registerModel.Email);

                if (perdoruesiEkziston != null)
                {
                    await _userManager.AddToRoleAsync(perdoruesiEkziston, registerModel.RoliZgjedhur );

                    return Ok("Eshte perditesuar roli!");
                }

                var perdoruesiIRI = new IdentityUser()
                {
                    Email = registerModel.Email,
                    UserName = registerModel.Email,
                };

                var emri = registerModel.Emri.ToLower();
                var mbiemri = registerModel.Mbiemri.ToLower();

                emri = char.ToUpper(emri[0]) + emri.Substring(1);
                mbiemri = char.ToUpper(mbiemri[0]) + mbiemri.Substring(1);

                var passwordi = emri + mbiemri + "1@";

                var shtuarMeSukses = await _userManager.CreateAsync(perdoruesiIRI, passwordi);

                if (shtuarMeSukses.Succeeded)
                {
                    await _userManager.AddToRolesAsync(perdoruesiIRI, new[] { "Klient", registerModel.RoliZgjedhur });

                    Perdoruesi perdoruesi = new Perdoruesi
                    {
                        AspNetUserId = perdoruesiIRI.Id,
                        Emri = registerModel.Emri,
                        Email = perdoruesiIRI.Email,
                        Mbiemri = registerModel.Mbiemri,
                        EmailFillestar = perdoruesiIRI.Email
                    };
                    await _context.Perdoruesit.AddAsync(perdoruesi);
                    await _context.SaveChangesAsync();

                    TeDhenatPerdoruesit teDhenatPerdoruesit = new TeDhenatPerdoruesit
                    {
                        UserID = perdoruesi.UserID
                    };
                    await _context.TeDhenatPerdoruesit.AddAsync(teDhenatPerdoruesit);
                    await _context.SaveChangesAsync();

                    var TeDhenatPerHyrje = new
                    {
                        Email = registerModel.Email,
                        Password = passwordi
                    };

                    return Ok(TeDhenatPerHyrje);
                }
                return BadRequest(new AuthResults()
                {
                    Errors = new List<string>
                    {
                        "Server Errors"
                    },
                    Result = false
                });

            }
            return BadRequest();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("shtoRolinPerdoruesit")]
        public async Task<IActionResult> PerditesoAksesin(string userID, string roli)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest(new AuthResults
                {
                    Errors = new List<string> { "Perdoruesi nuk ekziston!" }
                });
            }

            var perditesoAksesin = await _userManager.AddToRoleAsync(user, roli);

            if (perditesoAksesin.Succeeded)
            {

                return Ok(new AuthResults
                {
                    Result = true
                });
            }
            else if (await _userManager.IsInRoleAsync(user, roli))
            {
                return BadRequest(new AuthResults
                {
                    Errors = new List<string> { "Ky perdorues e ka kete role!" }
                });
            }
            else
            {
                return BadRequest(new AuthResults
                {
                    Errors = new List<string> { "Ndodhi nje gabim gjate perditesimit te Aksesit" }
                });
            }
        }

        [AllowAnonymous]
        [HttpDelete]
        [Route("FshijRolinUserit")]
        public async Task<IActionResult> FshijRolinUserit(string userID, string roli)
        {
            var perdoruesi = await _userManager.FindByIdAsync(userID);

            if (perdoruesi == null)
            {
                return BadRequest(new AuthResults
                {
                    Errors = new List<string> { "Ky perdorues nuk egziston" }
                });
            }
            else
            {
                var ekzistonRoli = await _roleManager.FindByNameAsync(roli);

                if (ekzistonRoli != null)
                {
                    var eKaRolin = await _userManager.IsInRoleAsync(perdoruesi, roli);

                    if (eKaRolin == true)
                    {
                        await _userManager.RemoveFromRoleAsync(perdoruesi, roli);

                        return Ok(new AuthResults
                        {
                            Result = true
                        });
                    }
                }
                else
                {
                    return BadRequest(new AuthResults
                    {
                        Errors = new List<string> { "Ky role nuk egziston" }
                    });
                }

                return BadRequest(new AuthResults
                {
                    Errors = new List<string> { "Ndodhi nje gabim!" }
                });
            }


        }

        [AllowAnonymous]
        [HttpGet]
        [Route("shfaqRolet")]
        public async Task<IActionResult> ShfaqRolet()
        {
            var rolet = await _roleManager.Roles.ToListAsync();

            var roletWithUsersCount = new List<object>();

            foreach (var roli in rolet)
            {
                var usersCount = await _userManager.GetUsersInRoleAsync(roli.Name);

                var roliWithUsersCount = new
                {
                    roli.Id,
                    roli.Name,
                    roli.NormalizedName,
                    roli.ConcurrencyStamp,
                    TotaliPerdoruesve = usersCount.Count
                };

                roletWithUsersCount.Add(roliWithUsersCount);
            }

            return Ok(roletWithUsersCount);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ShfaqStafin")]
        public async Task<IActionResult> ShfaqStafin()
        {
            var perdoruesit = await _context.Perdoruesit.Include(x => x.TeDhenatPerdoruesit).ToListAsync();

            var stafi = new List<object>();

            foreach (var perdoruesi in perdoruesit)
            {
                var user = await _userManager.FindByIdAsync(perdoruesi.AspNetUserId);
                var roletPerdoruesit = await _userManager.GetRolesAsync(user);

                if(roletPerdoruesit.Contains("Admin") || roletPerdoruesit.Contains("Shites"))
                {
                    var personi = new
                    {
                        perdoruesi.UserID,
                        perdoruesi.Emri,
                        perdoruesi.Mbiemri,
                        perdoruesi.Email,
                        Rolet = roletPerdoruesit
                    };

                    stafi.Add(personi);
                }
            }

            return Ok(stafi);
        }
    }



    public class RegisterModel
    {
        [Required(ErrorMessage = " Emri is required")]
        public string Emri { get; set; }
        [Required(ErrorMessage = " Mbiemri is required")]
        public string Mbiemri { get; set; }
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        public string? RoliZgjedhur { get; set; }
    }
}