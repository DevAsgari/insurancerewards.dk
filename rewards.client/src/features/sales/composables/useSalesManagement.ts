import { ref } from 'vue'
import { salesApi } from '@/api'
import { useSnackbar, useConfirm } from '@/shared/composables'
import { validateSaleUpdate } from '@/utils'
import type { Sale } from '@/features/sales/types'

/**
 * Composable for managing sales (fetch, update, delete)
 */
export function useSalesManagement() {
  const snackbar = useSnackbar()
  const confirmDialog = useConfirm()

  const sales = ref<Sale[]>([])
  const loading = ref(false)
  const selectedSale = ref<Sale | null>(null)
  const editModalVisible = ref(false)

  /**
   * Fetch all sales from API
   */
  const fetchSales = async () => {
    loading.value = true

    try {
      const fetchedSales = await salesApi.fetchSales()
      sales.value = fetchedSales
    } catch (err) {
      snackbar.error('Failed to fetch sales')
      console.error('Error fetching sales:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Open edit modal for a sale
   */
  const openEditModal = (sale: Sale) => {
    selectedSale.value = sale
    editModalVisible.value = true
  }

  /**
   * Close edit modal
   */
  const closeEditModal = () => {
    editModalVisible.value = false
    selectedSale.value = null
  }

  /**
   * Update a sale
   */
  const updateSale = async (updates: { price: number; customerSatisfaction: number }) => {
    if (!selectedSale.value) return

    // Validate input before submitting
    const validation = validateSaleUpdate(updates)
    if (!validation.valid) {
      snackbar.error(validation.errors[0] || 'Invalid form data')
      return
    }

    loading.value = true

    try {
      // Create updated sale object
      const updatedSale: Sale = {
        ...selectedSale.value,
        price: updates.price,
        customerSatisfaction: updates.customerSatisfaction
      }

      await salesApi.updateSale(updatedSale)

      // Update local array
      const index = sales.value.findIndex(s => s.id === selectedSale.value!.id)
      if (index !== -1 && sales.value[index]) {
        sales.value[index].price = updates.price
        sales.value[index].customerSatisfaction = updates.customerSatisfaction
      }

      closeEditModal()
      snackbar.success('Sale updated successfully')
    } catch (err) {
      snackbar.error('Failed to update sale')
      console.error('Error updating sale:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a sale with confirmation
   * @returns true if deleted, false if cancelled or failed
   */
  const deleteSale = async (saleId: string): Promise<boolean> => {
    const confirmed = await confirmDialog.confirm({
      title: 'Delete Sale',
      message: 'Are you sure you want to delete this sale? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    })

    if (!confirmed) {
      return false
    }

    loading.value = true

    try {
      await salesApi.deleteSale(saleId)

      // Remove from local array
      sales.value = sales.value.filter(sale => sale.id !== saleId)

      snackbar.success('Sale deleted successfully')
      return true
    } catch (err) {
      snackbar.error('Failed to delete sale')
      console.error('Error deleting sale:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    sales,
    loading,
    selectedSale,
    editModalVisible,
    fetchSales,
    openEditModal,
    closeEditModal,
    updateSale,
    deleteSale
  }
}
