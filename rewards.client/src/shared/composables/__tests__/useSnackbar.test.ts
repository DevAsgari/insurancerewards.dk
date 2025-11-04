import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSnackbar } from '../useSnackbar'

describe('useSnackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should show snackbar with default settings', () => {
    const snackbar = useSnackbar()

    expect(snackbar.state.value.visible).toBe(false)

    snackbar.show('Test message')

    expect(snackbar.state.value.visible).toBe(true)
    expect(snackbar.state.value.message).toBe('Test message')
    expect(snackbar.state.value.type).toBe('info')
  })

  it('should show success snackbar', () => {
    const snackbar = useSnackbar()

    snackbar.success('Success message')

    expect(snackbar.state.value.visible).toBe(true)
    expect(snackbar.state.value.message).toBe('Success message')
    expect(snackbar.state.value.type).toBe('success')
  })

  it('should show error snackbar with longer duration', () => {
    const snackbar = useSnackbar()

    snackbar.error('Error message')

    expect(snackbar.state.value.visible).toBe(true)
    expect(snackbar.state.value.message).toBe('Error message')
    expect(snackbar.state.value.type).toBe('error')
  })

  it('should show warning snackbar', () => {
    const snackbar = useSnackbar()

    snackbar.warning('Warning message')

    expect(snackbar.state.value.visible).toBe(true)
    expect(snackbar.state.value.message).toBe('Warning message')
    expect(snackbar.state.value.type).toBe('warning')
  })

  it('should show info snackbar', () => {
    const snackbar = useSnackbar()

    snackbar.info('Info message')

    expect(snackbar.state.value.visible).toBe(true)
    expect(snackbar.state.value.message).toBe('Info message')
    expect(snackbar.state.value.type).toBe('info')
  })

  it('should auto-hide after default duration (4000ms)', () => {
    const snackbar = useSnackbar()

    snackbar.success('Auto-hide message')
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(3999)
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(1)
    expect(snackbar.state.value.visible).toBe(false)
  })

  it('should auto-hide after error duration (5000ms)', () => {
    const snackbar = useSnackbar()

    snackbar.error('Error message')
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(4999)
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(1)
    expect(snackbar.state.value.visible).toBe(false)
  })

  it('should allow manual hide', () => {
    const snackbar = useSnackbar()

    snackbar.show('Manual hide test')
    expect(snackbar.state.value.visible).toBe(true)

    snackbar.hide()
    expect(snackbar.state.value.visible).toBe(false)
  })

  it('should clear previous timeout when showing new message', () => {
    const snackbar = useSnackbar()

    snackbar.success('First message')
    expect(snackbar.state.value.message).toBe('First message')

    vi.advanceTimersByTime(2000)

    snackbar.success('Second message')
    expect(snackbar.state.value.message).toBe('Second message')
    expect(snackbar.state.value.visible).toBe(true)

    // Should still be visible after original 4000ms
    vi.advanceTimersByTime(2000)
    expect(snackbar.state.value.visible).toBe(true)

    // Should hide after new 4000ms total
    vi.advanceTimersByTime(2000)
    expect(snackbar.state.value.visible).toBe(false)
  })

  it('should support custom duration', () => {
    const snackbar = useSnackbar()

    snackbar.show('Custom duration', 'info', 1000)
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(999)
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(1)
    expect(snackbar.state.value.visible).toBe(false)
  })

  it('should not auto-hide when duration is 0', () => {
    const snackbar = useSnackbar()

    snackbar.show('Persistent message', 'info', 0)
    expect(snackbar.state.value.visible).toBe(true)

    vi.advanceTimersByTime(10000)
    expect(snackbar.state.value.visible).toBe(true)

    snackbar.hide()
    expect(snackbar.state.value.visible).toBe(false)
  })
})
