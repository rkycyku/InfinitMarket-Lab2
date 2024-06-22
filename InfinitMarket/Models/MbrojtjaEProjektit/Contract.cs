using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Contract
    {
        [Key]
        public int ContractID { get; set; }
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public int EmployeeID { get; set; }
        [ForeignKey(nameof(EmployeeID))]
        public Employee? Employee { get; set; }
    }
}
