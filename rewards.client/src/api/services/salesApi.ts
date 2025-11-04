import type { Sale, CreateSalePayload } from '@/features/sales/types'
import type { RewardStrategy } from '@/features/rewards/types'

const API_BASE_URL = '/api/sales'

/**
 * Helper function to handle HTTP error responses
 */
async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${errorMessage}: ${errorText}`)
  }

  // Return empty object for 204 No Content responses
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

/**
 * Helper to handle network errors
 */
function handleNetworkError(error: unknown, defaultMessage: string): never {
  if (error instanceof TypeError) {
    // Network error (no internet, DNS failure, CORS, etc.)
    throw new Error('Network error: Please check your internet connection')
  }
  if (error instanceof Error) {
    throw error
  }
  throw new Error(defaultMessage)
}

export const salesApi = {
  /**
   * Fetch all sales
   */
  async fetchSales(): Promise<Sale[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      return handleResponse<Sale[]>(response, 'Failed to fetch sales')
    } catch (error) {
      handleNetworkError(error, 'Failed to fetch sales')
    }
  },

  /**
   * Create a new sale
   */
  async createSale(payload: CreateSalePayload): Promise<Sale> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      })

      return handleResponse<Sale>(response, 'Failed to register sale')
    } catch (error) {
      handleNetworkError(error, 'Failed to register sale')
    }
  },

  /**
   * Calculate rewards for all sales using a specific strategy
   */
  async calculateRewards(strategy: RewardStrategy): Promise<Sale[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculatereward/${strategy}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      })

      return handleResponse<Sale[]>(response, 'Failed to calculate rewards')
    } catch (error) {
      handleNetworkError(error, 'Failed to calculate rewards')
    }
  },

  /**
   * Update a sale's price and customer satisfaction
   */
  async updateSale(sale: Sale): Promise<Sale> {
    try {
      const payload = {
        price: sale.price,
        customerSatisfaction: sale.customerSatisfaction
      }

      const response = await fetch(`${API_BASE_URL}/${sale.id}/price-satisfaction`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      })

      await handleResponse<void>(response, 'Failed to update sale')

      // Backend returns 204 No Content, so return the updated sale object
      return sale
    } catch (error) {
      handleNetworkError(error, 'Failed to update sale')
    }
  },

  /**
   * Delete a sale by ID
   */
  async deleteSale(saleId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${saleId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(10000)
      })

      await handleResponse<void>(response, 'Failed to delete sale')
    } catch (error) {
      handleNetworkError(error, 'Failed to delete sale')
    }
  }
}
