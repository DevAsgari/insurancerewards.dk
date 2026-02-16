import { describe, it, expect, beforeEach, vi } from 'vitest'
import { salesApi } from '../salesApi'
import type { Sale, CreateSalePayload } from '@/features/sales/types'

describe('salesApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  describe('fetchSales', () => {
    it('should fetch all sales successfully', async () => {
      const mockSales: Sale[] = [
        {
          id: '1',
          insuranceTypeId: 1, insuranceTypeName: 'Life',
          price: 1000,
          customerSatisfaction: 8,
          saleDate: '2025-01-01',
          rewardValue: 100
        },
        {
          id: '2',
          insuranceTypeId: 2, insuranceTypeName: 'Health',
          price: 2000,
          customerSatisfaction: 9,
          saleDate: '2025-01-02',
          rewardValue: 200
        }
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSales
      })

      const result = await salesApi.fetchSales()

      expect(fetch).toHaveBeenCalledWith('/api/sales', expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }))
      expect(result).toEqual(mockSales)
    })

    it('should throw error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Server error'
      })

      await expect(salesApi.fetchSales()).rejects.toThrow('Failed to fetch sales')
    })
  })

  describe('createSale', () => {
    it('should create a new sale successfully', async () => {
      const payload: CreateSalePayload = {
        id: '123',
        insuranceTypeId: 3,
        price: 5000,
        customerSatisfaction: 10,
        saleDate: '2025-01-15'
      }

      const mockResponse: Sale = {
        ...payload,
        rewardValue: 500
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await salesApi.createSale(payload)

      expect(fetch).toHaveBeenCalledWith('/api/sales', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }))
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when creation fails', async () => {
      const payload: CreateSalePayload = {
        id: '123',
        insuranceTypeId: 3,
        price: 5000,
        customerSatisfaction: 10,
        saleDate: '2025-01-15'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Validation error'
      })

      await expect(salesApi.createSale(payload)).rejects.toThrow(
        'Failed to register sale'
      )
    })
  })

  describe('calculateRewards', () => {
    it('should calculate rewards with strategy 0', async () => {
      const mockSales: Sale[] = [
        {
          id: '1',
          insuranceTypeId: 1, insuranceTypeName: 'Life',
          price: 1000,
          customerSatisfaction: 8,
          saleDate: '2025-01-01',
          rewardValue: 80
        }
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSales
      })

      const result = await salesApi.calculateRewards(0)

      expect(fetch).toHaveBeenCalledWith('/api/sales/calculatereward/0', expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }))
      expect(result).toEqual(mockSales)
    })

    it('should calculate rewards with strategy 3', async () => {
      const mockSales: Sale[] = [
        {
          id: '1',
          insuranceTypeId: 1, insuranceTypeName: 'Life',
          price: 1000,
          customerSatisfaction: 8,
          saleDate: '2025-01-01',
          rewardValue: 50
        }
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSales
      })

      const result = await salesApi.calculateRewards(3)

      expect(fetch).toHaveBeenCalledWith('/api/sales/calculatereward/3', expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }))
      expect(result).toEqual(mockSales)
    })

    it('should throw error when calculation fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Invalid strategy'
      })

      await expect(salesApi.calculateRewards(0)).rejects.toThrow(
        'Failed to calculate rewards'
      )
    })
  })

  describe('updateSale', () => {
    it('should update a sale successfully', async () => {
      const sale: Sale = {
        id: '123',
        insuranceTypeId: 1, insuranceTypeName: 'Life',
        price: 1500,
        customerSatisfaction: 9,
        saleDate: '2025-01-01',
        rewardValue: 150
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204
      })

      const result = await salesApi.updateSale(sale)

      expect(fetch).toHaveBeenCalledWith('/api/sales/123/price-satisfaction', expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price: 1500,
          customerSatisfaction: 9
        })
      }))
      expect(result).toEqual(sale)
    })

    it('should throw error when update fails', async () => {
      const sale: Sale = {
        id: '123',
        insuranceTypeId: 1, insuranceTypeName: 'Life',
        price: 1500,
        customerSatisfaction: 9,
        saleDate: '2025-01-01'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Sale not found'
      })

      await expect(salesApi.updateSale(sale)).rejects.toThrow('Failed to update sale')
    })
  })

  describe('deleteSale', () => {
    it('should delete a sale successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204
      })

      await salesApi.deleteSale('123')

      expect(fetch).toHaveBeenCalledWith('/api/sales/123', expect.objectContaining({
        method: 'DELETE'
      }))
    })

    it('should throw error when delete fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Sale not found'
      })

      await expect(salesApi.deleteSale('123')).rejects.toThrow('Failed to delete sale')
    })
  })
})
