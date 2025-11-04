import type { RewardStrategy } from '@/features/rewards/types'

/**
 * Reward strategy enum values
 */
export const REWARD_STRATEGIES = {
  CUSTOMER_SATISFACTION: 0 as RewardStrategy,
  SALES_PRICE: 1 as RewardStrategy,
  COMBINED: 2 as RewardStrategy,
  ADJUSTED: 3 as RewardStrategy
} as const

/**
 * Human-readable labels for reward strategies
 */
export const STRATEGY_LABELS: Record<RewardStrategy, string> = {
  0: 'Customer Satisfaction',
  1: 'Sales Amount',
  2: 'Combined Strategy',
  3: 'Adjusted'
} as const

/**
 * Descriptions for reward strategies showing the calculation formula
 */
export const STRATEGY_DESCRIPTIONS: Record<RewardStrategy, string> = {
  0: '5% × satisfaction',
  1: '7% × price',
  2: '4% × price + 1% × satisfaction',
  3: 'Third-party adjusted calculation'
} as const

/**
 * Helper function to get strategy label
 */
export function getStrategyLabel(strategy: RewardStrategy): string {
  return STRATEGY_LABELS[strategy]
}
