using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Models.MbrojtjaEProjektit
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }
        public string? FullName { get; set; }
        public string? IsActive { get; set; } = "true";
    }
}
