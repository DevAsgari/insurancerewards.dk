using Rewards.Server.Strategies;

namespace Rewards.Server.Tests.Strategies
{
    public class RewardStrategyFactoryTests
    {
        private readonly RewardStrategyFactory _factory;

        public RewardStrategyFactoryTests()
        {
            _factory = new RewardStrategyFactory();
        }

        [Fact]
        public void GetStrategy_WithCustomerSatisfaction_ReturnsCorrectStrategy()
        {
            // Act
            var strategy = _factory.GetStrategy(RewardStrategyType.CustomerSatisfaction);

            // Assert
            Assert.IsType<CustomerSatisfactionRewardStrategy>(strategy);
        }

        [Fact]
        public void GetStrategy_WithSalesPrice_ReturnsCorrectStrategy()
        {
            // Act
            var strategy = _factory.GetStrategy(RewardStrategyType.SalesPrice);

            // Assert
            Assert.IsType<SalesPriceRewardStrategy>(strategy);
        }

        [Fact]
        public void GetStrategy_WithCombined_ReturnsCorrectStrategy()
        {
            // Act
            var strategy = _factory.GetStrategy(RewardStrategyType.Combined);

            // Assert
            Assert.IsType<CombinedRewardStrategy>(strategy);
        }

        [Fact]
        public void GetStrategy_WithAdjusted_ReturnsCorrectStrategy()
        {
            // Act
            var strategy = _factory.GetStrategy(RewardStrategyType.Adjusted);

            // Assert
            Assert.IsType<AdapterRewardStrategy>(strategy);
        }

        [Fact]
        public void GetStrategy_WithInvalidType_ThrowsArgumentException()
        {
            // Arrange
            var invalidType = (RewardStrategyType)999;

            // Act & Assert
            Assert.Throws<ArgumentException>(() => _factory.GetStrategy(invalidType));
        }
    }
}
