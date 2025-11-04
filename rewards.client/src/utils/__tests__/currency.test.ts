import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../currency'

describe('currency.ts', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers with 2 decimals', () => {
      expect(formatCurrency(1000)).toBe('1000.00')
      expect(formatCurrency(1234.56)).toBe('1234.56')
      expect(formatCurrency(0.99)).toBe('0.99')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('0.00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-100)).toBe('-100.00')
      expect(formatCurrency(-1234.56)).toBe('-1234.56')
    })

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(1234.567)).toBe('1234.57')
      expect(formatCurrency(1234.564)).toBe('1234.56')
      expect(formatCurrency(0.999)).toBe('1.00')
    })

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('0.01')
      expect(formatCurrency(0.001)).toBe('0.00')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(1000000)).toBe('1000000.00')
      expect(formatCurrency(999999.99)).toBe('999999.99')
    })

    it('should return "-" for undefined', () => {
      expect(formatCurrency(undefined)).toBe('-')
    })

    it('should return "-" for null', () => {
      expect(formatCurrency(null)).toBe('-')
    })

    it('should add trailing zeros if needed', () => {
      expect(formatCurrency(100)).toBe('100.00')
      expect(formatCurrency(50.5)).toBe('50.50')
    })

    it('should handle integer-like floats', () => {
      expect(formatCurrency(1234.0)).toBe('1234.00')
      expect(formatCurrency(5.0)).toBe('5.00')
    })
  })
})
