using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class AdresatPerdoruesit
    {
        [Key]
        public int AdresaID { get; set; }
        public int PerdoruesiID { get; set; }
        public string? Qyteti { get; set; } = "";
        public int? ZipKodi { get; set; } = 0;
        public string? Adresa { get; set; } = "";
        public string? Shteti { get; set; } = "";
        public string? Email { get; set; } = "";
        public string? NrKontaktit { get; set; } = "";
        public string? Emri { get; set; } = "";
        public string? Mbiemri { get; set; } = "";

        [ForeignKey(nameof(PerdoruesiID))]
        public virtual Perdoruesi? Perdoruesi { get; set;}
    }
}
