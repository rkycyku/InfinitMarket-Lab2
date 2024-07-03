using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Building
    {
        [Key]
        public int BuildingID { get; set; }
        public string? Name { get; set; } = "";
        public string? Location { get; set; } = "";
    }
}
