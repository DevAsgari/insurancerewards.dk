/**
 * Sale-related type definitions
 */

export interface Sale {
  id: string
  saleType: string
  price: number
  customerSatisfaction: number
  saleDate: string
  rewardValue?: number
}

export interface SaleFormData {
  insuranceType: string
  price: number
  satisfaction: number | undefined
  date: string
}

export interface CreateSalePayload {
  id: string
  saleType: string
  price: number
  customerSatisfaction: number
  saleDate: string
}
