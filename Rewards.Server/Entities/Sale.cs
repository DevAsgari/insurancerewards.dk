using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Rewards.Server.Entities
{
    public class Sale
    {
        [Key]
        public required Guid Id { get; set; }
        public required string SaleType { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public required decimal Price { get; set; }
        public required DateTime SaleDate { get; set; }
        public int CustomerSatisfaction { get; set; }
    }
}
