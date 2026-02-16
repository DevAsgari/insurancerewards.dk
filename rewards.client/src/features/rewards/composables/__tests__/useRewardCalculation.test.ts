import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRewardCalculation } from '../useRewardCalculation'
import type { Sale } from '@/features/sales/types'
import type { RewardStrategy } from '@/features/rewards/types'
import { REWARD_STRATEGIES } from '@/features/rewards/constants'

// Create mock objects
const mockSnackbar = {
  success: vi.fn(),
  error: vi.fn()
}

// Mock dependencies
vi.mock('@/api', () => ({
  salesApi: {
    calculateRewards: vi.fn()
  }
}))

vi.mock('@/shared/composables', () => ({
  useSnackbar: () => mockSnackbar
}))

vi.mock('@/features/rewards/constants', () => ({
  REWARD_STRATEGIES: {
    CUSTOMER_SATISFACTION: 0,
    SALES_PRICE: 1,
    COMBINED: 2,
    ADJUSTED: 3
  },
  getStrategyLabel: vi.fn((strategy: RewardStrategy) => {
    const labels = {
      0: 'Customer Satisfaction',
      1: 'Sales Amount',
      2: 'Combined Strategy',
      3: 'Adjusted'
    }
    return labels[strategy]
  })
}))

import { salesApi } from '@/api'

