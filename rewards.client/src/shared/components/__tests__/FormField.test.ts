import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from '../FormField.vue'

describe('FormField', () => {
  describe('Basic Rendering', () => {
    it('should render input element by default', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(false)
    })

    it('should render textarea when type is textarea', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(false)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          label: 'Username'
        }
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Username')
    })

    it('should not render label when not provided', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })
  })

  describe('Input Types', () => {
    it('should render text input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'text'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should render number input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('should render date input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'date'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('date')
    })

    it('should render email input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'email'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('email')
    })

    it('should render password input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'password'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('should render tel input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'tel'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('tel')
    })

    it('should render url input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'url'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('url')
    })
  })

  describe('v-model Binding', () => {
    it('should display initial modelValue', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 'Initial value'
        }
      })

      const input = wrapper.find('input').element as HTMLInputElement
      expect(input.value).toBe('Initial value')
    })

    it('should emit update:modelValue when input changes', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue('New value')

      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New value'])
    })

    it('should update when modelValue prop changes', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 'Initial'
        }
      })

      await wrapper.setProps({ modelValue: 'Updated' })

      const input = wrapper.find('input').element as HTMLInputElement
      expect(input.value).toBe('Updated')
    })

    it('should work with textarea', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('Textarea content')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Textarea content'])
    })
  })

  describe('Number Type Conversion', () => {
    it('should convert input to number for number type', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('42')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([42])
    })

    it('should convert decimal input to float', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('3.14')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3.14])
    })

    it('should handle empty string for number input', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('')

      // Empty string should not be converted
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })
  })

  describe('Attributes', () => {
    it('should set placeholder attribute', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          placeholder: 'Enter your name'
        }
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name')
    })

    it('should set disabled attribute', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          disabled: true
        }
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('should not set disabled when false', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          disabled: false
        }
      })

      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })

    it('should set min attribute for number input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number',
          min: 0
        }
      })

      expect(wrapper.find('input').attributes('min')).toBe('0')
    })

    it('should set max attribute for number input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number',
          max: 100
        }
      })

      expect(wrapper.find('input').attributes('max')).toBe('100')
    })

    it('should set step attribute for number input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number',
          step: 0.1
        }
      })

      expect(wrapper.find('input').attributes('step')).toBe('0.1')
    })

    it('should set rows attribute for textarea', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea',
          rows: 5
        }
      })

      expect(wrapper.find('textarea').attributes('rows')).toBe('5')
    })
  })

  describe('ID Generation', () => {
    it('should use provided id prop', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          id: 'custom-id'
        }
      })

      expect(wrapper.find('input').attributes('id')).toBe('custom-id')
    })

    it('should generate unique id when not provided', () => {
      const wrapper1 = mount(FormField, {
        props: { modelValue: '' }
      })
      const wrapper2 = mount(FormField, {
        props: { modelValue: '' }
      })

      const id1 = wrapper1.find('input').attributes('id')
      const id2 = wrapper2.find('input').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('should link label to input via for attribute', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          label: 'Username',
          id: 'username-input'
        }
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')

      expect(label.attributes('for')).toBe('username-input')
      expect(input.attributes('id')).toBe('username-input')
    })
  })

  describe('Error Display', () => {
    it('should show error message when error prop is provided', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          error: 'This field is required'
        }
      })

      const errorSpan = wrapper.find('.error-text')
      expect(errorSpan.exists()).toBe(true)
      expect(errorSpan.text()).toBe('This field is required')
    })

    it('should apply error class to input when error exists', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          error: 'Error message'
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('form-input-error')
    })

    it('should not apply error class when no error', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('form-input-error')
    })

    it('should reserve space for error when showErrorSpace is true', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          showErrorSpace: true
        }
      })

      expect(wrapper.find('.error-text').exists()).toBe(true)
    })

    it('should not reserve space for error when showErrorSpace is false', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          showErrorSpace: false,
          error: ''
        }
      })

      expect(wrapper.find('.error-text').exists()).toBe(false)
    })

    it('should show error message even when showErrorSpace is false if error exists', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          showErrorSpace: false,
          error: 'Error message'
        }
      })

      expect(wrapper.find('.error-text').exists()).toBe(true)
      expect(wrapper.find('.error-text').text()).toBe('Error message')
    })
  })

  describe('Blur Event', () => {
    it('should emit blur event when input loses focus', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.trigger('blur')

      expect(wrapper.emitted()).toHaveProperty('blur')
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should emit blur event for textarea', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('blur')

      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should pass event object in blur emission', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.trigger('blur')

      const emittedEvent = wrapper.emitted('blur')![0][0]
      expect(emittedEvent).toBeInstanceOf(Event)
    })
  })

  describe('CSS Classes', () => {
    it('should have form-field wrapper class', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('.form-field').exists()).toBe(true)
    })

    it('should have form-label class on label', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          label: 'Test'
        }
      })

      expect(wrapper.find('.form-label').exists()).toBe(true)
    })

    it('should have form-input class on input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('.form-input').exists()).toBe(true)
    })

    it('should have form-input class on textarea', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      expect(wrapper.find('.form-input').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle numeric zero as modelValue', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input').element as HTMLInputElement
      expect(input.value).toBe('0')
    })

    it('should handle empty string as modelValue', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input').element as HTMLInputElement
      expect(input.value).toBe('')
    })

    it('should handle very long text', async () => {
      const longText = 'a'.repeat(10000)
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue(longText)

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([longText])
    })

    it('should handle special characters in text', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue('<script>alert("xss")</script>')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['<script>alert("xss")</script>'])
    })

    it('should handle negative numbers', async () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('-42')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([-42])
    })
  })

  describe('Component Structure', () => {
    it('should render form-field wrapper as parent element', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      const formField = wrapper.find('.form-field')
      expect(formField.exists()).toBe(true)
      expect(formField.element.tagName).toBe('DIV')
    })

    it('should have label before input when label exists', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          label: 'Test Label'
        }
      })

      const formField = wrapper.find('.form-field')
      const children = Array.from(formField.element.children)

      expect(children[0].tagName).toBe('LABEL')
      expect(children[1].tagName).toBe('INPUT')
    })

    it('should have error text after input', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          error: 'Error message'
        }
      })

      const formField = wrapper.find('.form-field')
      const children = Array.from(formField.element.children)

      const errorSpan = children.find(child => child.classList.contains('error-text'))
      expect(errorSpan).toBeDefined()
    })
  })

  describe('Default Props', () => {
    it('should default type to text', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should default placeholder to empty string', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('')
    })

    it('should default disabled to false', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })

    it('should default rows to 4 for textarea', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    })

    it('should default showErrorSpace to true', () => {
      const wrapper = mount(FormField, {
        props: {
          modelValue: ''
        }
      })

      // Error space should be reserved by default
      expect(wrapper.find('.error-text').exists()).toBe(true)
    })
  })
})
