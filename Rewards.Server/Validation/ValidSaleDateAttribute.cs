using System.ComponentModel.DataAnnotations;

namespace Rewards.Server.Validation
{
    /// <summary>
    /// Custom validation attribute to ensure sale dates are within acceptable range.
    /// Validates that the date is not too far in the past or future.
    /// </summary>
    public class ValidSaleDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
            {
                return new ValidationResult(ValidationConstants.SaleDate.RequiredErrorMessage);
            }

            if (value is not DateTime saleDate)
            {
                return new ValidationResult("Invalid date format");
            }

            var today = DateTime.UtcNow.Date;
            var minDate = today.AddYears(-ValidationConstants.SaleDate.MaxYearsInPast);
            var maxDate = today.AddDays(ValidationConstants.SaleDate.MaxDaysInFuture);

            if (saleDate.Date < minDate)
            {
                return new ValidationResult(ValidationConstants.SaleDate.TooOldErrorMessage);
            }

            if (saleDate.Date > maxDate)
            {
                return new ValidationResult(ValidationConstants.SaleDate.TooFarInFutureErrorMessage);
            }

            return ValidationResult.Success;
        }
    }
}