describe('useRewardCalculation', () => {
  const mockSales: Sale[] = [
    {
      id: '1',
      insuranceTypeId: 1,
      insuranceTypeName: 'Life Insurance',
      price: 1000,
      customerSatisfaction: 5,
      saleDate: '2024-01-01',
      rewardValue: 100
    },
    {
      id: '2',
      insuranceTypeId: 2,
      insuranceTypeName: 'Health Insurance',
      price: 2000,
      customerSatisfaction: 4,
      saleDate: '2024-01-02',
      rewardValue: 200
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockSnackbar.success.mockClear()
    mockSnackbar.error.mockClear()
  })

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { calculatedRewards, selectedStrategy, loading, hasSales, hasRewards, totalReward } = useRewardCalculation()

      expect(calculatedRewards.value).toEqual([])
      expect(selectedStrategy.value).toBe('Not selected')
      expect(loading.value).toBe(false)
      expect(hasSales.value).toBe(false)
      expect(hasRewards.value).toBe(false)
      expect(totalReward.value).toBe(0)
    })
  })

  describe('calculateRewards', () => {
    it('should calculate rewards successfully', async () => {
      vi.mocked(salesApi.calculateRewards).mockResolvedValue(mockSales)

      const { calculateRewards, calculatedRewards, selectedStrategy, hasSales, hasRewards, totalReward } = useRewardCalculation()

      await calculateRewards(REWARD_STRATEGIES.CUSTOMER_SATISFACTION)

      expect(salesApi.calculateRewards).toHaveBeenCalledWith(REWARD_STRATEGIES.CUSTOMER_SATISFACTION)
      expect(calculatedRewards.value).toEqual(mockSales)
      expect(selectedStrategy.value).toBe('Customer Satisfaction')
      expect(hasSales.value).toBe(true)
      expect(hasRewards.value).toBe(true)
      expect(totalReward.value).toBe(300)
      expect(mockSnackbar.success).toHaveBeenCalledWith('Your rewards are ready!')
    })

    it('should handle calculate error', async () => {
      const error = new Error('Calculation failed')
      vi.mocked(salesApi.calculateRewards).mockRejectedValue(error)

      const { calculateRewards, calculatedRewards } = useRewardCalculation()

      await calculateRewards(REWARD_STRATEGIES.SALES_PRICE)

      expect(calculatedRewards.value).toEqual([])
      expect(mockSnackbar.error).toHaveBeenCalledWith('Failed to calculate rewards')
    })

    it('should update strategy label for different strategies', async () => {
      vi.mocked(salesApi.calculateRewards).mockResolvedValue(mockSales)

      const { calculateRewards, selectedStrategy } = useRewardCalculation()

      await calculateRewards(REWARD_STRATEGIES.SALES_PRICE)
      expect(selectedStrategy.value).toBe('Sales Amount')

      await calculateRewards(REWARD_STRATEGIES.COMBINED)
      expect(selectedStrategy.value).toBe('Combined Strategy')
    })
  })

  describe('setSales', () => {
    it('should set sales data', () => {
      const { setSales, calculatedRewards, hasSales } = useRewardCalculation()

      setSales(mockSales)

      expect(calculatedRewards.value).toEqual(mockSales)
      expect(hasSales.value).toBe(true)
    })
  })

  describe('updateLocalSale', () => {
    it('should update specific sale', () => {
      const { setSales, updateLocalSale, calculatedRewards } = useRewardCalculation()

      const salesCopy = JSON.parse(JSON.stringify(mockSales))
      setSales(salesCopy)

      updateLocalSale('1', { price: 1500, customerSatisfaction: 3 })

      expect(calculatedRewards.value[0].price).toBe(1500)
      expect(calculatedRewards.value[0].customerSatisfaction).toBe(3)
      expect(calculatedRewards.value[1].price).toBe(2000) // unchanged
    })

    it('should not update if sale not found', () => {
      const { setSales, updateLocalSale, calculatedRewards } = useRewardCalculation()

      const salesCopy = JSON.parse(JSON.stringify(mockSales))
      setSales(salesCopy)

      const originalPrices = calculatedRewards.value.map(s => s.price)

      updateLocalSale('999', { price: 1500, customerSatisfaction: 3 })

      expect(calculatedRewards.value[0].price).toBe(originalPrices[0]) // unchanged
      expect(calculatedRewards.value[1].price).toBe(originalPrices[1]) // unchanged
    })
  })

  describe('removeLocalSale', () => {
    it('should remove sale from local state', () => {
      const { setSales, removeLocalSale, calculatedRewards } = useRewardCalculation()

      setSales(mockSales)
      expect(calculatedRewards.value.length).toBe(2)

      removeLocalSale('1')

      expect(calculatedRewards.value.length).toBe(1)
      expect(calculatedRewards.value[0].id).toBe('2')
    })

    it('should not change state if sale not found', () => {
      const { setSales, removeLocalSale, calculatedRewards } = useRewardCalculation()

      setSales(mockSales)

      removeLocalSale('999')

      expect(calculatedRewards.value.length).toBe(2)
    })
  })

  describe('computed properties', () => {
    it('hasSales should be true when sales exist', () => {
      const { setSales, hasSales } = useRewardCalculation()

      expect(hasSales.value).toBe(false)

      setSales(mockSales)

      expect(hasSales.value).toBe(true)
    })

    it('hasRewards should be true when rewards exist', () => {
      const { setSales, hasRewards } = useRewardCalculation()

      expect(hasRewards.value).toBe(false)

      setSales(mockSales)

      expect(hasRewards.value).toBe(true)
    })

    it('hasRewards should be false when no rewards', () => {
      const salesWithoutRewards = mockSales.map(s => ({ ...s, rewardValue: undefined }))
      const { setSales, hasRewards } = useRewardCalculation()

      setSales(salesWithoutRewards)

      expect(hasRewards.value).toBe(false)
    })

    it('totalReward should sum all rewards', () => {
      const { setSales, totalReward } = useRewardCalculation()

      setSales(mockSales)

      expect(totalReward.value).toBe(300)
    })

    it('totalReward should handle undefined rewards', () => {
      const salesWithMixedRewards: Sale[] = [
        { ...mockSales[0], rewardValue: 100 },
        { ...mockSales[1], rewardValue: undefined }
      ]
      const { setSales, totalReward } = useRewardCalculation()

      setSales(salesWithMixedRewards)

      expect(totalReward.value).toBe(100)
    })
  })
})
