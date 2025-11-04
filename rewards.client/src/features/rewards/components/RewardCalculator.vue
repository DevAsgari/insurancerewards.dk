<template>
  <div class="p-8 md:p-6">
    <div class="form-field-wrapper">
      <label class="form-label-custom">Reward Strategy</label>

      <CustomDropdown
        v-model="selectedStrategy"
        :options="strategyOptions"
        placeholder="Choose your calculation strategy"
        @change="handleStrategyChange"
      />
    </div>

    <button
      class="btn-accent w-full mt-6 flex items-center justify-center gap-2"
      @click="calculateRewards"
      :disabled="selectedStrategy === undefined">
      <PhMedal :size="xs" class="icon-white" weight="fill" />
      Calculate Rewards
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { RewardStrategy } from '@/features/rewards/types'
import { REWARD_STRATEGIES, STRATEGY_LABELS, STRATEGY_DESCRIPTIONS } from '@/features/rewards/constants'
import { CustomDropdown } from '@/shared/components'
import type { DropdownOption } from '@/shared/components'
import { PhMedal } from '@phosphor-icons/vue'
import { useIconSizes } from '@/shared/composables'

export default defineComponent({
  name: 'RewardCalculator',
  components: {
    CustomDropdown,
    PhMedal
  },
  emits: ['calculate', 'strategy-change'],
  setup(props, { emit }) {
    const { xs } = useIconSizes()
    const selectedStrategy = ref<RewardStrategy | undefined>(undefined)

    const strategyOptions = computed<DropdownOption[]>(() => {
      return Object.values(REWARD_STRATEGIES).map(strategy => ({
        value: strategy,
        label: STRATEGY_LABELS[strategy],
        description: STRATEGY_DESCRIPTIONS[strategy]
      }))
    })

    const handleStrategyChange = (strategy: string | number) => {
      emit('strategy-change', strategy as RewardStrategy)
    }

    const calculateRewards = () => {
      if (selectedStrategy.value !== undefined) {
        emit('calculate', selectedStrategy.value)
      }
    }

    return {
      xs,
      selectedStrategy,
      strategyOptions,
      handleStrategyChange,
      calculateRewards
    }
  }
})
</script>

<style scoped>
/* Custom styles for dropdown wrapper */
.form-field-wrapper {
  margin-bottom: 1.5rem;
}

.form-field-wrapper:last-child {
  margin-bottom: 0;
}

.form-label-custom {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}
</style>

