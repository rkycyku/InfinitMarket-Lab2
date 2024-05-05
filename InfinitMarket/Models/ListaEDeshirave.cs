using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class ListaEDeshirave
    {
        [Key]
        public int ListaEDeshiraveID { get; set; }
        public int ProduktiID { get; set; }
        public int KlientiID { get; set; }
        public DateTime? DataKrijimit { get; set; } = DateTime.Now;

        [ForeignKey(nameof(ProduktiID))]
        public virtual Produkti? Produkti { get; set; }
        [ForeignKey(nameof(KlientiID))]
        public virtual Perdoruesi? Klienti { get; set; }
    }
}
