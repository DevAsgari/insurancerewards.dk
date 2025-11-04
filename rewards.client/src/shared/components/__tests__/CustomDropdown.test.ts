import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CustomDropdown from '../CustomDropdown.vue'
import type { DropdownOption } from '../types'

describe('CustomDropdown', () => {
  const mockOptions: DropdownOption[] = [
    { value: 1, label: 'Option 1', description: 'First option' },
    { value: 2, label: 'Option 2', description: 'Second option' },
    { value: 3, label: 'Option 3' }
  ]

  beforeEach(() => {
    // Clean up any event listeners
    document.removeEventListener('click', () => {})
  })

  it('should render with placeholder when no value selected', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        placeholder: 'Select an option'
      }
    })

    expect(wrapper.text()).toContain('Select an option')
  })

  it('should render with default placeholder', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    expect(wrapper.text()).toContain('Select an option')
  })

  it('should display selected option label', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        modelValue: 2
      }
    })

    expect(wrapper.text()).toContain('Option 2')
  })

  it('should open dropdown when clicked', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    const trigger = wrapper.find('.dropdown-trigger')
    await trigger.trigger('click')
    await flushPromises()

    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)
  })

  it('should render all options when open', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toContain('Option 1')
    expect(items[1].text()).toContain('Option 2')
    expect(items[2].text()).toContain('Option 3')
  })

  it('should render option descriptions when provided', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    expect(items[0].text()).toContain('First option')
    expect(items[1].text()).toContain('Second option')
  })

  it('should not render description when not provided', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const thirdItem = wrapper.findAll('.dropdown-item')[2]
    const paragraphs = thirdItem.findAll('p')
    expect(paragraphs).toHaveLength(0)
  })

  it('should emit update:modelValue when option is selected', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    await items[1].trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('should emit change event when option is selected', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    await items[0].trigger('click')
    await flushPromises()

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('should close dropdown after selecting option', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)

    const items = wrapper.findAll('.dropdown-item')
    await items[0].trigger('click')
    await flushPromises()

    expect(wrapper.find('.dropdown-menu').exists()).toBe(false)
  })

  it('should highlight selected option with active class', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        modelValue: 2
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    expect(items[1].classes()).toContain('dropdown-item-active')
    expect(items[0].classes()).not.toContain('dropdown-item-active')
    expect(items[2].classes()).not.toContain('dropdown-item-active')
  })

  it('should render caret icon', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should rotate caret icon when dropdown is open', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    const trigger = wrapper.find('.dropdown-trigger')
    const icon = wrapper.find('svg')

    // Initially not rotated
    expect(icon.classes()).not.toContain('rotate-180')

    // After clicking, should be rotated
    await trigger.trigger('click')
    await flushPromises()

    expect(icon.classes()).toContain('rotate-180')
  })

  it('should toggle dropdown on multiple clicks', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    const trigger = wrapper.find('.dropdown-trigger')

    // First click - open
    await trigger.trigger('click')
    await flushPromises()
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)

    // Second click - close
    await trigger.trigger('click')
    await flushPromises()
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false)

    // Third click - open again
    await trigger.trigger('click')
    await flushPromises()
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true)
  })

  it('should support string values', async () => {
    const stringOptions: DropdownOption[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]

    const wrapper = mount(CustomDropdown, {
      props: {
        options: stringOptions,
        modelValue: 'option1'
      }
    })

    expect(wrapper.text()).toContain('Option 1')

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    await items[1].trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['option2'])
  })

  it('should support number values', async () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        modelValue: 1
      }
    })

    expect(wrapper.text()).toContain('Option 1')

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    await items[2].trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('should be keyboard accessible with tabindex', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions
      }
    })

    const trigger = wrapper.find('.dropdown-trigger')
    expect(trigger.attributes('tabindex')).toBe('0')
  })

  it('should render correct number of options', async () => {
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `Option ${i + 1}`
    }))

    const wrapper = mount(CustomDropdown, {
      props: {
        options: manyOptions
      }
    })

    await wrapper.find('.dropdown-trigger').trigger('click')
    await flushPromises()

    const items = wrapper.findAll('.dropdown-item')
    expect(items).toHaveLength(10)
  })

  it('should handle empty options array', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: []
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Select an option')
  })

  it('should display correct label for selected value', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        modelValue: 3
      }
    })

    expect(wrapper.text()).toContain('Option 3')
    expect(wrapper.text()).not.toContain('Option 1')
    expect(wrapper.text()).not.toContain('Option 2')
  })

  it('should show placeholder when modelValue is undefined', () => {
    const wrapper = mount(CustomDropdown, {
      props: {
        options: mockOptions,
        modelValue: undefined,
        placeholder: 'Choose one'
      }
    })

    expect(wrapper.text()).toContain('Choose one')
  })
})
