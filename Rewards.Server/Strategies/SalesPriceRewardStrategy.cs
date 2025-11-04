using Rewards.Server.Entities;

namespace Rewards.Server.Strategies
{
    public class SalesPriceRewardStrategy : IRewardStrategy
    {
        private const decimal RewardPercentage = 0.05m;

        public decimal CalculateReward(Sale sale)
        {
            return sale.Price * RewardPercentage;
        }
    }
}
