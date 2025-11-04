import { ref, computed } from 'vue'
import { salesApi } from '@/api'
import { useSnackbar } from '@/shared/composables'
import { getStrategyLabel } from '@/features/rewards/constants'
import type { Sale } from '@/features/sales/types'
import type { RewardStrategy } from '@/features/rewards/types'

/**
 * Composable for reward calculation functionality
 */
export function useRewardCalculation() {
  const snackbar = useSnackbar()

  const calculatedRewards = ref<Sale[]>([])
  const selectedStrategy = ref('Not selected')
  const loading = ref(false)

  const hasSales = computed(() => calculatedRewards.value.length > 0)

  const hasRewards = computed(() => {
    return calculatedRewards.value.some(
      sale => sale.rewardValue !== undefined && sale.rewardValue !== null
    )
  })

  const totalReward = computed(() => {
    return calculatedRewards.value.reduce((sum, sale) => {
      return sum + (sale.rewardValue || 0)
    }, 0)
  })

  /**
   * Calculate rewards using selected strategy
   */
  const calculateRewards = async (strategy: RewardStrategy) => {
    loading.value = true

    try {
      selectedStrategy.value = getStrategyLabel(strategy)

      const sales = await salesApi.calculateRewards(strategy)
      calculatedRewards.value = sales

      // Check if there are any sales
      if (sales && sales.length > 0) {
        snackbar.success('Your rewards are ready!')
      } else {
        snackbar.warning('No sales registered yet - add your first sale to earn rewards!')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate rewards'
      snackbar.error(errorMessage)
      console.error('Error calculating rewards:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Set sales data (from useSalesManagement for example)
   */
  const setSales = (sales: Sale[]) => {
    if (!sales || !Array.isArray(sales)) {
      console.warn('Invalid sales data provided to setSales')
      calculatedRewards.value = []
      return
    }
    calculatedRewards.value = sales
  }

  /**
   * Update specific sale in local state
   */
  const updateLocalSale = (saleId: string, updates: { price: number; customerSatisfaction: number }) => {
    if (!saleId || !updates) {
      console.warn('Invalid parameters provided to updateLocalSale')
      return
    }

    const index = calculatedRewards.value.findIndex(s => s.id === saleId)
    if (index !== -1 && calculatedRewards.value[index]) {
      calculatedRewards.value[index].price = updates.price
      calculatedRewards.value[index].customerSatisfaction = updates.customerSatisfaction
    }
  }

  /**
   * Remove sale from local state
   */
  const removeLocalSale = (saleId: string) => {
    if (!saleId) {
      console.warn('Invalid sale ID provided to removeLocalSale')
      return
    }
    calculatedRewards.value = calculatedRewards.value.filter(sale => sale.id !== saleId)
  }

  return {
    calculatedRewards,
    selectedStrategy,
    loading,
    hasSales,
    hasRewards,
    totalReward,
    calculateRewards,
    setSales,
    updateLocalSale,
    removeLocalSale
  }
}
