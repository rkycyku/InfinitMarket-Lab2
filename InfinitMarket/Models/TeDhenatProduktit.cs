using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class TeDhenatProduktit
    {
        [Key]
        public int TeDhenatProduktitID { get; set; }

        public int ProduktiId { get; set; }

        public int? SasiaNeStok { get; set; } = 0;

        public decimal? QmimiBleres { get; set; } = 0;

        public decimal? QmimiProduktit { get; set; } = 0;
        public int? llojiTVSH {  get; set; } = 0;

        public DateTime? DataKrijimit { get; set; } = DateTime.Now;

        public DateTime? DataPerditsimit { get; set; } = DateTime.Now;
        [ForeignKey(nameof(ProduktiId))]
        public virtual Produkti? Produkti { get; set; }
    }
}
