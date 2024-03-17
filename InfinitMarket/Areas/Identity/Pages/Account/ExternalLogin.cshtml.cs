// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using InfinitMarket.Models;
using Microsoft.EntityFrameworkCore;
using InfinitMarket.Data;

namespace InfinitMarket.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ExternalLoginModel : PageModel
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IUserStore<IdentityUser> _userStore;
        private readonly IUserEmailStore<IdentityUser> _emailStore;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<ExternalLoginModel> _logger;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public ExternalLoginModel(
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager,
            IUserStore<IdentityUser> userStore,
            ILogger<ExternalLoginModel> logger,
            IConfiguration configuration,
            IEmailSender emailSender,
            ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _userStore = userStore;
            _emailStore = GetEmailStore();
            _logger = logger;
            _configuration = configuration;
            _emailSender = emailSender;
            _context = context;
        }


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
        public string ProviderDisplayName { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public string ReturnUrl { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string ErrorMessage { get; set; }

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
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Required(ErrorMessage = "Ju lutem shenoni Emailin!")]
            [EmailAddress(ErrorMessage = "Ju lutem shenoni nje email valid!")]
            [Display(Name = "Email")]
            public string Email { get; set; }
            public string ConfirmPassword { get; set; }
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

            [Required(ErrorMessage = "Ju lutem shenoni Daten e Lindjes!")]
            public DateTime? DataLindjes { get; set; }

            public string? Username { get; set; }

            public string? ShtetiZgjedhur { get; set; }

            public string? GjiniaZgjedhur { get; set; }

            public string? RoliIZgjedhur { get; set; }

            public DateTime? DataKrijimit { get; set; } = DateTime.Now;
        }

        public IActionResult OnGet() => RedirectToPage("./Login");

        public IActionResult OnPost(string provider, string returnUrl = null)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Page("./ExternalLogin", pageHandler: "Callback", values: new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }

        public async Task<IActionResult> OnGetCallbackAsync(string returnUrl = null, string remoteError = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            if (remoteError != null)
            {
                ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
            }
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ErrorMessage = "Error loading external login information.";
                return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

            if (result.Succeeded)
            {
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                Console.WriteLine(info.Principal.Identity.Name);
                var user = await _userManager.FindByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email));

                var roles = await _userManager.GetRolesAsync(user);

                var jwtToken = GenerateJwtToken(user, roles);

                Console.WriteLine(jwtToken);
                    var redirectUrl = "http://localhost:3000/login?token=" + jwtToken;
                    await _signInManager.SignOutAsync();
                    return Redirect(redirectUrl);
            }
            if (result.IsLockedOut)
            {
                return RedirectToPage("./Lockout");
            }
            else
            {
                // If the user does not have an account, then ask the user to create an account.
                ReturnUrl = returnUrl;
                ProviderDisplayName = info.ProviderDisplayName;
                if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
                {
                    Input = new InputModel
                    {
                        Email = info.Principal.FindFirstValue(ClaimTypes.Email)
                    };
                }
                return Page();
            }
        }

        public async Task<IActionResult> OnPostConfirmationAsync(string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            // Get the information about the user from the external login provider
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ErrorMessage = "Error loading external login information during confirmation.";
                return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
            }

            if (ModelState.IsValid)
            {
                var user = CreateUser();

                await _userStore.SetUserNameAsync(user, Input.Email, CancellationToken.None);
                await _emailStore.SetEmailAsync(user, Input.Email, CancellationToken.None);

                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await _userManager.AddLoginAsync(user, info);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);

                        var userId = await _userManager.GetUserIdAsync(user);

                        await _userManager.AddToRolesAsync(user, new[] { "User", Input.RoliIZgjedhur });

                        Perdoruesi perdoruesi = new Perdoruesi()
                        {
                            AspNetUserId = userId,
                            Emri = Input.Emri,
                            Email = Input.Email,
                            Username = Input.Username,
                            Mbiemri = Input.Mbiemri,
                        };
                        await _context.Perdoruesit.AddAsync(perdoruesi);
                        await _context.SaveChangesAsync();

                        TeDhenatPerdoruesit teDhenatPerdoruesit = new()
                        {
                            UserID = perdoruesi.UserID,
                            Adresa = Input.Adresa,
                            Qyteti = Input.Qyteti,
                            Shteti = Input.ShtetiZgjedhur,
                            ZipKodi = Input.ZipKodi > 0 ? Input.ZipKodi : 0,
                            NrKontaktit = Input.NrTelefonit,
                            DataKrijimit = Input.DataKrijimit,
                            DataLindjes = Input.DataLindjes,
                            Gjinia = Input.GjiniaZgjedhur,
                        };
                        await _context.TeDhenatPerdoruesit.AddAsync(teDhenatPerdoruesit);
                        await _context.SaveChangesAsync();

                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                        var callbackUrl = Url.Page(
                            "/Account/ConfirmEmail",
                            pageHandler: null,
                            values: new { area = "Identity", userId = userId, code = code },
                            protocol: Request.Scheme);

                        await _emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                            $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                        // If account confirmation is required, we need to show the link if we don't have a real email sender
                        if (_userManager.Options.SignIn.RequireConfirmedAccount)
                        {
                            return RedirectToPage("./RegisterConfirmation", new { Email = Input.Email });
                        }

                        await _signInManager.SignInAsync(user, isPersistent: false, info.LoginProvider);
                        var userKrijuar = await _userManager.FindByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email));

                        var roles = await _userManager.GetRolesAsync(userKrijuar);

                        var jwtToken = GenerateJwtToken(userKrijuar, roles);

                        Console.WriteLine(jwtToken);
                        var redirectUrl = "http://localhost:3000/login?token=" + jwtToken;
                        await _signInManager.SignOutAsync();
                        return Redirect(redirectUrl);
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            ProviderDisplayName = info.ProviderDisplayName;
            ReturnUrl = returnUrl;
            return Page();
        }

        private IdentityUser CreateUser()
        {
            try
            {
                return Activator.CreateInstance<IdentityUser>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(IdentityUser)}'. " +
                    $"Ensure that '{nameof(IdentityUser)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the external login page in /Areas/Identity/Pages/Account/ExternalLogin.cshtml");
            }
        }

        private IUserEmailStore<IdentityUser> GetEmailStore()
        {
            if (!_userManager.SupportsUserEmail)
            {
                throw new NotSupportedException("The default UI requires a user store with email support.");
            }
            return (IUserEmailStore<IdentityUser>)_userStore;
        }

        private string GenerateJwtToken(IdentityUser user, IList<string> roles)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

            // Token descriptor
            var TokenDescriptor = new SecurityTokenDescriptor()
            {

                Subject = new ClaimsIdentity(new[]
                {
             new Claim("id", user.Id),
             new Claim(JwtRegisteredClaimNames.Sub, user.Email),
             new Claim(JwtRegisteredClaimNames.Email, value:user.Email),
             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
         }),

                Expires = DateTime.Now.AddDays(1).AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            foreach (var role in roles)
            {
                TokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            var token = jwtTokenHandler.CreateToken(TokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            return jwtToken;
        }
    }
}
