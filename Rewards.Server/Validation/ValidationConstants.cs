namespace Rewards.Server.Validation
{
    /// <summary>
    /// Centralized validation constants for business rules across the application.
    /// Prevents magic numbers and ensures consistency between validation attributes and logic.
    /// </summary>
    public static class ValidationConstants
    {
        public static class Price
        {
            /// <summary>
            /// Minimum price for any insurance sale (must be greater than zero)
            /// </summary>
            public const double MinValue = 0.01;

            /// <summary>
            /// Maximum price for any insurance sale (reasonable upper limit)
            /// </summary>
            public const double MaxValue = 1_000_000.00;

            public const string MinErrorMessage = "Price must be greater than 0";
            public const string MaxErrorMessage = "Price cannot exceed 1,000,000";
        }

        public static class CustomerSatisfaction
        {
            /// <summary>
            /// Minimum satisfaction rating (1 star)
            /// </summary>
            public const int MinValue = 1;

            /// <summary>
            /// Maximum satisfaction rating (5 stars)
            /// </summary>
            public const int MaxValue = 5;

            public const string RangeErrorMessage = "Customer satisfaction must be between 1 and 5";
        }

        public static class SaleType
        {
            /// <summary>
            /// Minimum length for sale type/insurance type
            /// </summary>
            public const int MinLength = 1;

            /// <summary>
            /// Maximum length for sale type/insurance type
            /// </summary>
            public const int MaxLength = 100;

            public const string RequiredErrorMessage = "Sale type is required";
            public const string LengthErrorMessage = "Sale type must be between 1 and 100 characters";
        }

        public static class SaleDate
        {
            /// <summary>
            /// Maximum number of years in the past a sale date can be
            /// </summary>
            public const int MaxYearsInPast = 10;

            /// <summary>
            /// Maximum number of days in the future a sale date can be (allows for some scheduling)
            /// </summary>
            public const int MaxDaysInFuture = 30;

            public const string RequiredErrorMessage = "Sale date is required";
            public const string TooOldErrorMessage = "Sale date cannot be more than 10 years in the past";
            public const string TooFarInFutureErrorMessage = "Sale date cannot be more than 30 days in the future";
        }
    }
}
