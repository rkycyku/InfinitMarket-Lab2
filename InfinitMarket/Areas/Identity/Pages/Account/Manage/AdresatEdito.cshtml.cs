// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using InfinitMarket.Data;
using InfinitMarket.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace InfinitMarket.Areas.Identity.Pages.Account.Manage
{
    public class AdresatEditoModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public AdresatEditoModel(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string StatusMessage { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [BindProperty]
        public InputModel Input { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public class InputModel
        {
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Required(ErrorMessage = "Ju lutem shenoni Emrin!")]
            [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Emri duhet te permbaje vetem shkronja.")]
            public string? Emri { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Mbiemrin!")]
            [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Mbiemri duhet te permbaje vetem shkronja.")]
            public string? Mbiemri { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Adresen!")]
            public string? Adresa { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Qytetin!")]
            [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Qyteti duhet te permbaje vetem shkronja.")]
            public string? Qyteti { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Zip Kodin!")]
            [Range(1000, 99999, ErrorMessage = "Zip Kodi duhet te jete mes 1000 dhe 99999!")]
            public int? ZipKodi { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Numri e Telefonit!")]
            [RegularExpression(@"^(?:\+\d{11}|\d{9})$", ErrorMessage = "Numri telefonit duhet te jete ne formatin: 045123123 ose +38343123132!")]
            public string? NrTelefonit { get; set; }

            [Required(ErrorMessage = "Ju lutem shenoni Email Adresen!")]
            [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Ju lutem shenoni nje email valid!")]
            public string? Email { get; set; }

            public string? ShtetiZgjedhur { get; set; }
        }


        public async Task<IActionResult> OnGetAsync(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var adresa = await _context.AdresatPerdoruesit.FindAsync(id);

            Input = new InputModel()
            {
                Qyteti = adresa?.Qyteti,
                ShtetiZgjedhur = adresa?.Shteti,
                Adresa = adresa?.Adresa,
                Email = adresa?.Email,
                Emri = adresa?.Emri,
                Mbiemri = adresa?.Mbiemri,
                ZipKodi = adresa?.ZipKodi,
                NrTelefonit = adresa?.NrKontaktit,
            };

            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var perdoruesi = await _context.Perdoruesit.Include(x => x.TeDhenatPerdoruesit).Where(x => x.AspNetUserId == user.Id).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var adresa = await _context.AdresatPerdoruesit.FindAsync(id);

            adresa.Emri = Input.Emri;
            adresa.Mbiemri = Input.Mbiemri;
            adresa.ZipKodi = Input.ZipKodi;
            adresa.Shteti = Input.ShtetiZgjedhur;
            adresa.Email = Input.Email;
            adresa.NrKontaktit = Input.NrTelefonit;
            adresa.Qyteti = Input.Qyteti;
            adresa.Adresa = Input.Adresa;

            _context.AdresatPerdoruesit.Update(adresa);
            await _context.SaveChangesAsync();

            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Adresa u perditesua me sukses!";
            return RedirectToPage("Adresat");
        }
    }
}
