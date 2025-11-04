/**
 * Validation utilities for form inputs
 */

/**
 * Centralized validation constants matching backend validation rules.
 * Ensures consistency between frontend and backend validation.
 */
export const ValidationConstants = {
  Price: {
    MIN_VALUE: 0.01,
    MAX_VALUE: 1_000_000.0,
    MIN_ERROR_MESSAGE: 'Price must be greater than 0',
    MAX_ERROR_MESSAGE: 'Price cannot exceed 1,000,000',
    REQUIRED_ERROR_MESSAGE: 'Price is required'
  },

  CustomerSatisfaction: {
    MIN_VALUE: 1,
    MAX_VALUE: 5,
    RANGE_ERROR_MESSAGE: 'Customer satisfaction must be between 1 and 5',
    REQUIRED_ERROR_MESSAGE: 'Customer satisfaction is required'
  },

  SaleType: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    LENGTH_ERROR_MESSAGE: 'Sale type must be between 1 and 100 characters',
    REQUIRED_ERROR_MESSAGE: 'Insurance type is required'
  },

  SaleDate: {
    MAX_YEARS_IN_PAST: 10,
    MAX_DAYS_IN_FUTURE: 30,
    REQUIRED_ERROR_MESSAGE: 'Sale date is required',
    TOO_OLD_ERROR_MESSAGE: 'Sale date cannot be more than 10 years in the past',
    TOO_FAR_IN_FUTURE_ERROR_MESSAGE: 'Sale date cannot be more than 30 days in the future'
  }
} as const

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate sale data before API submission
 */
export function validateSaleData(data: {
  insuranceType?: string
  price: number
  satisfaction: number | undefined
  date?: string
}): ValidationResult {
  const errors: string[] = []

  // Validate insurance type if provided
  if (data.insuranceType !== undefined && !data.insuranceType.trim()) {
    errors.push('Insurance type is required')
  }

  // Validate price
  if (data.price <= 0) {
    errors.push('Price must be greater than 0')
  }
  if (!Number.isFinite(data.price)) {
    errors.push('Price must be a valid number')
  }

  // Validate customer satisfaction
  if (data.satisfaction === undefined) {
    errors.push('Customer satisfaction is required')
  } else if (data.satisfaction < 1 || data.satisfaction > 5) {
    errors.push('Customer satisfaction must be between 1 and 5')
  }
  if (data.satisfaction !== undefined && !Number.isInteger(data.satisfaction)) {
    errors.push('Customer satisfaction must be a whole number')
  }

  // Validate date if provided
  if (data.date !== undefined) {
    const dateObj = new Date(data.date)
    if (isNaN(dateObj.getTime())) {
      errors.push('Sale date must be a valid date')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate sale update data (price and satisfaction only)
 */
export function validateSaleUpdate(data: {
  price: number
  customerSatisfaction: number
}): ValidationResult {
  const errors: string[] = []

  // Validate price
  if (data.price <= 0) {
    errors.push('Price must be greater than 0')
  }
  if (!Number.isFinite(data.price)) {
    errors.push('Price must be a valid number')
  }

  // Validate customer satisfaction
  if (data.customerSatisfaction < 1 || data.customerSatisfaction > 5) {
    errors.push('Customer satisfaction must be between 1 and 5')
  }
  if (!Number.isInteger(data.customerSatisfaction)) {
    errors.push('Customer satisfaction must be a whole number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
