using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Stripe.Tax;
using Stripe;
using static StripeController;
using Microsoft.AspNetCore.Authorization;
using InfinitMarket.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

[Authorize(AuthenticationSchemes = "Bearer")]
[Route("api/TeNdryshme/[controller]")]
[ApiController]
public class StripeController : Controller
{
    private readonly ApplicationDbContext _context;

    public StripeController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost]
    [Route("KrijoPagesenStripe")]
    public async Task<IActionResult> KrijoPagesenStripe(PaymentIntentCreateRequest request)
    {
        var shporta = await _context.Shporta.Include(x => x.Perdoruesi).Include(x => x.Adresa).Where(x => x.ShportaID == request.ShportaID).FirstOrDefaultAsync();
        var teDhenatShporta = await _context.TeDhenatShporta.Where(x => x.ShportaID == request.ShportaID).ToListAsync();

        var paymentIntentService = new PaymentIntentService();
        var customerService = new CustomerService();
        Customer stripeCustomer = null;
        if (shporta.Perdoruesi != null && !string.IsNullOrEmpty(shporta.Perdoruesi.Email))
        {
            try
            {
                var customers = await customerService.ListAsync();

                foreach (var customer in customers)
                {
                    if (customer.Email == shporta.Perdoruesi.Email)
                    {
                        stripeCustomer = customer;
                    }
                }
            }
            catch (StripeException ex)
            {
                // Handle Stripe exceptions (e.g., customer not found)
                Console.WriteLine($"Stripe Error: {ex.Message}");
            }
        }

        // If the customer doesn't exist in Stripe, create a new one
        if (stripeCustomer == null)
        {
            var customerOptions = new CustomerCreateOptions
            {
                Email = shporta.Perdoruesi != null ? shporta.Perdoruesi.Email : "guest@example.com",
                Name = shporta.Perdoruesi.Emri + " " + shporta.Perdoruesi.Mbiemri
            };

            try
            {
                stripeCustomer = await customerService.CreateAsync(customerOptions);
            }
            catch (StripeException ex)
            {
                // Handle Stripe exceptions (e.g., invalid parameters, authentication errors, etc.)
                Console.WriteLine($"Stripe Error: {ex.Message}");
            }
        }

        var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
        {
            Amount = request.ShumaTotale,
            Currency = "eur",
            Description = "",
            Customer = stripeCustomer?.Id,
            Metadata = new Dictionary<string, string>
        {
                { "TVSH18", ((shporta.Totali18TVSH - (shporta.Totali18TVSH / (decimal)1.18)).ToString() + " €")},
                { "TVSH8", ((shporta.Totali8TVSH - (shporta.Totali8TVSH / (decimal)1.08)).ToString() + " €") },
        },
            Shipping = new ChargeShippingOptions
            {
                Name = shporta.Adresa.Emri + " " + shporta.Adresa.Mbiemri,
                Phone = shporta.Adresa.NrKontaktit,
                Address = new AddressOptions
                {
                    Line1 = shporta.Adresa.Adresa,
                    City = shporta.Adresa.Qyteti,
                    PostalCode = shporta.Adresa.ZipKodi.ToString(),
                    Country = shporta.Adresa.Shteti,
                }
            }
        });

        return Json(new { clientSecret = paymentIntent.ClientSecret });
    }

    [Authorize]
    [HttpGet]
    [Route("ShfaqPagesat")]
    public List<CustomOrder> ShfaqPagesat()
    {
        var options = new PaymentIntentListOptions
        {

        };

        var service = new PaymentIntentService();
        var paymentIntents = service.List(options);

        // Map retrieved data to custom model while excluding unwanted fields
        var customOrders = paymentIntents.Data.Select(intent => new CustomOrder
        {
            Id = intent.Id,
            Amount = intent.Amount,
            Created = intent.Created,
            Currency = intent.Currency,
            Description = intent.Description,
            Metadata = intent.Metadata,
            Status = intent.Status
        }).ToList();

        return customOrders;
    }

    [Authorize]
    [HttpDelete]
    [Route("AnuloPagesen")]
    public async void AnuloPagesen(string orderId)
    {
        var service = new PaymentIntentService();
        var paymentIntent = service.CancelAsync(
            orderId,
            new PaymentIntentCancelOptions { CancellationReason = "abandoned" }
        );
    }

    public class CustomOrder
    {
        public string Id { get; set; }
        public long Amount { get; set; }
        public DateTime Created { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public Dictionary<string, string> Metadata { get; set; }
        public string Status { get; set; }
    }

    public class PaymentIntentCreateRequest
    {
        [JsonProperty("shportaID")]
        public int ShportaID { get; set; }
        [JsonProperty("shumaTotale")]
        public long ShumaTotale { get; set; }
    }
}