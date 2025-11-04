<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="p-8 max-w-2xl mx-auto">
        <div
          class="bg-white rounded-2xl overflow-visible shadow-md"
        >
          <div
            class="card-header rounded-2xl rounded-b-none"
          >
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold">Register New Sale</h2>
            <p class="text-base md:text-lg lg:text-xl opacity-90">
              Add your insurance sale details
            </p>
          </div>

          <SaleForm @submit="handleSaleSubmit" :disabled="loading" />
        </div>
        <!-- To Rewards button -->
        <div v-if="!loading" class="mt-8">
          <button @click="goToRewards" class="btn-accent flex items-center gap-2">
            Go to Rewards
            <PhArrowRight :size="xs" class="icon-white" weight="bold" />
          </button>
        </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Navbar } from "@/shared/layout";
import { SaleForm } from "@/features/sales/components";
import { salesApi } from "@/api";
import { useSnackbar } from "@/shared/composables";
import { validateSaleData } from "@/utils";
import type { SaleFormData } from "@/features/sales/types";
import { uuid } from "vue-uuid";
import { useRouter } from "vue-router";
import { PhArrowRight } from "@phosphor-icons/vue";
import { useIconSizes } from "@/shared/composables";

export default defineComponent({
  name: "RegisterSalePage",
  components: {
    Navbar,
    SaleForm,
    PhArrowRight,
  },
  setup() {
    const loading = ref(false);
    const snackbar = useSnackbar();
    const router = useRouter();
    const { xs } = useIconSizes();

    const goToRewards = () => {
      router.push("/rewards");
    };

    const handleSaleSubmit = async (saleData: SaleFormData) => {
      // Validate input before submitting
      const validation = validateSaleData({
        insuranceType: saleData.insuranceType,
        price: saleData.price,
        satisfaction: saleData.satisfaction,
        date: saleData.date,
      });

      if (!validation.valid) {
        snackbar.error(validation.errors[0] || "Invalid form data");
        return;
      }

      // After validation, satisfaction is guaranteed to be a number
      if (saleData.satisfaction === undefined) {
        snackbar.error("Customer satisfaction is required");
        return;
      }

      loading.value = true;

      try {
        const payload = {
          id: uuid.v1(),
          saleType: saleData.insuranceType,
          price: saleData.price,
          customerSatisfaction: saleData.satisfaction,
          saleDate: new Date(saleData.date).toISOString(),
        };

        await salesApi.createSale(payload);

        snackbar.success("Sale registered successfully!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred while registering the sale";
        snackbar.error(errorMessage);
        console.error("Error registering sale:", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      // Icon sizes
      xs,

      // Loading states
      loading,

      // Handlers
      handleSaleSubmit,
      goToRewards,
    };
  },
});
</script>
