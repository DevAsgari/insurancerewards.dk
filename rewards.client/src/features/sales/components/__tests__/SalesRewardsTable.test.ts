import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SalesRewardsTable from '../SalesRewardsTable.vue'
import type { Sale } from '@/features/sales/types'

describe('SalesRewardsTable', () => {
  const mockSales: Sale[] = [
    {
      id: '1',
      saleType: 'Life',
      price: 1000,
      customerSatisfaction: 8,
      saleDate: '2025-01-01T00:00:00',
      rewardValue: 100
    },
    {
      id: '2',
      saleType: 'Health',
      price: 2000,
      customerSatisfaction: 9,
      saleDate: '2025-01-02T00:00:00',
      rewardValue: 200
    }
  ]

  it('should render table with sales data', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('should render card header with title', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    expect(wrapper.text()).toContain('Sales & Rewards')
  })

  it('should display strategy name when provided', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300,
        strategyName: 'Customer Satisfaction'
      }
    })

    expect(wrapper.text()).toContain('Strategy: Customer Satisfaction')
  })

  it('should not display strategy name when not provided', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    expect(wrapper.text()).not.toContain('Strategy:')
  })

  it('should render table headers', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(6)
    expect(headers[0].text()).toBe('Insurance')
    expect(headers[1].text()).toBe('Date')
    expect(headers[2].text()).toBe('Price')
    expect(headers[3].text()).toBe('Rating')
    expect(headers[4].text()).toBe('Reward')
    expect(headers[5].text()).toBe('Actions')
  })

  it('should render sale data in correct columns', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: true,
        totalReward: 100
      }
    })

    const cells = wrapper.findAll('tbody td')
    expect(cells[0].text()).toBe('Life')
    expect(cells[1].text()).toContain('2025')
    expect(cells[2].text()).toBe('$1000.00')
    expect(cells[3].text()).toBe('8')
    expect(cells[4].text()).toBe('100.00')
  })

  it('should show total reward when hasRewards is true', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    expect(wrapper.text()).toContain('Total Reward')
    expect(wrapper.text()).toContain('300.00')
  })

  it('should hide total reward when hasRewards is false', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: false,
        totalReward: 0
      }
    })

    expect(wrapper.text()).not.toContain('Total Reward')
  })

  it('should emit delete event when delete button is clicked', async () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    const deleteButton = wrapper.find('.table-action-btn-delete')
    await deleteButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')).toHaveLength(1)
    expect(wrapper.emitted('delete')![0]).toEqual(['1'])
  })

  it('should emit edit event when edit button is clicked', async () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    const editButton = wrapper.find('.table-action-btn-edit')
    await editButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('edit')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')![0]).toEqual([mockSales[0]])
  })

  it('should render edit and delete buttons for each sale', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: false,
        totalReward: 0
      }
    })

    const editButtons = wrapper.findAll('.table-action-btn-edit')
    const deleteButtons = wrapper.findAll('.table-action-btn-delete')

    // One edit and one delete button per sale (2 sales = 2 buttons each)
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('should format reward value to currency with 2 decimal places', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [
          {
            ...mockSales[0],
            rewardValue: 123.456
          }
        ],
        hasRewards: true,
        totalReward: 123.456
      }
    })

    expect(wrapper.text()).toContain('123.46')
  })

  it('should display dash when reward value is undefined', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [
          {
            ...mockSales[0],
            rewardValue: undefined
          }
        ],
        hasRewards: false,
        totalReward: 0
      }
    })

    const rewardCell = wrapper.findAll('tbody td')[4]
    expect(rewardCell.text()).toBe('-')
  })

  it('should format date correctly', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    const dateCell = wrapper.findAll('tbody td')[1]
    // ISO format: YYYY-MM-DD
    expect(dateCell.text()).toMatch(/2025-01-01/)
  })

  it('should render with empty sales array', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [],
        hasRewards: false,
        totalReward: 0
      }
    })

    // DataTable shows 1 row with empty state message when data is empty
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('No sales recorded yet')
  })

  it('should have correct button aria labels', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    const editButton = wrapper.find('.table-action-btn-edit')
    const deleteButton = wrapper.find('.table-action-btn-delete')

    expect(editButton.attributes('aria-label')).toBe('Edit sale')
    expect(deleteButton.attributes('aria-label')).toBe('Delete sale')
  })

  it('should render SVG icons in action buttons', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    expect(wrapper.find('.table-action-btn-edit svg').exists()).toBe(true)
    expect(wrapper.find('.table-action-btn-delete svg').exists()).toBe(true)
  })

  it('should render trophy icon in header', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: mockSales,
        hasRewards: true,
        totalReward: 300
      }
    })

    expect(wrapper.find('.card-header svg').exists()).toBe(true)
  })

  it('should format price with currency symbol', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    const priceCell = wrapper.findAll('tbody td')[2]
    expect(priceCell.text()).toBe('$1000.00')
  })

  it('should display rating in badge', () => {
    const wrapper = mount(SalesRewardsTable, {
      props: {
        sales: [mockSales[0]],
        hasRewards: false,
        totalReward: 0
      }
    })

    expect(wrapper.find('.rating-badge').exists()).toBe(true)
    expect(wrapper.find('.rating-badge').text()).toBe('8')
  })
})
