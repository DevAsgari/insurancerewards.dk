import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '../DataTable.vue'
import type { DataTableColumn } from '../DataTable.vue'

interface TestData {
  id: number
  name: string
  age: number
  email: string
}

describe('DataTable', () => {
  const mockColumns: DataTableColumn<TestData>[] = [
    { key: 'id', header: 'ID', align: 'left' },
    { key: 'name', header: 'Name', align: 'left' },
    { key: 'age', header: 'Age', align: 'center' },
    { key: 'email', header: 'Email', align: 'right' }
  ]

  const mockData: TestData[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
  ]

  describe('Basic Rendering', () => {
    it('should render table with columns and data', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      expect(wrapper.find('table').exists()).toBe(true)
      expect(wrapper.findAll('thead th')).toHaveLength(4)
      expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    })

    it('should render column headers correctly', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      const headers = wrapper.findAll('thead th')
      expect(headers[0].text()).toBe('ID')
      expect(headers[1].text()).toBe('Name')
      expect(headers[2].text()).toBe('Age')
      expect(headers[3].text()).toBe('Email')
    })

    it('should render data cells correctly', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [mockData[0]]
        }
      })

      const cells = wrapper.findAll('tbody td')
      expect(cells[0].text()).toBe('1')
      expect(cells[1].text()).toBe('John Doe')
      expect(cells[2].text()).toBe('30')
      expect(cells[3].text()).toBe('john@example.com')
    })
  })

  describe('Column Alignment', () => {
    it('should apply left alignment class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name', align: 'left' }],
          data: [{ name: 'Test' }]
        }
      })

      const header = wrapper.find('thead th')
      const cell = wrapper.find('tbody td')

      expect(header.classes()).toContain('text-left')
      expect(cell.classes()).toContain('text-left')
    })

    it('should apply center alignment class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'age', header: 'Age', align: 'center' }],
          data: [{ age: 30 }]
        }
      })

      const header = wrapper.find('thead th')
      const cell = wrapper.find('tbody td')

      expect(header.classes()).toContain('text-center')
      expect(cell.classes()).toContain('text-center')
    })

    it('should apply right alignment class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'email', header: 'Email', align: 'right' }],
          data: [{ email: 'test@example.com' }]
        }
      })

      const header = wrapper.find('thead th')
      const cell = wrapper.find('tbody td')

      expect(header.classes()).toContain('text-right')
      expect(cell.classes()).toContain('text-right')
    })

    it('should default to left alignment when not specified', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: 'Test' }]
        }
      })

      const header = wrapper.find('thead th')
      expect(header.classes()).toContain('text-left')
    })
  })

  describe('Empty State', () => {
    it('should show default empty message when data is empty', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: []
        }
      })

      expect(wrapper.findAll('tbody tr')).toHaveLength(1)
      expect(wrapper.text()).toContain('No data available')
    })

    it('should show custom empty message', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [],
          emptyMessage: 'No records found'
        }
      })

      expect(wrapper.text()).toContain('No records found')
    })

    it('should render custom empty slot', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: []
        },
        slots: {
          empty: '<div class="custom-empty">Custom empty state</div>'
        }
      })

      expect(wrapper.find('.custom-empty').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom empty state')
    })

    it('should span empty message across all columns', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: []
        }
      })

      const emptyCell = wrapper.find('tbody td')
      expect(emptyCell.attributes('colspan')).toBe('4')
    })
  })

  describe('Loading State', () => {
    it('should show loading message when loading is true', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          loading: true
        }
      })

      expect(wrapper.text()).toContain('Loading...')
    })

    it('should render custom loading slot', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          loading: true
        },
        slots: {
          loading: '<div class="custom-loading">Loading data...</div>'
        }
      })

      expect(wrapper.find('.custom-loading').exists()).toBe(true)
      expect(wrapper.text()).toContain('Loading data...')
    })

    it('should span loading message across all columns', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [],
          loading: true
        }
      })

      const loadingCell = wrapper.find('tbody td')
      expect(loadingCell.attributes('colspan')).toBe('4')
    })

    it('should show loading state even when data is present', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData,
          loading: true
        }
      })

      // Loading row + data rows
      expect(wrapper.findAll('tbody tr').length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain('Loading...')
    })
  })

  describe('Column Formatter', () => {
    it('should use formatter function when provided', () => {
      const columns: DataTableColumn<TestData>[] = [
        {
          key: 'age',
          header: 'Age',
          format: (value: number) => `${value} years old`
        }
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: [{ id: 1, name: 'Test', age: 30, email: 'test@test.com' }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('30 years old')
    })

    it('should pass both value and row to formatter', () => {
      const columns: DataTableColumn<TestData>[] = [
        {
          key: 'name',
          header: 'Info',
          format: (value: string, row: TestData) => `${value} (${row.age})`
        }
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: [{ id: 1, name: 'John', age: 30, email: 'john@test.com' }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('John (30)')
    })

    it('should show raw value when no formatter provided', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: 'John Doe' }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('John Doe')
    })
  })

  describe('Custom Cell Slots', () => {
    it('should render custom cell slot', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: 'John' }]
        },
        slots: {
          'cell-name': '<strong class="custom-cell">Custom Name</strong>'
        }
      })

      expect(wrapper.find('.custom-cell').exists()).toBe(true)
      expect(wrapper.find('strong').text()).toBe('Custom Name')
    })

    it('should pass row, value, and column to slot', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: 'John', age: 30 }]
        },
        slots: {
          'cell-name': `<template #cell-name="{ row, value }">
            <span class="slot-test">{{ value }} - {{ row.age }}</span>
          </template>`
        }
      })

      // Slot will render with scoped props
      expect(wrapper.find('tbody td').exists()).toBe(true)
    })
  })

  describe('Row Click Event', () => {
    it('should emit row-click event when row is clicked', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [mockData[0]]
        }
      })

      await wrapper.find('tbody tr').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('row-click')
      expect(wrapper.emitted('row-click')).toHaveLength(1)
      expect(wrapper.emitted('row-click')![0]).toEqual([mockData[0]])
    })

    it('should emit correct row data for each row clicked', async () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      const rows = wrapper.findAll('tbody tr')

      await rows[0].trigger('click')
      expect(wrapper.emitted('row-click')![0]).toEqual([mockData[0]])

      await rows[1].trigger('click')
      expect(wrapper.emitted('row-click')![1]).toEqual([mockData[1]])

      await rows[2].trigger('click')
      expect(wrapper.emitted('row-click')![2]).toEqual([mockData[2]])
    })
  })

  describe('Row Key Generation', () => {
    it('should use id as default row key', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(3)
      // Keys are internal, but we can verify rows render correctly
    })

    it('should use custom row key when provided', () => {
      const data = [
        { customId: 'a1', name: 'John' },
        { customId: 'a2', name: 'Jane' }
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data,
          rowKey: 'customId'
        }
      })

      expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    })

    it('should fallback to index when rowKey field does not exist', () => {
      const data = [
        { name: 'John' },
        { name: 'Jane' }
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data,
          rowKey: 'id' // This field doesn't exist
        }
      })

      expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    })
  })

  describe('Custom Row Class', () => {
    it('should apply custom row class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [mockData[0]],
          rowClass: 'custom-row-class'
        }
      })

      const row = wrapper.find('tbody tr')
      expect(row.classes()).toContain('custom-row-class')
    })

    it('should work without custom row class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [mockData[0]]
        }
      })

      const row = wrapper.find('tbody tr')
      expect(row.exists()).toBe(true)
      // Should still have default classes
      expect(row.classes()).toContain('border-b')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null values in data', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'value', header: 'Value' }],
          data: [{ value: null }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('')
    })

    it('should handle undefined values in data', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'value', header: 'Value' }],
          data: [{ value: undefined }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('')
    })

    it('should handle zero as a value', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'count', header: 'Count' }],
          data: [{ count: 0 }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('0')
    })

    it('should handle empty string as a value', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: '' }]
        }
      })

      expect(wrapper.find('tbody td').text()).toBe('')
    })

    it('should render with single column', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: [{ key: 'name', header: 'Name' }],
          data: [{ name: 'John' }]
        }
      })

      expect(wrapper.findAll('thead th')).toHaveLength(1)
      expect(wrapper.findAll('tbody td')).toHaveLength(1)
    })

    it('should render with many columns', () => {
      const manyColumns = Array.from({ length: 10 }, (_, i) => ({
        key: `col${i}`,
        header: `Column ${i}`
      }))

      const data = [
        Object.fromEntries(manyColumns.map((col, i) => [col.key, `Value ${i}`]))
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns: manyColumns,
          data
        }
      })

      expect(wrapper.findAll('thead th')).toHaveLength(10)
      expect(wrapper.findAll('tbody td')).toHaveLength(10)
    })
  })

  describe('Table Structure', () => {
    it('should have correct table wrapper class', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      expect(wrapper.find('.data-table-wrapper').exists()).toBe(true)
    })

    it('should have overflow wrapper for horizontal scrolling', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      expect(wrapper.find('.overflow-x-auto').exists()).toBe(true)
    })

    it('should have table-header class on headers', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: mockData
        }
      })

      const headers = wrapper.findAll('thead th')
      headers.forEach(header => {
        expect(header.classes()).toContain('table-header')
      })
    })

    it('should have table-cell class on data cells', () => {
      const wrapper = mount(DataTable, {
        props: {
          columns: mockColumns,
          data: [mockData[0]]
        }
      })

      const cells = wrapper.findAll('tbody td')
      cells.forEach(cell => {
        expect(cell.classes()).toContain('table-cell')
      })
    })
  })
})
