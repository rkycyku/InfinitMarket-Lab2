using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Authorization;
using InfinitMarket.Data;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Controllers
{
    [Authorize(Policy = "punonAdministrat")]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
                return LocalRedirect("/Identity/Account/Login");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}