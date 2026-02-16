using Moq;
using Rewards.Server.Entities;
using Rewards.Server.Services;
using Rewards.Server.Strategies;

namespace Rewards.Server.Tests.Services
{
    public class RewardServiceTests
    {
        private readonly Mock<IRewardStrategyFactory> _mockFactory;
        private readonly Mock<IRewardStrategy> _mockStrategy;
        private readonly RewardService _service;

        public RewardServiceTests()
        {
            _mockFactory = new Mock<IRewardStrategyFactory>();
            _mockStrategy = new Mock<IRewardStrategy>();
            _service = new RewardService(_mockFactory.Object);
        }

        [Fact]
        public void CalculateRewards_WithNullSales_ThrowsArgumentNullException()
        {
            // Act & Assert
            Assert.Throws<ArgumentNullException>(() =>
                _service.CalculateRewards(null!, RewardStrategyType.Combined));
        }

        [Fact]
        public void CalculateRewards_WithEmptyList_ReturnsEmptyList()
        {
            // Arrange
            var sales = new List<Sale>();
            _mockFactory.Setup(f => f.GetStrategy(It.IsAny<RewardStrategyType>()))
                .Returns(_mockStrategy.Object);

            // Act
            var result = _service.CalculateRewards(sales, RewardStrategyType.Combined);

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void CalculateRewards_WithValidSales_ReturnsCorrectDtos()
        {
            // Arrange
            var sales = new List<Sale>
            {
                new Sale
                {
                    Id = Guid.NewGuid(),
                    InsuranceTypeId = 1,
                    Price = 1000m,
                    SaleDate = DateTime.Now,
                    CustomerSatisfaction = 5
                },
                new Sale
                {
                    Id = Guid.NewGuid(),
                    InsuranceTypeId = 2,
                    Price = 2000m,
                    SaleDate = DateTime.Now,
                    CustomerSatisfaction = 8
                }
            };

            _mockStrategy.Setup(s => s.CalculateReward(It.IsAny<Sale>()))
                .Returns(100m);
            _mockFactory.Setup(f => f.GetStrategy(RewardStrategyType.Combined))
                .Returns(_mockStrategy.Object);

            // Act
            var result = _service.CalculateRewards(sales, RewardStrategyType.Combined);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, dto => Assert.Equal(100m, dto.RewardValue));
            _mockStrategy.Verify(s => s.CalculateReward(It.IsAny<Sale>()), Times.Exactly(2));
        }

        [Fact]
        public void CalculateRewards_CallsFactoryWithCorrectStrategyType()
        {
            // Arrange
            var sales = new List<Sale>
            {
                new Sale
                {
                    Id = Guid.NewGuid(),
                    InsuranceTypeId = 1,
                    Price = 1000m,
                    SaleDate = DateTime.Now,
                    CustomerSatisfaction = 5
                }
            };

            _mockStrategy.Setup(s => s.CalculateReward(It.IsAny<Sale>()))
                .Returns(50m);
            _mockFactory.Setup(f => f.GetStrategy(RewardStrategyType.SalesPrice))
                .Returns(_mockStrategy.Object);

            // Act
            var result = _service.CalculateRewards(sales, RewardStrategyType.SalesPrice);

            // Assert
            _mockFactory.Verify(f => f.GetStrategy(RewardStrategyType.SalesPrice), Times.Once);
        }

        [Fact]
        public void CalculateRewards_MapsAllSalePropertiesCorrectly()
        {
            // Arrange
            var saleId = Guid.NewGuid();
            var saleDate = new DateTime(2025, 1, 15);
            var sales = new List<Sale>
            {
                new Sale
                {
                    Id = saleId,
                    InsuranceTypeId = 3,
                    Price = 5000m,
                    SaleDate = saleDate,
                    CustomerSatisfaction = 9
                }
            };

            _mockStrategy.Setup(s => s.CalculateReward(It.IsAny<Sale>()))
                .Returns(250m);
            _mockFactory.Setup(f => f.GetStrategy(It.IsAny<RewardStrategyType>()))
                .Returns(_mockStrategy.Object);

            // Act
            var result = _service.CalculateRewards(sales, RewardStrategyType.Combined);

            // Assert
            var dto = result.First();
            Assert.Equal(saleId, dto.Id);
            Assert.Equal(string.Empty, dto.InsuranceTypeName);
            Assert.Equal(5000m, dto.Price);
            Assert.Equal(saleDate, dto.SaleDate);
            Assert.Equal(9, dto.CustomerSatisfaction);
            Assert.Equal(250m, dto.RewardValue);
        }
    }
}
