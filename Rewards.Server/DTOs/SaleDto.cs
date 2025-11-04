namespace Rewards.Server.DTOs
{
    public class SaleDto
    {
        public required Guid Id { get; set; }
        public required string SaleType { get; set; }
        public required decimal Price { get; set; }
        public required DateTime SaleDate { get; set; }
        public int CustomerSatisfaction { get; set; }
    }
}
