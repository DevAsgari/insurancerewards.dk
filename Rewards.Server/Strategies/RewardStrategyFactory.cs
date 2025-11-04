namespace Rewards.Server.Strategies
{
    public class RewardStrategyFactory : IRewardStrategyFactory
    {
        private readonly Dictionary<RewardStrategyType, IRewardStrategy> _strategies;

        public RewardStrategyFactory()
        {
            _strategies = new Dictionary<RewardStrategyType, IRewardStrategy>
            {
                { RewardStrategyType.CustomerSatisfaction, new CustomerSatisfactionRewardStrategy() },
                { RewardStrategyType.SalesPrice, new SalesPriceRewardStrategy() },
                { RewardStrategyType.Combined, new CombinedRewardStrategy() },
                { RewardStrategyType.Adjusted, new AdapterRewardStrategy() }
            };
        }

        public IRewardStrategy GetStrategy(RewardStrategyType strategyType)
        {
            if (_strategies.TryGetValue(strategyType, out var strategy))
            {
                return strategy;
            }

            throw new ArgumentException($"Invalid strategy type: {strategyType}", nameof(strategyType));
        }
    }
}
