<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style="z-index: var(--z-index-modal-backdrop)"
      @click="handleCancel"
    >
      <div class="bg-white rounded-2xl max-w-[500px] w-full shadow-xl overflow-visible" @click.stop>
        <div class="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 m-0">Edit Sale</h3>
          <button class="icon-btn" @click="handleCancel" aria-label="Close">
            <PhX :size="xs" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8" novalidate>
          <FormField
            id="edit-price"
            v-model="formData.price"
            label="Sales Price"
            type="number"
            placeholder="Enter sales price"
            :step="100"
            :disabled="loading"
            :error="validation.errors.price"
            @blur="handlePriceBlur"
            @input="handlePriceInput"
          />

          <div class="form-field-wrapper">
            <label class="form-label-custom"> Customer Satisfaction </label>
            <CustomDropdown
              v-model="formData.customerSatisfaction"
              :options="satisfactionOptions"
              placeholder="Select satisfaction level"
              @update:modelValue="handleSatisfactionChange"
            />
            <span v-if="validation.errors.satisfaction" class="error-text-custom">
              {{ validation.errors.satisfaction }}
            </span>
          </div>

          <div class="flex gap-4 px-8 py-6 bg-gray-50 justify-end -mx-8 -mb-8 mt-6">
            <button type="button" class="btn-secondary" @click="handleCancel" :disabled="loading">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="!isFormValid || loading">
              {{ loading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import type { Sale } from "@/features/sales/types";
import { CustomDropdown, FormField } from "@/shared/components";
import { useFormValidation, useIconSizes } from "@/shared/composables";
import { SATISFACTION_OPTIONS } from "@/features/sales/constants";
import { PhX } from "@phosphor-icons/vue";

export default defineComponent({
  name: "EditSaleModal",
  components: {
    PhX,
    CustomDropdown,
    FormField,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    sale: {
      type: Object as () => Sale | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["submit", "cancel"],
  setup(props, { emit }) {
    const { xs } = useIconSizes();
    const satisfactionOptions = SATISFACTION_OPTIONS;

    const formData = ref({
      price: 0,
      customerSatisfaction: 3,
    });

    const validation = useFormValidation();

    const isFormValid = computed(() => {
      // Form is valid if there are no validation errors and fields have valid values
      return (
        !validation.errors.price &&
        !validation.errors.satisfaction &&
        formData.value.price > 0 &&
        formData.value.customerSatisfaction >= 1 &&
        formData.value.customerSatisfaction <= 5
      );
    });

    // Watch for sale changes and populate form
    watch(
      () => props.sale,
      (newSale) => {
        if (newSale) {
          formData.value = {
            price: newSale.price,
            customerSatisfaction: newSale.customerSatisfaction,
          };
          // Clear validation errors when opening with new data
          validation.clearAllErrors();
        }
      },
      { immediate: true }
    );

    const handlePriceInput = () => {
      if (validation.errors.price) {
        validation.clearError("price");
      }
    };

    const handlePriceBlur = () => {
      validation.validatePrice(formData.value.price);
    };

    const handleSatisfactionChange = () => {
      validation.validateSatisfaction(formData.value.customerSatisfaction);
    };

    const handleSubmit = () => {
      // Validate price and satisfaction
      const isPriceValid = validation.validatePrice(formData.value.price);
      const isSatisfactionValid = validation.validateSatisfaction(
        formData.value.customerSatisfaction
      );

      if (isPriceValid && isSatisfactionValid) {
        emit("submit", {
          price: formData.value.price,
          customerSatisfaction: formData.value.customerSatisfaction,
        });
      }
    };

    const handleCancel = () => {
      validation.clearAllErrors();
      emit("cancel");
    };

    return {
      xs,
      formData,
      validation,
      isFormValid,
      satisfactionOptions,
      handlePriceInput,
      handlePriceBlur,
      handleSatisfactionChange,
      handleSubmit,
      handleCancel,
    };
  },
});
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-enter-active > div {
  transition: all 0.3s var(--ease-smooth);
}

.modal-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Custom styles for dropdown wrapper (since it doesn't use FormField) */
.form-field-wrapper {
  margin-bottom: 1.5rem;
}

.form-field-wrapper:last-child {
  margin-bottom: 0;
}

.form-label-custom {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.error-text-custom {
  display: block;
  color: var(--color-error);
  font-size: var(--text-lg);
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

@media (max-width: 768px) {
  .error-text-custom {
  font-size: var(--text-sm);
  }
}
</style>
