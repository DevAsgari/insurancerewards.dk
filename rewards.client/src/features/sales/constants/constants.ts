/**
 * Dropdown options for sales forms
 */

import type { DropdownOption } from '@/shared/components'

/**
 * Insurance type options for sale forms
 */
export const INSURANCE_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'Life Insurance', label: 'Life Insurance' },
  { value: 'Health Insurance', label: 'Health Insurance' },
  { value: 'Car Insurance', label: 'Car Insurance' },
  { value: 'Home Insurance', label: 'Home Insurance' }
]

/**
 * Customer satisfaction options (1-5 scale)
 */
export const SATISFACTION_OPTIONS: DropdownOption[] = [
  { value: 5, label: 'Very Satisfied ⭐⭐⭐⭐⭐'},
  { value: 4, label: 'Satisfied ⭐⭐⭐⭐' },
  { value: 3, label: 'Neutral ⭐⭐⭐' },
  { value: 2, label: 'Dissatisfied ⭐⭐' },
  { value: 1, label: 'Very Dissatisfied ⭐' }
]
