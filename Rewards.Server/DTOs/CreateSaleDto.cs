using System.ComponentModel.DataAnnotations;
using Rewards.Server.Validation;

namespace Rewards.Server.DTOs
{
    public class CreateSaleDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Insurance type is required")]
        [Range(1, int.MaxValue, ErrorMessage = "InsuranceTypeId must be a valid ID")]
        public int InsuranceTypeId { get; set; }

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
