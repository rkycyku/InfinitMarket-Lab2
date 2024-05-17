using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Models

{
    public class KategoriteEDetajeve
    {
        [Key]
        public int KategoriaDetajeveId { get; set; }
        public string EmriKategoriseDetajeve { get; set; }

        public string DetajetJson { get; set; }

        public string? isDeleted { get; set; } = "false";
    }
}
