using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class KodiZbritjes
    {
        [Key]
        public string Kodi { get; set; } = null!;

        public DateTime? DataKrijimit { get; set; } = DateTime.Now;

        public decimal? QmimiZbritjes { get; set; } = 0;

        public int? ProduktiId { get; set; }
        public string? isDeleted { get; set; } = "false";

        [ForeignKey(nameof(ProduktiId))]
        public virtual Produkti? Produkti { get; set; }
    }
}
