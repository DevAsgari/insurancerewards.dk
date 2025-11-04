import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RegisterSalePage from '../RegisterSalePage.vue'
import { SaleForm } from '@/features/sales/components'
import { CustomDropdown } from '@/shared/components'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/register', component: RegisterSalePage }
]

describe('RegisterSalePage', () => {
  const createRouterInstance = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes
    })
  }

  it('should render page heading', () => {
    const router = createRouterInstance()
    const wrapper = mount(RegisterSalePage, {
      global: {
        plugins: [router],
        components: {
          CustomDropdown
        },
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.find('h2').text()).toBe('Register New Sale')
  })

  it('should render SaleForm component', () => {
    const router = createRouterInstance()
    const wrapper = mount(RegisterSalePage, {
      global: {
        plugins: [router],
        components: {
          SaleForm,
          CustomDropdown
        },
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.findComponent(SaleForm).exists()).toBe(true)
  })
})
