using Rewards.Server.Entities;
using Rewards.Server.Strategies;

namespace Rewards.Server.Tests.Strategies
{
    public class CombinedRewardStrategyTests
    {
        private readonly CombinedRewardStrategy _strategy;

        public CombinedRewardStrategyTests()
        {
            _strategy = new CombinedRewardStrategy();
        }

        [Fact]
        public void CalculateReward_WithPrice1000AndSatisfaction5_Returns150()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleType = "Life",
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            // (1000 * 0.05) + (5 * 20) = 50 + 100 = 150
            Assert.Equal(150m, reward);
        }

        [Fact]
        public void CalculateReward_WithPrice2000AndSatisfaction10_Returns300()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleType = "Life",
                Price = 2000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 10
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            // (2000 * 0.05) + (10 * 20) = 100 + 200 = 300
            Assert.Equal(300m, reward);
        }

        [Fact]
        public void CalculateReward_WithZeroValues_Returns0()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleType = "Life",
                Price = 0m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 0
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            Assert.Equal(0m, reward);
        }
    }
}
