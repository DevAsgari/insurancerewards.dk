using Rewards.Server.DTOs;
using Rewards.Server.Entities;
using Rewards.Server.Strategies;

namespace Rewards.Server.Services
{
    public class RewardService
    {
        private readonly IRewardStrategyFactory _strategyFactory;

        public RewardService(IRewardStrategyFactory strategyFactory)
        {
            _strategyFactory = strategyFactory;
        }

        public List<CalculateRewardDto> CalculateRewards(List<Sale> sales, RewardStrategyType strategyType)
        {
            if (sales is null)
                throw new ArgumentNullException(nameof(sales), "Sales must not be null.");

            var strategy = _strategyFactory.GetStrategy(strategyType);

            return sales.Select(sale => new CalculateRewardDto
            {
                Id = sale.Id,
                InsuranceTypeName = sale.InsuranceType?.Name ?? string.Empty,
                Price = sale.Price,
                SaleDate = sale.SaleDate,
                CustomerSatisfaction = sale.CustomerSatisfaction,
                RewardValue = strategy.CalculateReward(sale)
            }).ToList();
        }
    }
}
