using Rewards.Server.Entities;

namespace Rewards.Server.Strategies
{
    public class CombinedRewardStrategy : IRewardStrategy
    {
        private const decimal PriceRewardPercentage = 0.05m;
        private const decimal SatisfactionMultiplier = 20m;

        public decimal CalculateReward(Sale sale)
        {
            return (sale.Price * PriceRewardPercentage) + (sale.CustomerSatisfaction * SatisfactionMultiplier);
        }
    }
}
