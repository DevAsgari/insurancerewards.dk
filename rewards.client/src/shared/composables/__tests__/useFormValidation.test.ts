import { describe, it, expect, beforeEach } from 'vitest'
import { useFormValidation } from '../useFormValidation'
import { ValidationConstants } from '@/utils'

describe('useFormValidation', () => {
  let validation: ReturnType<typeof useFormValidation>

  beforeEach(() => {
    validation = useFormValidation()
    validation.clearAllErrors()
  })

  describe('initialization', () => {
    it('should initialize with empty errors', () => {
      const { errors } = useFormValidation()
      expect(Object.keys(errors).length).toBe(0)
    })
  })

  describe('clearError', () => {
    it('should clear specific error', () => {
      validation.errors.price = 'Some error'
      validation.errors.satisfaction = 'Another error'

      validation.clearError('price')

      expect(validation.errors.price).toBeUndefined()
      expect(validation.errors.satisfaction).toBe('Another error')
    })
  })

  describe('clearAllErrors', () => {
    it('should clear all errors', () => {
      validation.errors.price = 'Error 1'
      validation.errors.satisfaction = 'Error 2'
      validation.errors.insuranceType = 'Error 3'
      validation.errors.date = 'Error 4'

      validation.clearAllErrors()

      expect(validation.errors.price).toBeUndefined()
      expect(validation.errors.satisfaction).toBeUndefined()
      expect(validation.errors.insuranceType).toBeUndefined()
      expect(validation.errors.date).toBeUndefined()
    })
  })

  describe('validateInsuranceType', () => {
    it('should validate valid insurance type', () => {
      const result = validation.validateInsuranceType('Life Insurance')

      expect(result).toBe(true)
      expect(validation.errors.insuranceType).toBeUndefined()
    })

    it('should reject empty string', () => {
      const result = validation.validateInsuranceType('')

      expect(result).toBe(false)
      expect(validation.errors.insuranceType).toBe(ValidationConstants.SaleType.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject whitespace-only string', () => {
      const result = validation.validateInsuranceType('   ')

      expect(result).toBe(false)
      expect(validation.errors.insuranceType).toBe(ValidationConstants.SaleType.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject string exceeding max length', () => {
      const longString = 'a'.repeat(101)
      const result = validation.validateInsuranceType(longString)

      expect(result).toBe(false)
      expect(validation.errors.insuranceType).toBe(ValidationConstants.SaleType.LENGTH_ERROR_MESSAGE)
    })

    it('should accept string at max length boundary', () => {
      const maxString = 'a'.repeat(100)
      const result = validation.validateInsuranceType(maxString)

      expect(result).toBe(true)
      expect(validation.errors.insuranceType).toBeUndefined()
    })

    it('should clear previous error on valid input', () => {
      validation.validateInsuranceType('')
      expect(validation.errors.insuranceType).toBeDefined()

      validation.validateInsuranceType('Life Insurance')
      expect(validation.errors.insuranceType).toBeUndefined()
    })
  })

  describe('validatePrice', () => {
    it('should validate valid price', () => {
      const result = validation.validatePrice(1000)

      expect(result).toBe(true)
      expect(validation.errors.price).toBeUndefined()
    })

    it('should reject null price', () => {
      const result = validation.validatePrice(null as any)

      expect(result).toBe(false)
      expect(validation.errors.price).toBe(ValidationConstants.Price.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject undefined price', () => {
      const result = validation.validatePrice(undefined as any)

      expect(result).toBe(false)
      expect(validation.errors.price).toBe(ValidationConstants.Price.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject price below minimum', () => {
      const result = validation.validatePrice(0.005)

      expect(result).toBe(false)
      expect(validation.errors.price).toBe(ValidationConstants.Price.MIN_ERROR_MESSAGE)
    })

    it('should accept price at minimum boundary', () => {
      const result = validation.validatePrice(ValidationConstants.Price.MIN_VALUE)

      expect(result).toBe(true)
      expect(validation.errors.price).toBeUndefined()
    })

    it('should reject price above maximum', () => {
      const result = validation.validatePrice(1_000_001)

      expect(result).toBe(false)
      expect(validation.errors.price).toBe(ValidationConstants.Price.MAX_ERROR_MESSAGE)
    })

    it('should accept price at maximum boundary', () => {
      const result = validation.validatePrice(ValidationConstants.Price.MAX_VALUE)

      expect(result).toBe(true)
      expect(validation.errors.price).toBeUndefined()
    })

    it('should clear previous error on valid input', () => {
      validation.validatePrice(-100)
      expect(validation.errors.price).toBeDefined()

      validation.validatePrice(100)
      expect(validation.errors.price).toBeUndefined()
    })
  })

  describe('validateSatisfaction', () => {
    it('should validate valid satisfaction', () => {
      const result = validation.validateSatisfaction(3)

      expect(result).toBe(true)
      expect(validation.errors.satisfaction).toBeUndefined()
    })

    it('should reject undefined satisfaction', () => {
      const result = validation.validateSatisfaction(undefined)

      expect(result).toBe(false)
      expect(validation.errors.satisfaction).toBe(ValidationConstants.CustomerSatisfaction.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject satisfaction below minimum', () => {
      const result = validation.validateSatisfaction(0)

      expect(result).toBe(false)
      expect(validation.errors.satisfaction).toBe(ValidationConstants.CustomerSatisfaction.RANGE_ERROR_MESSAGE)
    })

    it('should accept satisfaction at minimum boundary', () => {
      const result = validation.validateSatisfaction(ValidationConstants.CustomerSatisfaction.MIN_VALUE)

      expect(result).toBe(true)
      expect(validation.errors.satisfaction).toBeUndefined()
    })

    it('should reject satisfaction above maximum', () => {
      const result = validation.validateSatisfaction(6)

      expect(result).toBe(false)
      expect(validation.errors.satisfaction).toBe(ValidationConstants.CustomerSatisfaction.RANGE_ERROR_MESSAGE)
    })

    it('should accept satisfaction at maximum boundary', () => {
      const result = validation.validateSatisfaction(ValidationConstants.CustomerSatisfaction.MAX_VALUE)

      expect(result).toBe(true)
      expect(validation.errors.satisfaction).toBeUndefined()
    })

    it('should validate all valid values in range', () => {
      for (let i = 1; i <= 5; i++) {
        const result = validation.validateSatisfaction(i)
        expect(result).toBe(true)
      }
    })

    it('should clear previous error on valid input', () => {
      validation.validateSatisfaction(undefined)
      expect(validation.errors.satisfaction).toBeDefined()

      validation.validateSatisfaction(3)
      expect(validation.errors.satisfaction).toBeUndefined()
    })
  })

  describe('validateDate', () => {
    it('should validate today\'s date', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = validation.validateDate(today)

      expect(result).toBe(true)
      expect(validation.errors.date).toBeUndefined()
    })

    it('should reject empty date', () => {
      const result = validation.validateDate('')

      expect(result).toBe(false)
      expect(validation.errors.date).toBe(ValidationConstants.SaleDate.REQUIRED_ERROR_MESSAGE)
    })

    it('should reject date too far in past', () => {
      const tooOld = new Date()
      tooOld.setFullYear(tooOld.getFullYear() - 11)
      const dateString = tooOld.toISOString().split('T')[0]

      const result = validation.validateDate(dateString)

      expect(result).toBe(false)
      expect(validation.errors.date).toBe(ValidationConstants.SaleDate.TOO_OLD_ERROR_MESSAGE)
    })

    it('should accept date at past boundary', () => {
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      tenYearsAgo.setDate(tenYearsAgo.getDate() + 1) // Slightly after boundary
      const dateString = tenYearsAgo.toISOString().split('T')[0]

      const result = validation.validateDate(dateString)

      expect(result).toBe(true)
      expect(validation.errors.date).toBeUndefined()
    })

    it('should reject date too far in future', () => {
      const tooFuture = new Date()
      tooFuture.setDate(tooFuture.getDate() + 31)
      const dateString = tooFuture.toISOString().split('T')[0]

      const result = validation.validateDate(dateString)

      expect(result).toBe(false)
      expect(validation.errors.date).toBe(ValidationConstants.SaleDate.TOO_FAR_IN_FUTURE_ERROR_MESSAGE)
    })

    it('should accept date at future boundary', () => {
      const twentyNineDaysFromNow = new Date()
      twentyNineDaysFromNow.setDate(twentyNineDaysFromNow.getDate() + 29)
      const dateString = twentyNineDaysFromNow.toISOString().split('T')[0]

      const result = validation.validateDate(dateString)

      expect(result).toBe(true)
      expect(validation.errors.date).toBeUndefined()
    })

    it('should clear previous error on valid input', () => {
      validation.validateDate('')
      expect(validation.errors.date).toBeDefined()

      const today = new Date().toISOString().split('T')[0]
      validation.validateDate(today)
      expect(validation.errors.date).toBeUndefined()
    })
  })

  describe('validateForm', () => {
    it('should validate complete valid form', () => {
      const formData = {
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5 as number | undefined,
        date: new Date().toISOString().split('T')[0]
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(true)
      expect(Object.keys(validation.errors).length).toBe(0)
    })

    it('should reject form with invalid insuranceType', () => {
      const formData = {
        insuranceType: '',
        price: 1000,
        satisfaction: 5 as number | undefined,
        date: new Date().toISOString().split('T')[0]
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(false)
      expect(validation.errors.insuranceType).toBeDefined()
    })

    it('should reject form with invalid price', () => {
      const formData = {
        insuranceType: 'Life Insurance',
        price: -100,
        satisfaction: 5 as number | undefined,
        date: new Date().toISOString().split('T')[0]
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(false)
      expect(validation.errors.price).toBeDefined()
    })

    it('should reject form with invalid satisfaction', () => {
      const formData = {
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: undefined,
        date: new Date().toISOString().split('T')[0]
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(false)
      expect(validation.errors.satisfaction).toBeDefined()
    })

    it('should reject form with invalid date', () => {
      const formData = {
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5 as number | undefined,
        date: ''
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(false)
      expect(validation.errors.date).toBeDefined()
    })

    it('should collect multiple validation errors', () => {
      const formData = {
        insuranceType: '',
        price: -100,
        satisfaction: undefined,
        date: ''
      }

      const result = validation.validateForm(formData)

      expect(result).toBe(false)
      expect(validation.errors.insuranceType).toBeDefined()
      expect(validation.errors.price).toBeDefined()
      expect(validation.errors.satisfaction).toBeDefined()
      expect(validation.errors.date).toBeDefined()
    })

    it('should clear previous errors before validating', () => {
      // Set some errors manually
      validation.errors.price = 'Old error'

      const validFormData = {
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5 as number | undefined,
        date: new Date().toISOString().split('T')[0]
      }

      validation.validateForm(validFormData)

      expect(validation.errors.price).toBeUndefined()
    })
  })
})
