using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class Porosit
    {
        [Key]
        public int IdPorosia { get; set; }
        public int? IdKlienti { get; set; }
        public int? AdresaID { get; set; }
        public decimal? Totali18TVSH { get; set; } = 0;
        public decimal? Totali8TVSH { get; set; } = 0;
        public string? StatusiPorosis { get; set; } = "Ne Procesim";
        public decimal? Zbritja { get; set; } = 0;
        public int? TotaliProdukteve { get; set; } = 0;
        public string? LlojiTransportit { get; set; } = "Dergese ne Shtepi";
        public string? QmimiTransportit { get; set; } = "0";
        public string? LlojiPageses { get; set; } = "Cash";
        public DateTime? DataPorosis { get; set; } = DateTime.Now;
        [ForeignKey(nameof(IdKlienti))]
        public virtual Perdoruesi? Klienti { get; set; }
        [ForeignKey(nameof(AdresaID))]
        public virtual AdresatPerdoruesit? AdresaDorezimit { get; set; }
        public virtual List<TeDhenatEPorosis>? TeDhenatEPorosis { get; set; }
    }
}
