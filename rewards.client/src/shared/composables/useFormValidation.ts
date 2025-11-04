import { reactive } from 'vue'
import { ValidationConstants } from '@/utils'
import type { SaleFormData } from '@/features/sales/types'

export interface ValidationErrors {
  insuranceType?: string
  price?: string
  satisfaction?: string
  date?: string
}

export function useFormValidation() {
  const errors = reactive<ValidationErrors>({})

  const clearError = (field: keyof ValidationErrors) => {
    delete errors[field]
  }

  const clearAllErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof ValidationErrors]
    })
  }

  const validateInsuranceType = (value: string): boolean => {
    clearError('insuranceType')

    if (!value || value.trim().length === 0) {
      errors.insuranceType = ValidationConstants.SaleType.REQUIRED_ERROR_MESSAGE
      return false
    }

    if (
      value.length < ValidationConstants.SaleType.MIN_LENGTH ||
      value.length > ValidationConstants.SaleType.MAX_LENGTH
    ) {
      errors.insuranceType = ValidationConstants.SaleType.LENGTH_ERROR_MESSAGE
      return false
    }

    return true
  }

  const validatePrice = (value: number): boolean => {
    clearError('price')

    if (value === null || value === undefined) {
      errors.price = ValidationConstants.Price.REQUIRED_ERROR_MESSAGE
      return false
    }

    if (value < ValidationConstants.Price.MIN_VALUE) {
      errors.price = ValidationConstants.Price.MIN_ERROR_MESSAGE
      return false
    }

    if (value > ValidationConstants.Price.MAX_VALUE) {
      errors.price = ValidationConstants.Price.MAX_ERROR_MESSAGE
      return false
    }

    return true
  }

  const validateSatisfaction = (value: number | undefined): boolean => {
    clearError('satisfaction')

    if (value === undefined) {
      errors.satisfaction = ValidationConstants.CustomerSatisfaction.REQUIRED_ERROR_MESSAGE
      return false
    }

    if (
      value < ValidationConstants.CustomerSatisfaction.MIN_VALUE ||
      value > ValidationConstants.CustomerSatisfaction.MAX_VALUE
    ) {
      errors.satisfaction = ValidationConstants.CustomerSatisfaction.RANGE_ERROR_MESSAGE
      return false
    }

    return true
  }

  const validateDate = (value: string): boolean => {
    clearError('date')

    if (!value) {
      errors.date = ValidationConstants.SaleDate.REQUIRED_ERROR_MESSAGE
      return false
    }

    const saleDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const minDate = new Date(today)
    minDate.setFullYear(today.getFullYear() - ValidationConstants.SaleDate.MAX_YEARS_IN_PAST)

    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + ValidationConstants.SaleDate.MAX_DAYS_IN_FUTURE)

    if (saleDate < minDate) {
      errors.date = ValidationConstants.SaleDate.TOO_OLD_ERROR_MESSAGE
      return false
    }

    if (saleDate > maxDate) {
      errors.date = ValidationConstants.SaleDate.TOO_FAR_IN_FUTURE_ERROR_MESSAGE
      return false
    }

    return true
  }

  const validateForm = (formData: SaleFormData): boolean => {
    clearAllErrors()

    const isInsuranceTypeValid = validateInsuranceType(formData.insuranceType)
    const isPriceValid = validatePrice(formData.price)
    const isSatisfactionValid = validateSatisfaction(formData.satisfaction)
    const isDateValid = validateDate(formData.date)

    return isInsuranceTypeValid && isPriceValid && isSatisfactionValid && isDateValid
  }

  return {
    errors,
    clearError,
    clearAllErrors,
    validateInsuranceType,
    validatePrice,
    validateSatisfaction,
    validateDate,
    validateForm
  }
}
