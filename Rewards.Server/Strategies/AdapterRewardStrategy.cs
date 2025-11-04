using Rewards.Server.Entities;
using Tredjepart;

namespace Rewards.Server.Strategies
{
    public class AdapterRewardStrategy : IRewardStrategy
    {
        private readonly StrategyFromAnotherCompany _externalStrategy;

        public AdapterRewardStrategy()
        {
            _externalStrategy = new StrategyFromAnotherCompany();
        }

        public decimal CalculateReward(Sale sale)
        {
            // External library only supports integer prices
            // Note: This causes precision loss for cents/øre
            int priceAsInt = (int)decimal.Round(sale.Price);
            int rewardAsInt = _externalStrategy.Calculate(priceAsInt);

            return rewardAsInt;
        }
    }
}
