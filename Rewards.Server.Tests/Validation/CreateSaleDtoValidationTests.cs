using System.ComponentModel.DataAnnotations;
using Rewards.Server.DTOs;
using Rewards.Server.Validation;

namespace Rewards.Server.Tests.Validation
{
    public class CreateSaleDtoValidationTests
    {
        private static IList<ValidationResult> ValidateDto(CreateSaleDto dto)
        {
            var context = new ValidationContext(dto);
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(dto, context, results, validateAllProperties: true);
            return results;
        }

        [Fact]
        public void CreateSaleDto_WithValidData_PassesValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000.00m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #region Price Validation Tests

        [Fact]
        public void CreateSaleDto_WithZeroPrice_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 0m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.Price.MinErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void CreateSaleDto_WithNegativePrice_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = -100m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.Price.MinErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void CreateSaleDto_WithPriceAboveMaximum_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1_500_000m, // Above max of 1,000,000
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains("Price", results[0].ErrorMessage);
        }

        [Fact]
        public void CreateSaleDto_WithMinimumValidPrice_PassesValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = (decimal)ValidationConstants.Price.MinValue,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        [Fact]
        public void CreateSaleDto_WithMaximumValidPrice_PassesValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = (decimal)ValidationConstants.Price.MaxValue,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #endregion

        #region Customer Satisfaction Validation Tests

        [Fact]
        public void CreateSaleDto_WithSatisfactionBelowMinimum_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 0
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.CustomerSatisfaction.RangeErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void CreateSaleDto_WithSatisfactionAboveMaximum_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 6
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
        public void CreateSaleDto_WithValidSatisfactionRatings_PassesValidation(int satisfaction)
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = satisfaction
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Empty(results);
        }

        #endregion

        #region SaleType Validation Tests

        [Fact]
        public void CreateSaleDto_WithEmptySaleType_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = string.Empty,
                Price = 1000m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.NotEmpty(results);
            Assert.Contains(results, r => r.ErrorMessage!.Contains("Sale type"));
        }

        [Fact]
        public void CreateSaleDto_WithSaleTypeTooLong_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = new string('A', ValidationConstants.SaleType.MaxLength + 1),
                Price = 1000m,
                SaleDate = DateTime.UtcNow,
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.SaleType.LengthErrorMessage, results[0].ErrorMessage);
        }

        #endregion

        #region SaleDate Validation Tests

        [Fact]
        public void CreateSaleDto_WithDateTooOld_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000m,
                SaleDate = DateTime.UtcNow.AddYears(-ValidationConstants.SaleDate.MaxYearsInPast - 1),
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.SaleDate.TooOldErrorMessage, results[0].ErrorMessage);
        }

        [Fact]
        public void CreateSaleDto_WithDateTooFarInFuture_FailsValidation()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = "Life Insurance",
                Price = 1000m,
                SaleDate = DateTime.UtcNow.AddDays(ValidationConstants.SaleDate.MaxDaysInFuture + 1),
                CustomerSatisfaction = 4
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.Single(results);
            Assert.Contains(ValidationConstants.SaleDate.TooFarInFutureErrorMessage, results[0].ErrorMessage);
        }

        #endregion

        #region Multiple Validation Errors Tests

        [Fact]
        public void CreateSaleDto_WithMultipleInvalidFields_ReturnsMultipleErrors()
        {
            // Arrange
            var dto = new CreateSaleDto
            {
                Id = Guid.NewGuid(),
                SaleType = string.Empty,
                Price = -100m,
                SaleDate = DateTime.UtcNow.AddYears(-20),
                CustomerSatisfaction = 0
            };

            // Act
            var results = ValidateDto(dto);

            // Assert
            Assert.True(results.Count >= 3, $"Expected at least 3 validation errors, got {results.Count}");
        }

        #endregion
    }
}
