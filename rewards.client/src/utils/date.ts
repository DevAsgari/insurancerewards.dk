/**
 * Date formatting utilities
 */

/**
 * ISO 8601 date format (YYYY-MM-DD)
 * Uses Swedish locale as it reliably produces ISO format
 */
export const ISO_DATE_LOCALE = 'sv-SE'

/**
 * Format date as ISO 8601 (YYYY-MM-DD)
 * Returns '-' for null, undefined, or invalid dates
 */
export function formatDateISO(dateString: string | null | undefined): string {
  if (!dateString) return '-'

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString(ISO_DATE_LOCALE)
}
