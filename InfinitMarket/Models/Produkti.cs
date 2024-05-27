using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models
{
    public class Produkti
    {
        [Key]
        public int ProduktiId { get; set; }

        public string? EmriProduktit { get; set; } = "";

        public string? Pershkrimi { get; set; } = "";

        public string? FotoProduktit { get; set; } = "ProduktPaFoto.png";

        public int? KompaniaId { get; set; }

        public int? KategoriaId { get; set; }
        public string? isDeleted { get; set; } = "false";

        [ForeignKey(nameof(KategoriaId))]
        public virtual KategoriaProduktit? Kategoria { get; set; }

        [ForeignKey(nameof(KompaniaId))]
        public virtual KompanitePartnere? KompanitePartnere { get; set; }

        public virtual TeDhenatProduktit? TeDhenatProduktit { get; set; }

        public virtual List<TeDhenatEPorosis>? TeDhenatEPorosis { get; set; }
        public virtual ZbritjaQmimitProduktit? ZbritjaQmimitProduktit { get; set; }
    }
}
