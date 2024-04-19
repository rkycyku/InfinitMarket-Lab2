using InfinitMarket.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TeDhenatEDetajeve
{
    [Key]
    public int TeDhenatEDetajeveId { get; set; }

    public int KategoriaDetajeveId { get; set; }

    [ForeignKey(nameof(KategoriaDetajeveId))]
    public virtual KategoriteEDetajeve KategoriteEDetajeve { get; set; }

    public string TeDhenatJson { get; set; }
}