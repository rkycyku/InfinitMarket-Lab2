using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Renovation
    {
        [Key]
        public int RenovationID { get; set; }
        public string? Description { get; set; }
        public double? Cost { get; set; }
        public int BuildingID { get; set; }
        [ForeignKey(nameof(BuildingID))]
        public Building? Building { get; set; }
    }
}
