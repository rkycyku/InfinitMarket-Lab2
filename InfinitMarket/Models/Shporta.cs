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
        public DateTime? DataEFunditEPerditesimit { get; set; } = DateTime.Now;

        [ForeignKey(nameof(PerdoruesiID))]
        public virtual Perdoruesi? Perdoruesi { get; set;}
    }
}
