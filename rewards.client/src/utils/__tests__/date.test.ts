import { describe, it, expect } from 'vitest'
import { formatDateISO, ISO_DATE_LOCALE } from '../date'

describe('date.ts', () => {
  describe('ISO_DATE_LOCALE', () => {
    it('should be set to sv-SE', () => {
      expect(ISO_DATE_LOCALE).toBe('sv-SE')
    })
  })

  describe('formatDateISO', () => {
    it('should format valid ISO date string', () => {
      const result = formatDateISO('2024-01-15')
      expect(result).toBe('2024-01-15')
    })

    it('should format ISO datetime string', () => {
      const result = formatDateISO('2024-01-15T10:30:00')
      expect(result).toBe('2024-01-15')
    })

    it('should format ISO datetime with timezone', () => {
      const result = formatDateISO('2024-01-15T10:30:00Z')
      expect(result).toBe('2024-01-15')
    })

    it('should format ISO datetime with milliseconds', () => {
      const result = formatDateISO('2024-01-15T10:30:00.123Z')
      expect(result).toBe('2024-01-15')
    })

    it('should handle dates with different months', () => {
      expect(formatDateISO('2024-03-05')).toBe('2024-03-05')
      expect(formatDateISO('2024-12-25')).toBe('2024-12-25')
    })

    it('should handle dates with different years', () => {
      expect(formatDateISO('2023-01-01')).toBe('2023-01-01')
      expect(formatDateISO('2025-12-31')).toBe('2025-12-31')
    })

    it('should return "-" for null', () => {
      const result = formatDateISO(null)
      expect(result).toBe('-')
    })

    it('should return "-" for undefined', () => {
      const result = formatDateISO(undefined)
      expect(result).toBe('-')
    })

    it('should return "-" for empty string', () => {
      const result = formatDateISO('')
      expect(result).toBe('-')
    })

    it('should return "-" for invalid date string', () => {
      const result = formatDateISO('invalid-date')
      expect(result).toBe('-')
    })

    it('should return "-" for malformed date', () => {
      const result = formatDateISO('2024-13-45')
      expect(result).toBe('-')
    })

    it('should handle edge case dates', () => {
      // Leap year
      expect(formatDateISO('2024-02-29')).toBe('2024-02-29')

      // First day of year
      expect(formatDateISO('2024-01-01')).toBe('2024-01-01')

      // Last day of year
      expect(formatDateISO('2024-12-31')).toBe('2024-12-31')
    })

    it('should format dates from past centuries', () => {
      const result = formatDateISO('1990-05-20')
      expect(result).toBe('1990-05-20')
    })

    it('should handle single-digit days and months correctly', () => {
      // Note: toLocaleDateString with sv-SE always outputs padded format
      expect(formatDateISO('2024-01-05')).toBe('2024-01-05')
      expect(formatDateISO('2024-03-09')).toBe('2024-03-09')
    })
  })
})
