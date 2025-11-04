import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EditSaleModal from '../EditSaleModal.vue'
import { CustomDropdown } from '@/shared/components'
import type { Sale } from '@/features/sales/types'

describe('EditSaleModal', () => {
  const mockSale: Sale = {
    id: '1',
    saleType: 'Life Insurance',
    price: 1000,
    customerSatisfaction: 5,
    saleDate: '2024-01-01',
    rewardValue: 100
  }

  it('should not render when visible is false', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: false,
        sale: null
      },
      global: {
        components: { CustomDropdown }
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('should render when visible is true', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Edit Sale')
  })

  it('should populate form with sale data', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const priceInput = wrapper.find('#edit-price').element as HTMLInputElement
    const satisfactionDropdown = wrapper.findComponent(CustomDropdown)

    expect(priceInput.value).toBe('1000')
    expect(satisfactionDropdown.props('modelValue')).toBe(5)
  })

  it('should emit submit event with updated data', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('#edit-price').setValue('1500')

    const satisfactionDropdown = wrapper.findComponent(CustomDropdown)
    await satisfactionDropdown.vm.$emit('update:modelValue', 4)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedData = wrapper.emitted('submit')?.[0][0] as any
    expect(emittedData.price).toBe(1500)
    expect(emittedData.customerSatisfaction).toBe(4)
  })

  it('should emit cancel when cancel button clicked', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit cancel when close button clicked', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const closeButton = wrapper.find('button[aria-label="Close"]')
    await closeButton.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit cancel when overlay is clicked', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('.fixed.inset-0').trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should not emit cancel when modal container is clicked', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('.bg-white.rounded-2xl').trigger('click')

    expect(wrapper.emitted('cancel')).toBeFalsy()
  })

  it('should disable submit button when form is invalid', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('#edit-price').setValue('0')
    await wrapper.find('#edit-price').trigger('blur')
    await flushPromises()

    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('should enable submit button when form is valid', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('#edit-price').setValue('1500')

    const satisfactionDropdown = wrapper.findComponent(CustomDropdown)
    await satisfactionDropdown.vm.$emit('update:modelValue', 4)
    await flushPromises()

    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  it('should disable inputs when loading', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale,
        loading: true
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const priceInput = wrapper.find('#edit-price').element as HTMLInputElement
    expect(priceInput.disabled).toBe(true)
  })

  it('should disable buttons when loading', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale,
        loading: true
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const cancelButton = wrapper.find('.btn-secondary').element as HTMLButtonElement
    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement

    expect(cancelButton.disabled).toBe(true)
    expect(submitButton.disabled).toBe(true)
  })

  it('should show "Saving..." when loading', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale,
        loading: true
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toBe('Saving...')
  })

  it('should show "Save Changes" when not loading', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale,
        loading: false
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toBe('Save Changes')
  })

  it('should have all satisfaction options', () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const satisfactionDropdown = wrapper.findComponent(CustomDropdown)
    const options = satisfactionDropdown.props('options') as any[]

    expect(options.length).toBe(5) // 5 satisfaction levels
    const optionValues = options.map(o => o.value)
    expect(optionValues).toContain(5)
    expect(optionValues).toContain(1)
  })

  it('should update form data when sale prop changes', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    const newSale: Sale = {
      ...mockSale,
      id: '2',
      price: 2000,
      customerSatisfaction: 3
    }

    await wrapper.setProps({ sale: newSale })
    await flushPromises()

    const priceInput = wrapper.find('#edit-price').element as HTMLInputElement
    const satisfactionDropdown = wrapper.findComponent(CustomDropdown)

    expect(priceInput.value).toBe('2000')
    expect(satisfactionDropdown.props('modelValue')).toBe(3)
  })

  it('should validate price is greater than 0', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: mockSale
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await wrapper.find('#edit-price').setValue('-100')
    await wrapper.find('#edit-price').trigger('blur')
    await flushPromises()

    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('should validate satisfaction is between 1 and 5', async () => {
    const wrapper = mount(EditSaleModal, {
      props: {
        visible: true,
        sale: {
          ...mockSale,
          customerSatisfaction: 0 // Invalid value
        }
      },
      global: {
        components: { CustomDropdown }
      }
    })

    await flushPromises()

    const submitButton = wrapper.find('button[type="submit"]').element as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })
})
