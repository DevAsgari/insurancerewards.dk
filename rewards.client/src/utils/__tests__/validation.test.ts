import { describe, it, expect } from 'vitest'
import { validateSaleData, validateSaleUpdate } from '../validation'

describe('validation.ts', () => {
  describe('validateSaleData', () => {
    it('should validate valid sale data', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject empty insurance type', () => {
      const result = validateSaleData({
        insuranceType: '   ',
        price: 1000,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Insurance type is required')
    })

    it('should reject negative price', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: -100,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be greater than 0')
    })

    it('should reject zero price', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 0,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be greater than 0')
    })

    it('should reject non-finite price', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: Infinity,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be a valid number')
    })

    it('should reject NaN price', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: NaN,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be a valid number')
    })

    it('should reject undefined satisfaction', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: undefined,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction is required')
    })

    it('should reject satisfaction below 1', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 0,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be between 1 and 5')
    })

    it('should reject satisfaction above 5', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 6,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be between 1 and 5')
    })

    it('should reject non-integer satisfaction', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 3.5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be a whole number')
    })

    it('should reject invalid date', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5,
        date: 'invalid-date'
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Sale date must be a valid date')
    })

    it('should accept data without insuranceType', () => {
      const result = validateSaleData({
        price: 1000,
        satisfaction: 5,
        date: '2024-01-01'
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should accept data without date', () => {
      const result = validateSaleData({
        insuranceType: 'Life Insurance',
        price: 1000,
        satisfaction: 5
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should collect multiple errors', () => {
      const result = validateSaleData({
        insuranceType: '   ',
        price: -100,
        satisfaction: undefined,
        date: 'invalid'
      })

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
      expect(result.errors).toContain('Insurance type is required')
      expect(result.errors).toContain('Price must be greater than 0')
      expect(result.errors).toContain('Customer satisfaction is required')
      expect(result.errors).toContain('Sale date must be a valid date')
    })
  })

  describe('validateSaleUpdate', () => {
    it('should validate valid update data', () => {
      const result = validateSaleUpdate({
        price: 1000,
        customerSatisfaction: 5
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject negative price', () => {
      const result = validateSaleUpdate({
        price: -100,
        customerSatisfaction: 5
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be greater than 0')
    })

    it('should reject zero price', () => {
      const result = validateSaleUpdate({
        price: 0,
        customerSatisfaction: 5
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be greater than 0')
    })

    it('should reject non-finite price', () => {
      const result = validateSaleUpdate({
        price: Infinity,
        customerSatisfaction: 5
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Price must be a valid number')
    })

    it('should reject customerSatisfaction below 1', () => {
      const result = validateSaleUpdate({
        price: 1000,
        customerSatisfaction: 0
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be between 1 and 5')
    })

    it('should reject customerSatisfaction above 5', () => {
      const result = validateSaleUpdate({
        price: 1000,
        customerSatisfaction: 6
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be between 1 and 5')
    })

    it('should reject non-integer customerSatisfaction', () => {
      const result = validateSaleUpdate({
        price: 1000,
        customerSatisfaction: 3.5
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Customer satisfaction must be a whole number')
    })

    it('should accept valid minimum values', () => {
      const result = validateSaleUpdate({
        price: 0.01,
        customerSatisfaction: 1
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should accept valid maximum values', () => {
      const result = validateSaleUpdate({
        price: 1000000,
        customerSatisfaction: 5
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should collect multiple errors', () => {
      const result = validateSaleUpdate({
        price: -100,
        customerSatisfaction: 10
      })

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBe(2)
      expect(result.errors).toContain('Price must be greater than 0')
      expect(result.errors).toContain('Customer satisfaction must be between 1 and 5')
    })
  })
})
