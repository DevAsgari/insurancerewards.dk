import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomePage from '../HomePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/register', component: { template: '<div>Register</div>' } }
]

describe('HomePage', () => {
  const createRouterInstance = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes
    })
  }

  it('should render main heading', () => {
    const router = createRouterInstance()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.find('h1').text()).toBe('Boost Your Sales Performance')
  })

  it('should render description text', () => {
    const router = createRouterInstance()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.text()).toContain('Unlock your earning potential with Insurance Rewards')
    expect(wrapper.text()).toContain('Track every sale')
    expect(wrapper.text()).toContain('reward system')
  })

  it('should render Register Sale button', () => {
    const router = createRouterInstance()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: {
          Navbar: true
        }
      }
    })

    const button = wrapper.find('a.btn-primary')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Register Sale')
  })

  it('should link to /register route', () => {
    const router = createRouterInstance()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
        stubs: {
          Navbar: true
        }
      }
    })

    const link = wrapper.find('a[href="/register"]')
    expect(link.exists()).toBe(true)
  })
})
