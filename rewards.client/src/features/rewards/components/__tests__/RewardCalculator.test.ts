import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RewardCalculator from '../RewardCalculator.vue'
import { CustomDropdown } from '@/shared/components'

describe('RewardCalculator', () => {
  it('should render select dropdown', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    expect(wrapper.findComponent(CustomDropdown).exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Reward Strategy')
  })

  it('should have 4 strategy options plus default', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    const options = dropdown.props('options') as any[]
    expect(options).toHaveLength(4) // 4 strategies (0, 1, 2, 3)
  })

  it('should render strategy options with correct values', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    const options = dropdown.props('options') as any[]

    expect(options[0].value).toBe(0)
    expect(options[1].value).toBe(1)
    expect(options[2].value).toBe(2)
    expect(options[3].value).toBe(3)
  })

  it('should render strategy options with correct labels', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    const options = dropdown.props('options') as any[]

    expect(options[0].label).toBe('Customer Satisfaction')
    expect(options[1].label).toBe('Sales Amount')
    expect(options[2].label).toBe('Combined Strategy')
    expect(options[3].label).toBe('Adjusted')
  })

  it('should have calculate button disabled by default', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should enable calculate button when strategy is selected', async () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    await dropdown.vm.$emit('update:modelValue', 0)
    await flushPromises()

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('should emit calculate event with correct value when button is clicked', async () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    await dropdown.vm.$emit('update:modelValue', 0)
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.emitted()).toHaveProperty('calculate')
    expect(wrapper.emitted('calculate')).toHaveLength(1)
    expect(wrapper.emitted('calculate')![0]).toEqual([0])
  })

  it('should emit strategy-change event when selection changes', async () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)
    await dropdown.vm.$emit('change', 2)
    await flushPromises()

    expect(wrapper.emitted()).toHaveProperty('strategy-change')
    expect(wrapper.emitted('strategy-change')).toHaveLength(1)
    expect(wrapper.emitted('strategy-change')![0]).toEqual([2])
  })

  it('should emit correct strategy value for each option', async () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdown = wrapper.findComponent(CustomDropdown)

    // Test strategy 0
    await dropdown.vm.$emit('update:modelValue', 0)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('calculate')![0]).toEqual([0])

    // Test strategy 1
    await dropdown.vm.$emit('update:modelValue', 1)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('calculate')![1]).toEqual([1])

    // Test strategy 2
    await dropdown.vm.$emit('update:modelValue', 2)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('calculate')![2]).toEqual([2])

    // Test strategy 3
    await dropdown.vm.$emit('update:modelValue', 3)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('calculate')![3]).toEqual([3])
  })

  it('should render calculate button with SVG icon', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    expect(wrapper.find('button svg').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Calculate Rewards')
  })

  it('should have correct structure and styling', () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    // Check for proper structure with utility classes
    expect(wrapper.find('.form-field-wrapper').exists()).toBe(true)
    expect(wrapper.find('.form-label-custom').exists()).toBe(true)

    // Check button has accent styling
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('btn-accent')
  })

  it('should not emit calculate event when button is disabled', async () => {
    const wrapper = mount(RewardCalculator, {
      global: {
        components: { CustomDropdown }
      }
    })

    // Button is disabled by default (no strategy selected)
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('calculate')).toBeUndefined()
  })
})
