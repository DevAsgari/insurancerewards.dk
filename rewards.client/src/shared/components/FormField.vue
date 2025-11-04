<template>
  <div class="form-field">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
    </label>

    <input
      v-if="type !== 'textarea'"
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :class="['form-input', error && 'form-input-error']"
      @input="handleInput"
      @blur="handleBlur"
    />

    <textarea
      v-else
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="['form-input', error && 'form-input-error']"
      @input="handleInput"
      @blur="handleBlur"
    />

    <span class="error-text" v-if="error || showErrorSpace">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: "text" | "number" | "date" | "email" | "password" | "tel" | "url" | "textarea";
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  rows?: number;
  showErrorSpace?: boolean; // Always reserve space for error message
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  error: "",
  disabled: false,
  rows: 4,
  showErrorSpace: true,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: Event];
}>();

// Generate unique ID if not provided
const inputId = computed(() => {
  return props.id || `form-field-${Math.random().toString(36).substr(2, 9)}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  let value: string | number = target.value;

  // Convert to number if type is number
  if (props.type === "number" && value !== "") {
    value = parseFloat(value);
  }

  emit("update:modelValue", value);
};

const handleBlur = (event: Event) => {
  emit("blur", event);
};
</script>

<style scoped>
/* Form field wrapper */
.form-field {
  margin-bottom: 1.5rem;
}

.form-field:last-child {
  margin-bottom: 0;
}

/* Form label */
.form-label {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

/* Form input and textarea */
.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: var(--text-lg);
  border: 2px solid var(--color-gray-200);
  border-radius: 0.375rem;
  transition: all var(--transition-normal);
  background: var(--color-white);
  color: var(--color-gray-900);
  outline: none;
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--color-success);
  box-shadow: var(--shadow-focus-accent);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-gray-50);
}

/* Error state */
.form-input-error {
  border-color: var(--color-error);
  background: var(--color-error-subtle);
}

.form-input-error:focus {
  border-color: var(--color-error) !important;
  box-shadow: var(--shadow-focus-error) !important;
}

/* Error text */
.error-text {
  display: block;
  color: var(--color-error);
  font-size: var(--text-lg);
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

@media (max-width: 768px) {
  .error-text {
    font-size: var(--text-sm);
  }
}

/* Textarea specific */
textarea.form-input {
  resize: vertical;
  min-height: 100px;
}
</style>
