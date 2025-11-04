import { describe, it, expect } from 'vitest'
import { useConfirm } from '../useConfirm'

describe('useConfirm', () => {
  it('should initialize with default state', () => {
    const confirmDialog = useConfirm()

    expect(confirmDialog.state.value.visible).toBe(false)
    expect(confirmDialog.state.value.title).toBe('Confirm Action')
    expect(confirmDialog.state.value.message).toBe('')
    expect(confirmDialog.state.value.confirmText).toBe('Confirm')
    expect(confirmDialog.state.value.cancelText).toBe('Cancel')
    expect(confirmDialog.state.value.type).toBe('info')
    expect(confirmDialog.state.value.resolve).toBe(null)
  })

  it('should show confirm dialog with default options', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Are you sure?'
    })

    expect(confirmDialog.state.value.visible).toBe(true)
    expect(confirmDialog.state.value.message).toBe('Are you sure?')
    expect(confirmDialog.state.value.title).toBe('Confirm Action')
    expect(confirmDialog.state.value.confirmText).toBe('Confirm')
    expect(confirmDialog.state.value.cancelText).toBe('Cancel')
    expect(confirmDialog.state.value.type).toBe('info')

    confirmDialog.handleConfirm()
    const result = await promise
    expect(result).toBe(true)
  })

  it('should show confirm dialog with custom options', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      title: 'Delete Item',
      message: 'This action cannot be undone',
      confirmText: 'Delete',
      cancelText: 'Keep',
      type: 'danger'
    })

    expect(confirmDialog.state.value.visible).toBe(true)
    expect(confirmDialog.state.value.title).toBe('Delete Item')
    expect(confirmDialog.state.value.message).toBe('This action cannot be undone')
    expect(confirmDialog.state.value.confirmText).toBe('Delete')
    expect(confirmDialog.state.value.cancelText).toBe('Keep')
    expect(confirmDialog.state.value.type).toBe('danger')

    confirmDialog.handleConfirm()
    const result = await promise
    expect(result).toBe(true)
  })

  it('should resolve true when handleConfirm is called', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Proceed with action?'
    })

    confirmDialog.handleConfirm()
    const result = await promise

    expect(result).toBe(true)
    expect(confirmDialog.state.value.visible).toBe(false)
    expect(confirmDialog.state.value.resolve).toBe(null)
  })

  it('should resolve false when handleCancel is called', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Proceed with action?'
    })

    confirmDialog.handleCancel()
    const result = await promise

    expect(result).toBe(false)
    expect(confirmDialog.state.value.visible).toBe(false)
    expect(confirmDialog.state.value.resolve).toBe(null)
  })

  it('should handle warning type', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Are you sure?',
      type: 'warning'
    })

    expect(confirmDialog.state.value.type).toBe('warning')

    confirmDialog.handleConfirm()
    await promise
  })

  it('should hide dialog after confirmation', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Confirm this action?'
    })

    expect(confirmDialog.state.value.visible).toBe(true)

    confirmDialog.handleConfirm()
    await promise

    expect(confirmDialog.state.value.visible).toBe(false)
  })

  it('should hide dialog after cancellation', async () => {
    const confirmDialog = useConfirm()

    const promise = confirmDialog.confirm({
      message: 'Confirm this action?'
    })

    expect(confirmDialog.state.value.visible).toBe(true)

    confirmDialog.handleCancel()
    await promise

    expect(confirmDialog.state.value.visible).toBe(false)
  })

  it('should handle multiple sequential confirmations', async () => {
    const confirmDialog = useConfirm()

    // First confirmation
    const promise1 = confirmDialog.confirm({
      message: 'First confirmation'
    })
    expect(confirmDialog.state.value.message).toBe('First confirmation')

    confirmDialog.handleConfirm()
    const result1 = await promise1
    expect(result1).toBe(true)

    // Second confirmation
    const promise2 = confirmDialog.confirm({
      message: 'Second confirmation'
    })
    expect(confirmDialog.state.value.message).toBe('Second confirmation')

    confirmDialog.handleCancel()
    const result2 = await promise2
    expect(result2).toBe(false)
  })
})
