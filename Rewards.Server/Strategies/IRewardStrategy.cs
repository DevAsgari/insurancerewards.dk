using Rewards.Server.Entities;

namespace Rewards.Server.Strategies
{
    public interface IRewardStrategy
    {
        decimal CalculateReward(Sale sale);

    }
}
