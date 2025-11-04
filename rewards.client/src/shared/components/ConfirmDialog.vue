<template>
  <Transition name="modal">
    <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style="z-index: var(--z-index-modal-backdrop)" @click="handleCancel">
      <div class="bg-white rounded-2xl max-w-[500px] w-full shadow-xl" @click.stop>
        <div class="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">{{ title }}</h3>
          <button class="icon-btn" @click="handleCancel" aria-label="Close">
            <PhX :size="xs" />
          </button>
        </div>

        <div class="p-8">
          <div class="flex items-start gap-4">
            <div :class="[
                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                type === 'danger' && 'bg-red-100 text-red-600',
                type === 'warning' && 'bg-yellow-100 text-yellow-600',
                type === 'info' && 'bg-blue-100 text-blue-600'
              ]">
              <PhWarningCircle v-if="type === 'danger'" :size="md" />
              <PhWarning v-else-if="type === 'warning'" :size="md" />
              <PhInfo v-else :size="md" />
            </div>
            <div class="flex-1">
              <p class="text-base text-gray-700 leading-relaxed m-0">{{ message }}</p>
            </div>
          </div>

          <div class="flex gap-4 mt-8">
            <button
              type="button"
              class="btn-secondary flex-1"
              @click="handleCancel">
              {{ cancelText }}
            </button>
            <button
              type="button"
              :class="[
                'flex-1',
                type === 'danger' && 'btn-danger',
                type === 'warning' && 'btn-warning',
                type === 'info' && 'btn-info'
              ]"
              @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { PhWarningCircle, PhWarning, PhInfo, PhX } from "@phosphor-icons/vue"
  import { useIconSizes } from '@/shared/composables'

export default defineComponent({
  name: 'ConfirmDialog',
  components: {
    PhWarningCircle,
    PhWarning,
    PhInfo,
    PhX
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    type: {
      type: String as () => 'danger' | 'warning' | 'info',
      default: 'info'
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const { xs, md } = useIconSizes()

    const handleConfirm = () => {
      emit('confirm')
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return {
      xs,
      md,
      handleConfirm,
      handleCancel
    }
  }
})
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-enter-active > div {
  transition: all 0.3s var(--ease-smooth);
}

.modal-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>

