using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Models
{
    public class SliderOfertat
    {
        [Key]
        public int SliderOfertatID { get; set; }    
        public string? LinkuOfertes { get; set; }
        public DateTime? DataFillimitOfertes { get; set; } = DateTime.Now;
        public DateTime? DataMbarimitOfertes { get; set; }
        public string? FotoOferta { get; set; }
        public string? isDeleted { get; set; } = "false";
        /*public int? ProduktiID { get; set; }
        public int? KategoriaID { get; set; }
        public int? PartneriID { get; set; }*/
    }
}
