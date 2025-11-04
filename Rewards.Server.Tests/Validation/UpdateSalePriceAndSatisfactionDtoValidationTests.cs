using System.ComponentModel.DataAnnotations;
using Rewards.Server.DTOs;
using Rewards.Server.Validation;

namespace Rewards.Server.Tests.Validation
{
    public class UpdateSalePriceAndSatisfactionDtoValidationTests
    {
        private static IList<ValidationResult> ValidateDto(UpdateSalePriceAndSatisfactionDto dto)
        {
            var context = new ValidationContext(dto);
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(dto, context, results, validateAllProperties: true);
            return results;
        }

        [Fact]
        public void UpdateDto_WithValidData_PassesValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 1500.00m,
                CustomerSatisfaction = 5
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #region Price Validation Tests

        [Fact]
        public void UpdateDto_WithZeroPrice_FailsValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 0m,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.Price.MinErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void UpdateDto_WithNegativePrice_FailsValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = -500m,
                CustomerSatisfaction = 3
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.Price.MinErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void UpdateDto_WithPriceAboveMaximum_FailsValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 2_000_000m, // Above max of 1,000,000
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains("Price", results[0].ErrorMessage);
        }

        [Fact]
        public void UpdateDto_WithMinimumValidPrice_PassesValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = (decimal)ValidationConstants.Price.MinValue,
                CustomerSatisfaction = 3
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        [Fact]
        public void UpdateDto_WithMaximumValidPrice_PassesValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = (decimal)ValidationConstants.Price.MaxValue,
                CustomerSatisfaction = 3
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #endregion

        #region Customer Satisfaction Validation Tests

        [Fact]
        public void UpdateDto_WithSatisfactionBelowMinimum_FailsValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 1000m,
                CustomerSatisfaction = 0
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.CustomerSatisfaction.RangeErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void UpdateDto_WithSatisfactionAboveMaximum_FailsValidation()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 1000m,
                CustomerSatisfaction = 10
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.CustomerSatisfaction.RangeErrorMessage, results[0].ErrorMessage);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        [InlineData(4)]
        [InlineData(5)]
        public void UpdateDto_WithValidSatisfactionRatings_PassesValidation(int satisfaction)
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = 2000m,
                CustomerSatisfaction = satisfaction
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #endregion

        #region Multiple Validation Errors Tests

        [Fact]
        public void UpdateDto_WithBothFieldsInvalid_ReturnsMultipleErrors()
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = -100m,
                CustomerSatisfaction = 0
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Equal(2, results.Count);
        }

        #endregion

        #region Boundary Tests

        [Theory]
        [InlineData(0.01)] // Minimum valid
        [InlineData(100)]
        [InlineData(1000)]
        [InlineData(50000)]
        [InlineData(999999.99)]
        [InlineData(1000000)] // Maximum valid
        public void UpdateDto_WithVariousValidPrices_PassesValidation(double price)
        {
            // Arrange
            var dto = new UpdateSalePriceAndSatisfactionDto
            {
                Price = (decimal)price,
                CustomerSatisfaction = 3
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #endregion
    }
}
