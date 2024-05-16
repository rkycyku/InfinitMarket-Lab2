using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class AdresatPerdoruesit
    {
        [Key]
        public int AdresaID { get; set; }
        public int PerdoruesiID { get; set; }
        public string? Qyteti { get; set; } = "Prishtine";
        public int? ZipKodi { get; set; } = 10000;
        public string? Adresa { get; set; } = "P.A.";
        public string? Shteti { get; set; } = "Kosove";
        public string? Email { get; set; } = "xxx";
        public string? NrKontaktit { get; set; } = "0";
        public string? Emri { get; set; } = "xxx";
        public string? Mbiemri { get; set; } = "xxx";

        [ForeignKey(nameof(PerdoruesiID))]
        public virtual Perdoruesi? Perdoruesi { get; set;}
    }
}
