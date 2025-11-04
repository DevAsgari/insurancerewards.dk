import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('should render with custom message', () => {
    const wrapper = mount(EmptyState, {
      props: {
        message: 'No sales found'
      }
    })

    expect(wrapper.text()).toContain('No sales found')
  })

  it('should render with custom button text', () => {
    const wrapper = mount(EmptyState, {
      props: {
        buttonText: 'Create New Sale'
      }
    })

    expect(wrapper.find('button').text()).toBe('Create New Sale')
  })

  it('should hide button when showButton is false', () => {
    const wrapper = mount(EmptyState, {
      props: {
        showButton: false
      }
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('should emit action event when button is clicked', async () => {
    const wrapper = mount(EmptyState)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('action')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('should render with all custom props', () => {
    const wrapper = mount(EmptyState, {
      props: {
        message: 'Custom message',
        buttonText: 'Custom button',
        showButton: true
      }
    })

    expect(wrapper.text()).toContain('Custom message')
    expect(wrapper.find('button').text()).toBe('Custom button')
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
