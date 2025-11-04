import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RewardsPage from '../RewardsPage.vue'
import { RewardCalculator } from '@/features/rewards/components'
import { EmptyState, CustomDropdown } from '@/shared/components'

// Mock the API
vi.mock('@/api', () => ({
  salesApi: {
    fetchSales: vi.fn().mockResolvedValue([]),
    calculateRewards: vi.fn().mockResolvedValue([])
  }
}))

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/register', component: { template: '<div>Register</div>' } },
  { path: '/rewards', component: RewardsPage }
]

describe('RewardsPage', () => {
  const createRouterInstance = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page heading', () => {
    const router = createRouterInstance()
    const wrapper = mount(RewardsPage, {
      global: {
        plugins: [router],
        components: {
          CustomDropdown
        },
        stubs: {
          Navbar: true,
          RewardCalculator: true,
          EmptyState: true,
          SalesRewardsTable: true,
          EditSaleModal: true
        }
      }
    })

    expect(wrapper.find('h2').text()).toBe('Calculate Rewards')
  })

  it('should render RewardCalculator component', () => {
    const router = createRouterInstance()
    const wrapper = mount(RewardsPage, {
      global: {
        plugins: [router],
        components: {
          RewardCalculator,
          CustomDropdown
        },
        stubs: {
          Navbar: true,
          EmptyState: true,
          SalesRewardsTable: true,
          EditSaleModal: true
        }
      }
    })

    expect(wrapper.findComponent(RewardCalculator).exists()).toBe(true)
  })

  it('should render EmptyState when there are no sales', async () => {
    const router = createRouterInstance()
    const wrapper = mount(RewardsPage, {
      global: {
        plugins: [router],
        components: {
          EmptyState,
          CustomDropdown
        },
        stubs: {
          Navbar: true,
          RewardCalculator: true,
          SalesRewardsTable: true,
          EditSaleModal: true
        }
      }
    })

    await flushPromises()
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
  })
})
