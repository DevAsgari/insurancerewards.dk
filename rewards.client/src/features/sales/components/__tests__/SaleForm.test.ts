import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SaleForm from '../SaleForm.vue'
import { CustomDropdown } from '@/shared/components'

describe('SaleForm', () => {
  it('should render form elements', () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    // Check for CustomDropdown components
    expect(wrapper.findAllComponents(CustomDropdown).length).toBeGreaterThanOrEqual(2)
    expect(wrapper.find('#price').exists()).toBe(true)
    expect(wrapper.find('#date').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should initialize with default values', () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const priceInput = wrapper.find('#price').element as HTMLInputElement
    const dateInput = wrapper.find('#date').element as HTMLInputElement

    expect(priceInput.value).toBe('0')
    expect(dateInput.value).toBeTruthy() // Should be today's date
  })

  it('should emit submit event with form data', async () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    // Set insurance type via CustomDropdown
    const dropdowns = wrapper.findAllComponents(CustomDropdown)
    const insuranceDropdown = dropdowns[0]
    await insuranceDropdown.vm.$emit('update:modelValue', 1)

    // Set satisfaction via CustomDropdown
    const satisfactionDropdown = dropdowns[1]
    await satisfactionDropdown.vm.$emit('update:modelValue', 5)

    await wrapper.find('#price').setValue('1000')
    await wrapper.find('#date').setValue('2024-01-01')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedData = wrapper.emitted('submit')?.[0][0] as any
    expect(emittedData.insuranceType).toBe(1)
    expect(emittedData.price).toBe(1000)
    expect(emittedData.satisfaction).toBe(5)
    expect(emittedData.date).toBe('2024-01-01')
  })

  it('should reset form after submission', async () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdowns = wrapper.findAllComponents(CustomDropdown)
    await dropdowns[0].vm.$emit('update:modelValue', 'Life Insurance')
    await dropdowns[1].vm.$emit('update:modelValue', 5)
    await wrapper.find('#price').setValue('1000')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // After submission, form should reset
    const priceInput = wrapper.find('#price').element as HTMLInputElement
    expect(priceInput.value).toBe('0')
  })

  it('should disable all inputs when disabled prop is true', () => {
    const wrapper = mount(SaleForm, {
      props: {
        disabled: true
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const priceInput = wrapper.find('#price').element as HTMLInputElement
    const dateInput = wrapper.find('#date').element as HTMLInputElement
    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement

    expect(priceInput.disabled).toBe(true)
    expect(dateInput.disabled).toBe(true)
    expect(submitButton.disabled).toBe(true)
  })

  it('should show "Submitting..." when disabled', () => {
    const wrapper = mount(SaleForm, {
      props: {
        disabled: true
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toBe('Submitting...')
  })

  it('should show "Register Sale" when not disabled', () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toBe('Register Sale')
  })

  it('should have all insurance type options', () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const insuranceDropdown = wrapper.findAllComponents(CustomDropdown)[0]
    const options = insuranceDropdown.props('options') as any[]

    const optionLabels = options.map(o => o.label)
    expect(optionLabels).toContain('Life Insurance')
    expect(optionLabels).toContain('Health Insurance')
    expect(optionLabels).toContain('Car Insurance')
    expect(optionLabels).toContain('Home Insurance')
  })

  it('should have all satisfaction level options', () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const satisfactionDropdown = wrapper.findAllComponents(CustomDropdown)[1]
    const options = satisfactionDropdown.props('options') as any[]

    expect(options.length).toBe(5)
    const optionValues = options.map(o => o.value)
    expect(optionValues).toContain(5)
    expect(optionValues).toContain(4)
    expect(optionValues).toContain(3)
    expect(optionValues).toContain(2)
    expect(optionValues).toContain(1)
  })

  it('should convert price to number', async () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdowns = wrapper.findAllComponents(CustomDropdown)
    await dropdowns[0].vm.$emit('update:modelValue', 'Life Insurance')
    await dropdowns[1].vm.$emit('update:modelValue', 4)
    await wrapper.find('#price').setValue('1500.50')
    await wrapper.find('#date').setValue('2024-01-01')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const emittedData = wrapper.emitted('submit')?.[0][0] as any
    expect(typeof emittedData.price).toBe('number')
    expect(emittedData.price).toBe(1500.5)
  })

  it('should convert satisfaction to number', async () => {
    const wrapper = mount(SaleForm, {
      global: {
        components: { CustomDropdown }
      }
    })

    const dropdowns = wrapper.findAllComponents(CustomDropdown)
    await dropdowns[0].vm.$emit('update:modelValue', 'Life Insurance')
    await dropdowns[1].vm.$emit('update:modelValue', 3)
    await wrapper.find('#price').setValue('1000')
    await wrapper.find('#date').setValue('2024-01-01')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const emittedData = wrapper.emitted('submit')?.[0][0] as any
    expect(typeof emittedData.satisfaction).toBe('number')
    expect(emittedData.satisfaction).toBe(3)
  })
})
