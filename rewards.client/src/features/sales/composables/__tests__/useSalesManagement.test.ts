import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSalesManagement } from '../useSalesManagement'
import type { Sale } from '@/features/sales/types'

// Create mock objects
const mockSnackbar = {
  success: vi.fn(),
  error: vi.fn()
}

const mockConfirm = {
  confirm: vi.fn()
}

// Mock dependencies
vi.mock('@/api', () => ({
  salesApi: {
    fetchSales: vi.fn(),
    updateSale: vi.fn(),
    deleteSale: vi.fn()
  }
}))

vi.mock('@/shared/composables', () => ({
  useSnackbar: () => mockSnackbar,
  useConfirm: () => mockConfirm
}))

vi.mock('@/utils', () => ({
  validateSaleUpdate: vi.fn(() => ({ valid: true, errors: [] }))
}))

import { salesApi } from '@/api'
import { validateSaleUpdate } from '@/utils'

describe('useSalesManagement', () => {
  const mockSales: Sale[] = [
    {
      id: '1',
      saleType: 'Life Insurance',
      price: 1000,
      customerSatisfaction: 5,
      saleDate: '2024-01-01',
      rewardValue: 100
    },
    {
      id: '2',
      saleType: 'Health Insurance',
      price: 2000,
      customerSatisfaction: 4,
      saleDate: '2024-01-02',
      rewardValue: 200
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockSnackbar.success.mockClear()
    mockSnackbar.error.mockClear()
    mockConfirm.confirm.mockClear()
  })

  describe('fetchSales', () => {
    it('should fetch sales successfully', async () => {
      vi.mocked(salesApi.fetchSales).mockResolvedValue(mockSales)
      const { fetchSales, sales, loading } = useSalesManagement()

      expect(loading.value).toBe(false)

      await fetchSales()

      expect(loading.value).toBe(false)
      expect(sales.value).toEqual(mockSales)
      expect(salesApi.fetchSales).toHaveBeenCalledOnce()
    })

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch')
      vi.mocked(salesApi.fetchSales).mockRejectedValue(error)

      const { fetchSales, sales } = useSalesManagement()

      await fetchSales()

      expect(sales.value).toEqual([])
      expect(mockSnackbar.error).toHaveBeenCalledWith('Failed to fetch')
    })
  })

  describe('openEditModal', () => {
    it('should open edit modal with selected sale', () => {
      const { openEditModal, selectedSale, editModalVisible } = useSalesManagement()

      openEditModal(mockSales[0])

      expect(selectedSale.value).toEqual(mockSales[0])
      expect(editModalVisible.value).toBe(true)
    })
  })

  describe('closeEditModal', () => {
    it('should close edit modal and clear selected sale', () => {
      const { openEditModal, closeEditModal, selectedSale, editModalVisible } = useSalesManagement()

      openEditModal(mockSales[0])
      expect(editModalVisible.value).toBe(true)

      closeEditModal()

      expect(selectedSale.value).toBe(null)
      expect(editModalVisible.value).toBe(false)
    })
  })

  describe('updateSale', () => {
    it('should update sale successfully', async () => {
      vi.mocked(salesApi.fetchSales).mockResolvedValue(mockSales)
      vi.mocked(salesApi.updateSale).mockResolvedValue(undefined)

      const { fetchSales, openEditModal, updateSale, sales, editModalVisible } = useSalesManagement()

      await fetchSales()
      openEditModal(mockSales[0])

      const updates = { price: 1500, customerSatisfaction: 4 }
      await updateSale(updates)

      expect(salesApi.updateSale).toHaveBeenCalled()
      expect(sales.value[0].price).toBe(1500)
      expect(sales.value[0].customerSatisfaction).toBe(4)
      expect(editModalVisible.value).toBe(false)
      expect(mockSnackbar.success).toHaveBeenCalledWith('Sale updated successfully')
    })

    it('should not update if validation fails', async () => {
      vi.mocked(validateSaleUpdate).mockReturnValue({
        valid: false,
        errors: ['Price must be greater than 0']
      })

      const { openEditModal, updateSale } = useSalesManagement()

      openEditModal(mockSales[0])

      const updates = { price: -100, customerSatisfaction: 4 }
      await updateSale(updates)

      expect(salesApi.updateSale).not.toHaveBeenCalled()
      expect(mockSnackbar.error).toHaveBeenCalledWith('Price must be greater than 0')
    })

    it('should handle update error', async () => {
      // Reset validation mock to return valid
      vi.mocked(validateSaleUpdate).mockReturnValue({
        valid: true,
        errors: []
      })

      const error = new Error('Update failed')
      vi.mocked(salesApi.updateSale).mockRejectedValue(error)

      const { openEditModal, updateSale, editModalVisible } = useSalesManagement()

      openEditModal(mockSales[0])

      const updates = { price: 1500, customerSatisfaction: 4 }
      await updateSale(updates)

      expect(mockSnackbar.error).toHaveBeenCalledWith('Update failed')
      expect(editModalVisible.value).toBe(true) // Modal should still be open on error
    })

    it('should not update if no sale is selected', async () => {
      const { updateSale } = useSalesManagement()

      const updates = { price: 1500, customerSatisfaction: 4 }
      await updateSale(updates)

      expect(salesApi.updateSale).not.toHaveBeenCalled()
    })
  })

  describe('deleteSale', () => {
    it('should delete sale after confirmation', async () => {
      vi.mocked(salesApi.fetchSales).mockResolvedValue(mockSales)
      vi.mocked(salesApi.deleteSale).mockResolvedValue(undefined)
      mockConfirm.confirm.mockResolvedValue(true)

      const { fetchSales, deleteSale, sales } = useSalesManagement()

      await fetchSales()
      expect(sales.value.length).toBe(2)

      await deleteSale('1')

      expect(mockConfirm.confirm).toHaveBeenCalled()
      expect(salesApi.deleteSale).toHaveBeenCalledWith('1')
      expect(sales.value.length).toBe(1)
      expect(sales.value[0].id).toBe('2')
      expect(mockSnackbar.success).toHaveBeenCalledWith('Sale deleted successfully')
    })

    it('should not delete if user cancels confirmation', async () => {
      vi.mocked(salesApi.fetchSales).mockResolvedValue(mockSales)
      mockConfirm.confirm.mockResolvedValue(false)

      const { fetchSales, deleteSale, sales } = useSalesManagement()

      await fetchSales()

      await deleteSale('1')

      expect(salesApi.deleteSale).not.toHaveBeenCalled()
      expect(sales.value.length).toBe(2)
    })

    it('should handle delete error', async () => {
      const error = new Error('Delete failed')
      vi.mocked(salesApi.deleteSale).mockRejectedValue(error)
      mockConfirm.confirm.mockResolvedValue(true)

      const { deleteSale } = useSalesManagement()

      await deleteSale('1')

      expect(mockSnackbar.error).toHaveBeenCalledWith('Delete failed')
    })
  })
})
