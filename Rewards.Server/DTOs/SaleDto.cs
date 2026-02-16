namespace Rewards.Server.DTOs
{
    public class SaleDto
    {
        public required Guid Id { get; set; }
        public int InsuranceTypeId { get; set; }
        public string InsuranceTypeName { get; set; } = string.Empty;
        public required decimal Price { get; set; }
        public required DateTime SaleDate { get; set; }
        public int CustomerSatisfaction { get; set; }
    }
}
