using System.ComponentModel.DataAnnotations;
using Rewards.Server.Validation;

namespace Rewards.Server.DTOs
{
    public class UpdateSalePriceAndSatisfactionDto
    {
        [Required(ErrorMessage = "Price is required")]
        [Range(
            ValidationConstants.Price.MinValue,
            ValidationConstants.Price.MaxValue,
            ErrorMessage = ValidationConstants.Price.MinErrorMessage)]
        public required decimal Price { get; set; }

        [Required(ErrorMessage = "Customer satisfaction is required")]
        [Range(
            ValidationConstants.CustomerSatisfaction.MinValue,
            ValidationConstants.CustomerSatisfaction.MaxValue,
            ErrorMessage = ValidationConstants.CustomerSatisfaction.RangeErrorMessage)]
        public required int CustomerSatisfaction { get; set; }
    }
}
