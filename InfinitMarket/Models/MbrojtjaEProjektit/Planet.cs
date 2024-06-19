using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Planet
    {
        [Key]
        public int PlanetId { get; set; }
        public string? Name { get; set; } = "";
        public string? Type { get; set; } = "";
        public string? isDeleted { get; set; } = "false";
    }
}
