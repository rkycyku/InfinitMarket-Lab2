using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class Shporta
    {
        [Key]
        public int ShportaID { get; set; }
        public int? PerdoruesiID { get; set; }
        public int? TotaliProdukteveNeShporte { get; set; } = 0;
        public decimal? Totali18TVSH { get; set; } = 0;
        public int? TotProd18TVSH { get; set; } = 0;
        public decimal? Totali8TVSH { get; set; } = 0;
        public int? TotProd8TVSH { get; set; } = 0;
        public DateTime? DataEFunditEPerditesimit { get; set; } = DateTime.Now;
        public string? KodiZbritjesID { get; set; } = "NukKaZbritje";
        public int? AdresaPorosisID { get; set; }
        [ForeignKey(nameof(PerdoruesiID))]
        public virtual Perdoruesi? Perdoruesi { get; set;}
        [ForeignKey(nameof(KodiZbritjesID))]
        public virtual KodiZbritjes? KodiZbritjes { get; set; }
        [ForeignKey(nameof(AdresaPorosisID))]
        public virtual AdresatPerdoruesit? Adresa { get; set; }
    }
}
