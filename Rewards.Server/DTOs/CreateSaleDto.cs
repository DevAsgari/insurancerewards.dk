using System.ComponentModel.DataAnnotations;
using Rewards.Server.Validation;

namespace Rewards.Server.DTOs
{
    public class CreateSaleDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = ValidationConstants.SaleType.RequiredErrorMessage)]
        [StringLength(
            ValidationConstants.SaleType.MaxLength,
            MinimumLength = ValidationConstants.SaleType.MinLength,
            ErrorMessage = ValidationConstants.SaleType.LengthErrorMessage)]
        public string SaleType { get; set; } = string.Empty;

        [Range(
            ValidationConstants.Price.MinValue,
            ValidationConstants.Price.MaxValue,
            ErrorMessage = ValidationConstants.Price.MinErrorMessage)]
        public decimal Price { get; set; }

        [Required(ErrorMessage = ValidationConstants.SaleDate.RequiredErrorMessage)]
        [ValidSaleDate]
        public DateTime SaleDate { get; set; }

        [Range(
            ValidationConstants.CustomerSatisfaction.MinValue,
            ValidationConstants.CustomerSatisfaction.MaxValue,
            ErrorMessage = ValidationConstants.CustomerSatisfaction.RangeErrorMessage)]
        public int CustomerSatisfaction { get; set; }
    }
}
