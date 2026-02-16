/**
 * Sale-related type definitions
 */

export interface Sale {
  id: string
  insuranceTypeId: number
  insuranceTypeName: string
  price: number
  customerSatisfaction: number
  saleDate: string
  rewardValue?: number
}

export interface SaleFormData {
  insuranceType: number | undefined
  price: number
  satisfaction: number | undefined
  date: string
}

export interface CreateSalePayload {
  id: string
  insuranceTypeId: number
  price: number
  customerSatisfaction: number
  saleDate: string
}
