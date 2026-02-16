using System.ComponentModel.DataAnnotations;

namespace Rewards.Server.Entities
{
    public class InsuranceType
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public required string Name { get; set; }
        public ICollection<Sale> Sales { get; set; } = [];
    }
}
