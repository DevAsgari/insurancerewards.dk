/**
 * Currency formatting utilities
 */

/**
 * Format number as currency with 2 decimal places
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return '-'
  }
  return amount.toFixed(2)
}
