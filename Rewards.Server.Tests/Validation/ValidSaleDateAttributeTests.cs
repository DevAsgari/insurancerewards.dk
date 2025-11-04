using System.ComponentModel.DataAnnotations;
using Rewards.Server.Validation;

namespace Rewards.Server.Tests.Validation
{
    public class ValidSaleDateAttributeTests
    {
        private readonly ValidSaleDateAttribute _attribute = new();

        [Fact]
        public void ValidSaleDate_WithNullValue_ReturnsValidationError()
        {
            // Arrange
            var context = new ValidationContext(new object());

            // Act
            var result = _attribute.GetValidationResult(null, context);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(ValidationConstants.SaleDate.RequiredErrorMessage, result.ErrorMessage);
        }

        [Fact]
        public void ValidSaleDate_WithInvalidType_ReturnsValidationError()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var invalidValue = "not a date";

            // Act
            var result = _attribute.GetValidationResult(invalidValue, context);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Invalid date format", result.ErrorMessage);
        }

        [Fact]
        public void ValidSaleDate_WithDateTooFarInPast_ReturnsValidationError()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var tooOldDate = DateTime.UtcNow.AddYears(-ValidationConstants.SaleDate.MaxYearsInPast).AddDays(-1);

            // Act
            var result = _attribute.GetValidationResult(tooOldDate, context);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(ValidationConstants.SaleDate.TooOldErrorMessage, result.ErrorMessage);
        }

        [Fact]
        public void ValidSaleDate_WithDateTooFarInFuture_ReturnsValidationError()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var tooFutureDate = DateTime.UtcNow.AddDays(ValidationConstants.SaleDate.MaxDaysInFuture + 1);

            // Act
            var result = _attribute.GetValidationResult(tooFutureDate, context);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(ValidationConstants.SaleDate.TooFarInFutureErrorMessage, result.ErrorMessage);
        }

        [Fact]
        public void ValidSaleDate_WithCurrentDate_IsValid()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var today = DateTime.UtcNow;

            // Act
            var result = _attribute.GetValidationResult(today, context);

            // Assert
            Assert.Equal(ValidationResult.Success, result);
        }

        [Fact]
        public void ValidSaleDate_WithDateAtMinimumBoundary_IsValid()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var minDate = DateTime.UtcNow.Date.AddYears(-ValidationConstants.SaleDate.MaxYearsInPast);

            // Act
            var result = _attribute.GetValidationResult(minDate, context);

            // Assert
            Assert.Equal(ValidationResult.Success, result);
        }

        [Fact]
        public void ValidSaleDate_WithDateAtMaximumBoundary_IsValid()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var maxDate = DateTime.UtcNow.Date.AddDays(ValidationConstants.SaleDate.MaxDaysInFuture);

            // Act
            var result = _attribute.GetValidationResult(maxDate, context);

            // Assert
            Assert.Equal(ValidationResult.Success, result);
        }

        [Fact]
        public void ValidSaleDate_WithDateOneYearAgo_IsValid()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var oneYearAgo = DateTime.UtcNow.AddYears(-1);

            // Act
            var result = _attribute.GetValidationResult(oneYearAgo, context);

            // Assert
            Assert.Equal(ValidationResult.Success, result);
        }

        [Fact]
        public void ValidSaleDate_WithDateOneWeekInFuture_IsValid()
        {
            // Arrange
            var context = new ValidationContext(new object());
            var oneWeekFuture = DateTime.UtcNow.AddDays(7);

            // Act
            var result = _attribute.GetValidationResult(oneWeekFuture, context);

            // Assert
            Assert.Equal(ValidationResult.Success, result);
        }
    }
}
