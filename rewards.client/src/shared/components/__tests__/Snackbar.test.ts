import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Snackbar from '../Snackbar.vue'

describe('Snackbar', () => {
  it('should not render when visible is false', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: false,
        message: 'Test message'
      }
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('should render when visible is true', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Test message'
      }
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('should display message', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'This is a test message'
      }
    })

    expect(wrapper.find('p').text()).toBe('This is a test message')
  })

  it('should emit close when close button clicked', async () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Test message'
      }
    })

    await wrapper.find('button[aria-label="Close"]').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should apply success class', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Success!',
        type: 'success'
      }
    })

    const alertDiv = wrapper.find('[role="alert"]')
    expect(alertDiv.classes()).toContain('snackbar-success')
  })

  it('should apply error class', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Error!',
        type: 'error'
      }
    })

    const alertDiv = wrapper.find('[role="alert"]')
    expect(alertDiv.classes()).toContain('snackbar-error')
  })

  it('should apply warning class', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Warning!',
        type: 'warning'
      }
    })

    const alertDiv = wrapper.find('[role="alert"]')
    expect(alertDiv.classes()).toContain('snackbar-warning')
  })

  it('should apply info class by default', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Info'
      }
    })

    const alertDiv = wrapper.find('[role="alert"]')
    expect(alertDiv.classes()).toContain('snackbar-info')
  })

  it('should show success icon', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Success!',
        type: 'success'
      }
    })

    const icons = wrapper.findAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should show error icon', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Error!',
        type: 'error'
      }
    })

    const icons = wrapper.findAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should show warning icon', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Warning!',
        type: 'warning'
      }
    })

    const icons = wrapper.findAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should show info icon by default', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Info'
      }
    })

    const icons = wrapper.findAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should have role alert', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Test'
      }
    })

    expect(wrapper.find('[role="alert"]').attributes('role')).toBe('alert')
  })

  it('should have close button with aria-label', () => {
    const wrapper = mount(Snackbar, {
      props: {
        visible: true,
        message: 'Test'
      }
    })

    expect(wrapper.find('button[aria-label="Close"]').attributes('aria-label')).toBe('Close')
  })
})
