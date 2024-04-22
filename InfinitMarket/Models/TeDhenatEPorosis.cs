using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class TeDhenatEPorosis
    {
        [Key]
        public int IdDetajet { get; set; }
        public int? IdPorosia { get; set; }
        public int? IdProdukti { get; set; }
        public int? SasiaPorositur { get; set; } = 0;
        public decimal? QmimiProduktit { get; set; } = 0;
        [ForeignKey(nameof(IdPorosia))]
        public virtual Porosit? Porosia { get; set; }
        [ForeignKey(nameof(IdProdukti))]
        public virtual Produkti? Produkti { get; set; }
    }
}
