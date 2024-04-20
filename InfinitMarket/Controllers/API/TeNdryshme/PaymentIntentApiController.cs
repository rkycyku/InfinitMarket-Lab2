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
                { "key1", "value1" },
                { "key2", "value2" },
        },
        });

        return Json(new { clientSecret = paymentIntent.ClientSecret });
    }

    [HttpGet]
    [Route("ShfaqPorosite")]
    public List<CustomOrder> GetAllOrders()
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
    [HttpDelete]
    [Route("CancelOrder")]
    public async void CancelOrder(string orderId)
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