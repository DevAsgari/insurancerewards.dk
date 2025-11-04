namespace Rewards.Server.Strategies
{
    public interface IRewardStrategyFactory
    {
        IRewardStrategy GetStrategy(RewardStrategyType strategyType);
    }
}
