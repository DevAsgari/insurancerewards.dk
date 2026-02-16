namespace Rewards.Server.DTOs
{
    public class CalculateRewardDto
    {
        public Guid Id { get; set; }
        public string InsuranceTypeName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime SaleDate { get; set; }
        public int CustomerSatisfaction { get; set; }
        public decimal RewardValue { get; set; }
    }
}
