<template>
  <form @submit.prevent="handleSubmit" class="p-8 md:p-6" novalidate>
    <div class="form-field-wrapper">
      <label class="form-label-custom">Insurance Type</label>
      <CustomDropdown
        v-model="formData.insuranceType"
        :options="insuranceTypeOptions"
        placeholder="Select insurance type"
        @update:modelValue="handleInsuranceTypeChange"
      />
      <span v-if="validation.errors.insuranceType" class="error-text-custom">
        {{ validation.errors.insuranceType }}
      </span>
    </div>

    <FormField
      id="price"
      v-model="formData.price"
      label="Price"
      type="number"
      placeholder="Enter sale price"
      :step="100"
      :disabled="disabled"
      :error="validation.errors.price"
      @blur="handlePriceBlur"
      @input="handlePriceInput"
    />

    <div class="form-field-wrapper">
      <label class="form-label-custom">Customer Satisfaction</label>
      <CustomDropdown
        v-model="formData.satisfaction"
        :options="satisfactionOptions"
        placeholder="Select satisfaction level"
        @update:modelValue="handleSatisfactionChange"
      />
      <span v-if="validation.errors.satisfaction" class="error-text-custom">
        {{ validation.errors.satisfaction }}
      </span>
    </div>

    <FormField
      id="date"
      v-model="formData.date"
      label="Sale Date"
      type="date"
      :disabled="disabled"
      :error="validation.errors.date"
      @blur="handleDateBlur"
      @input="handleDateChange"
    />

    <button type="submit" class="btn-primary w-full mt-4" :disabled="disabled">
      {{ disabled ? "Submitting..." : "Register Sale" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { CustomDropdown, FormField } from "@/shared/components";
import { useFormValidation } from "@/shared/composables";
import { INSURANCE_TYPE_OPTIONS, SATISFACTION_OPTIONS } from "@/features/sales/constants";

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  submit: [
    formData: {
      insuranceType: string;
      price: number;
      satisfaction: number | undefined;
      date: string;
    }
  ];
}>();

const insuranceTypeOptions = INSURANCE_TYPE_OPTIONS;
const satisfactionOptions = SATISFACTION_OPTIONS;

const formData = reactive<{
  insuranceType: string;
  price: number;
  satisfaction: number | undefined;
  date: string;
}>({
  insuranceType: "",
  price: 0,
  satisfaction: undefined,
  date: new Date().toISOString().split("T")[0]!,
});

const validation = useFormValidation();

// Validation handlers
const handleInsuranceTypeChange = () => {
  validation.validateInsuranceType(formData.insuranceType);
};

const handlePriceInput = () => {
  // Clear error on input to provide immediate feedback
  if (validation.errors.price) {
    validation.clearError("price");
  }
};

const handlePriceBlur = () => {
  validation.validatePrice(formData.price);
};

const handleSatisfactionChange = () => {
  validation.validateSatisfaction(formData.satisfaction);
};

const handleDateChange = () => {
  validation.validateDate(formData.date);
};

const handleDateBlur = () => {
  validation.validateDate(formData.date);
};

const handleSubmit = () => {
  // Validate entire form before submission
  const isValid = validation.validateForm(formData);

  if (!isValid) {
    return; // Don't submit if validation fails
  }

  emit("submit", { ...formData });
  resetForm();
};

const resetForm = () => {
  formData.insuranceType = "";
  formData.price = 0;
  formData.satisfaction = undefined;
  formData.date = new Date().toISOString().split("T")[0]!;
  validation.clearAllErrors();
};
</script>

<style scoped>
/* Custom styles for dropdown wrappers (since they don't use FormField) */
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
