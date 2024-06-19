using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Satellite
    {
        [Key]
        public int SatelliteId { get; set; }
        public string? Name { get; set; } = "";
        public string? isDeleted { get; set; } = "false";
        public int? PlanetId { get; set; }
        [ForeignKey(nameof(PlanetId))]
        public virtual Planet? Planet { get; set; }
    }
}
