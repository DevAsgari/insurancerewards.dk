<template>
  <Transition name="snackbar">
    <div
      v-if="visible"
      :class="[
        'snackbar',
        type === 'success' && 'snackbar-success',
        type === 'error' && 'snackbar-error',
        type === 'warning' && 'snackbar-warning',
        type === 'info' && 'snackbar-info'
      ]"
      role="alert">
      <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <PhCheck v-if="type === 'success'" :size="sm" weight="bold" />
        <PhXCircle v-else-if="type === 'error'" :size="sm" weight="bold" />
        <PhWarning v-else-if="type === 'warning'" :size="sm" weight="bold" />
        <PhInfo v-else :size="sm" weight="bold" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="m-0 text-sm md:text-md lg:text-base text-gray-800 break-words">{{ message }}</p>
      </div>
      <button class="icon-btn flex-shrink-0" @click="close" aria-label="Close">
        <PhX :size="xs" weight="bold" />
      </button>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
  import { PhCheck, PhXCircle, PhWarning, PhInfo, PhX } from '@phosphor-icons/vue'
  import { useIconSizes } from '@/shared/composables'

export default defineComponent({
  name: 'Snackbar',
  components: {
    PhCheck, PhXCircle, PhWarning, PhInfo, PhX
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'success' | 'error' | 'warning' | 'info',
      default: 'info'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { xs, sm } = useIconSizes()

    const close = () => {
      emit('close')
    }

    return {
      xs,
      sm,
      close
    }
  }
})
</script>

<style scoped>
/* Base snackbar styles */
.snackbar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--color-white);
  border-radius: 1rem;
  box-shadow: var(--shadow-dropdown);
  z-index: var(--z-notification);
  border-left: 4px solid;
}

/* Snackbar variants */
.snackbar-success {
  color: var(--color-success);
  border-left-color: var(--color-success);
}

.snackbar-error {
  color: var(--color-error);
  border-left-color: var(--color-error);
}

.snackbar-warning {
  color: var(--color-warning);
  border-left-color: var(--color-warning);
}

.snackbar-info {
  color: var(--color-info);
  border-left-color: var(--color-info);
}

/* Transitions */
.snackbar-enter-active,
.snackbar-leave-active {
  transition: opacity 0.3s var(--ease-smooth),
              transform 0.3s var(--ease-smooth);
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}
</style>
