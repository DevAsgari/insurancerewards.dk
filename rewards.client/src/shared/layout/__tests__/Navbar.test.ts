import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Navbar from '../Navbar.vue'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/register', component: { template: '<div>Register</div>' } },
  { path: '/rewards', component: { template: '<div>Rewards</div>' } }
]

describe('Navbar', () => {
  const createRouterInstance = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes
    })
  }

  it('should render navigation element', () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('nav').attributes('role')).toBe('navigation')
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
  })

  it('should render all navigation links', () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    const links = wrapper.findAll('a')
    const linkTexts = links.map(link => link.text())

    expect(linkTexts).toContain('Home')
    expect(linkTexts).toContain('Register Sale')
    expect(linkTexts).toContain('Reward')
  })

  it('should have correct router-link destinations', () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    const links = wrapper.findAll('a')
    const homeLinks = links.filter(link => link.attributes('href') === '/')
    const registerLinks = links.filter(link => link.attributes('href') === '/register')
    const rewardsLinks = links.filter(link => link.attributes('href') === '/rewards')

    expect(homeLinks.length).toBeGreaterThan(0)
    expect(registerLinks.length).toBeGreaterThan(0)
    expect(rewardsLinks.length).toBeGreaterThan(0)
  })

  it('should render mobile menu toggle button', () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    const toggleButton = wrapper.find('button[aria-label="Toggle menu"]')
    expect(toggleButton.exists()).toBe(true)
  })

  it('should toggle mobile menu when button is clicked', async () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    const toggleButton = wrapper.find('button[aria-label="Toggle menu"]')

    // Initially closed
    expect(wrapper.vm.isMobileMenuOpen).toBe(false)

    // Click to open
    await toggleButton.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(true)
    expect(toggleButton.attributes('aria-expanded')).toBe('true')

    // Click to close
    await toggleButton.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
    expect(toggleButton.attributes('aria-expanded')).toBe('false')
  })

  it('should close mobile menu when logo is clicked', async () => {
    const router = createRouterInstance()
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    })

    // Open menu
    const toggleButton = wrapper.find('button[aria-label="Toggle menu"]')
    await toggleButton.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(true)

    // Click logo
    const logoLink = wrapper.find('a[href="/"]')
    await logoLink.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
  })
})
