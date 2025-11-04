using Rewards.Server.Entities;

namespace Rewards.Server.Strategies
{
    public class CustomerSatisfactionRewardStrategy : IRewardStrategy
    {
        private const decimal SatisfactionMultiplier = 10m;

        public decimal CalculateReward(Sale sale)
        {
            return sale.CustomerSatisfaction * SatisfactionMultiplier;
        }
    }
}
