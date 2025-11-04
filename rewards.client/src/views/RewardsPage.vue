<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="p-8 max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl overflow-visible shadow-md mb-8">
        <div
          class="card-header rounded-2xl rounded-b-none py-10 flex items-center gap-4"
          style="background: var(--gradient-accent)"
        >
          <div
            class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <PhCalculator :size="md" class="icon-white" weight="fill" />
          </div>
          <div>
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold">Calculate Rewards</h2>
            <p class="text-base md:text-lg lg:text-xl opacity-90">Select your reward strategy</p>
          </div>
        </div>

        <RewardCalculator @calculate="handleCalculate" />
      </div>

      <!-- Show sales list if there are sales -->
      <SalesRewardsTable
        v-if="hasSales && !loading"
        :sales="calculatedRewards"
        :hasRewards="hasRewards"
        :totalReward="totalReward"
        :strategyName="selectedStrategy"
        @edit="handleEditSale"
        @delete="handleDeleteSale"
      />

      <!-- Back to Registration button -->
      <div v-if="hasSales && !loading" class="mt-8">
        <button @click="goToRegister" class="btn-primary flex items-center gap-2">
          <PhArrowLeft :size="xs" class="icon-white" weight="bold" />
          Back to Registration
        </button>
      </div>

      <!-- Edit Sale Modal -->
      <EditSaleModal
        :visible="editModalVisible"
        :sale="selectedSale"
        :loading="salesLoading"
        @submit="handleEditSubmit"
        @cancel="handleEditCancel"
      />

      <!-- Show EmptyState if no sales -->
      <EmptyState
        v-if="!hasSales && !loading"
        message="No sales registered yet."
        button-text="Register Your First Sale"
        @action="goToRegister"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch } from "vue";
import { Navbar } from "@/shared/layout";
import { RewardCalculator } from "@/features/rewards/components";
import { EmptyState } from "@/shared/components";
import { EditSaleModal, SalesRewardsTable } from "@/features/sales/components";
import { useSalesManagement } from "@/features/sales/composables";
import { useRewardCalculation } from "@/features/rewards/composables";
import type { Sale } from "@/features/sales/types";
import type { RewardStrategy } from "@/features/rewards/types";
import { useRouter } from "vue-router";
import { PhCalculator, PhArrowLeft } from "@phosphor-icons/vue";
import { useIconSizes } from "@/shared/composables";

export default defineComponent({
  name: "RewardsPage",
  components: {
    Navbar,
    RewardCalculator,
    EmptyState,
    SalesRewardsTable,
    EditSaleModal,
    PhCalculator,
    PhArrowLeft,
  },
  setup() {
    const { md, xs } = useIconSizes();
    const router = useRouter();

    // Use composables for separated concerns
    const salesManagement = useSalesManagement();
    const rewardCalculation = useRewardCalculation();

    // Compute combined loading state
    const loading = computed(
      () => salesManagement.loading.value || rewardCalculation.loading.value
    );

    // Sales loading state for modal
    const salesLoading = computed(() => salesManagement.loading.value);

    // Sync sales data when fetched
    watch(
      () => salesManagement.sales.value,
      (newSales) => {
        if (newSales.length > 0 && rewardCalculation.calculatedRewards.value.length === 0) {
          rewardCalculation.setSales(newSales);
        }
      }
    );

    const handleCalculate = async (strategy: RewardStrategy) => {
      await rewardCalculation.calculateRewards(strategy);
    };

    const handleEditSale = (sale: Sale) => {
      salesManagement.openEditModal(sale);
    };

    const handleEditSubmit = async (updates: { price: number; customerSatisfaction: number }) => {
      const saleId = salesManagement.selectedSale.value?.id;
      await salesManagement.updateSale(updates);

      // Update reward calculation if active
      if (saleId) {
        rewardCalculation.updateLocalSale(saleId, updates);
      }
    };

    const handleDeleteSale = async (saleId: string) => {
      const deleted = await salesManagement.deleteSale(saleId);

      // Only remove from reward calculation if deletion succeeded
      if (deleted) {
        rewardCalculation.removeLocalSale(saleId);
      }
    };

    const goToRegister = () => {
      router.push("/register");
    };

    onMounted(() => {
      salesManagement.fetchSales();
    });

    return {
      // Icon sizes
      md,
      xs,

      // From reward calculation
      hasSales: rewardCalculation.hasSales,
      hasRewards: rewardCalculation.hasRewards,
      calculatedRewards: rewardCalculation.calculatedRewards,
      totalReward: rewardCalculation.totalReward,
      selectedStrategy: rewardCalculation.selectedStrategy,

      // From sales management
      editModalVisible: salesManagement.editModalVisible,
      selectedSale: salesManagement.selectedSale,

      // Loading states
      loading,
      salesLoading,

      // Handlers
      handleCalculate,
      handleEditSale,
      handleEditCancel: salesManagement.closeEditModal,
      handleEditSubmit,
      handleDeleteSale,
      goToRegister,
    };
  },
});
</script>
