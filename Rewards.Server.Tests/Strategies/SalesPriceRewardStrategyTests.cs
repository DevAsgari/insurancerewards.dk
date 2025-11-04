using Rewards.Server.Entities;
using Rewards.Server.Strategies;

namespace Rewards.Server.Tests.Strategies
{
    public class SalesPriceRewardStrategyTests
    {
        private readonly SalesPriceRewardStrategy _strategy;

        public SalesPriceRewardStrategyTests()
        {
            _strategy = new SalesPriceRewardStrategy();
        }

        [Fact]
        public void CalculateReward_WithPrice1000_Returns50()
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
            Assert.Equal(50m, reward);
        }

        [Fact]
        public void CalculateReward_WithPrice2000_Returns100()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleType = "Life",
                Price = 2000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            Assert.Equal(100m, reward);
        }

        [Fact]
        public void CalculateReward_WithPrice0_Returns0()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleType = "Life",
                Price = 0m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            Assert.Equal(0m, reward);
        }
    }
}
