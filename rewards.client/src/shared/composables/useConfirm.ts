import { ref } from 'vue'

export type ConfirmType = 'danger' | 'warning' | 'info'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
}

interface ConfirmState {
  visible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: ConfirmType
  resolve: ((value: boolean) => void) | null
}

const state = ref<ConfirmState>({
  visible: false,
  title: 'Confirm Action',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info',
  resolve: null
})

export function useConfirm() {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.value = {
        visible: true,
        title: options.title || 'Confirm Action',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'info',
        resolve
      }
    })
  }

  const handleConfirm = () => {
    if (state.value.resolve) {
      state.value.resolve(true)
    }
    state.value.visible = false
    state.value.resolve = null
  }

  const handleCancel = () => {
    if (state.value.resolve) {
      state.value.resolve(false)
    }
    state.value.visible = false
    state.value.resolve = null
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel
  }
}
