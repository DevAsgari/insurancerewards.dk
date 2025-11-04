import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('should not render when visible is false', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: false,
        message: 'Are you sure?'
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('should render when visible is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
  })

  it('should display title', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        title: 'Delete Item',
        message: 'Are you sure?'
      }
    })

    expect(wrapper.find('h3').text()).toBe('Delete Item')
  })

  it('should display default title', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    expect(wrapper.find('h3').text()).toBe('Confirm Action')
  })

  it('should display message', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'This action cannot be undone'
      }
    })

    expect(wrapper.find('p').text()).toBe('This action cannot be undone')
  })

  it('should display custom confirm text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        confirmText: 'Delete'
      }
    })

    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    expect(confirmButton.text()).toBe('Delete')
  })

  it('should display default confirm text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    expect(confirmButton.text()).toBe('Confirm')
  })

  it('should display custom cancel text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        cancelText: 'No'
      }
    })

    expect(wrapper.find('.btn-secondary').text()).toBe('No')
  })

  it('should display default cancel text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    expect(wrapper.find('.btn-secondary').text()).toBe('Cancel')
  })

  it('should emit confirm when confirm button clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    await confirmButton.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('should emit cancel when cancel button clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit cancel when overlay clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    await wrapper.find('.fixed.inset-0').trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should not emit cancel when modal container clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    await wrapper.find('.bg-white.rounded-2xl').trigger('click')

    expect(wrapper.emitted('cancel')).toBeFalsy()
  })

  it('should apply danger type class', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        type: 'danger'
      }
    })

    // Check for Tailwind classes on icon and button
    const iconDiv = wrapper.findAll('div').find(el => el.classes().includes('bg-red-100'))
    expect(iconDiv).toBeTruthy()
    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    expect(confirmButton.classes()).toContain('btn-danger')
  })

  it('should apply warning type class', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        type: 'warning'
      }
    })

    // Check for Tailwind classes on icon and button
    const iconDiv = wrapper.findAll('div').find(el => el.classes().includes('bg-yellow-100'))
    expect(iconDiv).toBeTruthy()
    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    expect(confirmButton.classes()).toContain('btn-warning')
  })

  it('should apply info type class by default', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?'
      }
    })

    // Check for Tailwind classes on icon and button
    const iconDiv = wrapper.findAll('div').find(el => el.classes().includes('bg-blue-100'))
    expect(iconDiv).toBeTruthy()
    const buttons = wrapper.findAll('button')
    const confirmButton = buttons[buttons.length - 1]
    expect(confirmButton.classes()).toContain('btn-info')
  })

  it('should show danger icon', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        type: 'danger'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should show warning icon', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        type: 'warning'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should show info icon', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        visible: true,
        message: 'Are you sure?',
        type: 'info'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
