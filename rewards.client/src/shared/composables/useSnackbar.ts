import { ref } from 'vue'

export type SnackbarType = 'success' | 'error' | 'warning' | 'info'

interface SnackbarState {
  visible: boolean
  message: string
  type: SnackbarType
}

const DEFAULT_DURATION = 4000
const ERROR_DURATION = 5000

const state = ref<SnackbarState>({
  visible: false,
  message: '',
  type: 'info'
})

let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useSnackbar() {
  const show = (message: string, type: SnackbarType = 'info', duration = DEFAULT_DURATION) => {
    // Clear existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Show snackbar
    state.value = {
      visible: true,
      message,
      type
    }

    // Auto-hide after duration
    if (duration > 0) {
      timeoutId = window.setTimeout(() => {
        hide()
      }, duration)
    }
  }

  const hide = () => {
    state.value.visible = false
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const success = (message: string, duration = DEFAULT_DURATION) => {
    show(message, 'success', duration)
  }

  const error = (message: string, duration = ERROR_DURATION) => {
    show(message, 'error', duration)
  }

  const warning = (message: string, duration = DEFAULT_DURATION) => {
    show(message, 'warning', duration)
  }

  const info = (message: string, duration = DEFAULT_DURATION) => {
    show(message, 'info', duration)
  }

  return {
    state,
    show,
    hide,
    success,
    error,
    warning,
    info
  }
}
