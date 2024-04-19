using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Stripe.Tax;
using Stripe;
using static PaymentIntentApiController;

[Route("create-payment-intent")]
[ApiController]
public class PaymentIntentApiController : Controller
{
    [HttpPost]
    public ActionResult Create(PaymentIntentCreateRequest request)
    {
        string description = string.Join(", ", request.Items.Select(item => item.Id));

        var paymentIntentService = new PaymentIntentService();
        var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
        {
            Amount = request.shumaTot,
            Currency = "eur",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
            Description = description,
            Metadata = new Dictionary<string, string>
        {
        },
        });

        return Json(new { clientSecret = paymentIntent.ClientSecret });
    }

    public class Item
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("Amount")]
        public long Amount { get; set; }
    }

    public class PaymentIntentCreateRequest
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }
        [JsonProperty("shumaTot")]
        public long shumaTot {  get; set; }
    }
}