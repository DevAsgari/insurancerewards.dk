using Rewards.Server.Entities;
using Rewards.Server.Strategies;

namespace Rewards.Server.Tests.Strategies
{
    public class CustomerSatisfactionRewardStrategyTests
    {
        private readonly CustomerSatisfactionRewardStrategy _strategy;

        public CustomerSatisfactionRewardStrategyTests()
        {
            _strategy = new CustomerSatisfactionRewardStrategy();
        }

        [Fact]
        public void CalculateReward_WithSatisfactionScore5_Returns50()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 1,
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
        public void CalculateReward_WithSatisfactionScore0_Returns0()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 0
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            Assert.Equal(0m, reward);
        }

        [Fact]
        public void CalculateReward_WithSatisfactionScore10_Returns100()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 10
            };

            // Act
            var reward = _strategy.CalculateReward(sale);

            // Assert
            Assert.Equal(100m, reward);
        }
    }
}
