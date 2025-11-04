<template>
  <div class="relative w-full" ref="dropdown">
    <div class="dropdown-trigger" @click="toggleDropdown" tabindex="0">
      <span class="text-gray-900">
        {{ selectedLabel || placeholder }}
      </span>
      <PhCaretDown
        :size="xs"
        :class="['text-gray-500 flex-shrink-0', { 'rotate-180': isOpen }]"
        :style="{ transition: `transform var(--transition-normal)` }"
        weight="bold"
      />
    </div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <div
          v-for="option in options"
          :key="option.value"
          :class="['dropdown-item', modelValue === option.value && 'dropdown-item-active']"
          @click="selectOption(option.value)"
        >
          <h3 class="text-md md:text-base lg:text-lg font-semibold">{{ option.label }}</h3>
          <p
            v-if="option.description"
            :class="['text-sm mt-1 m-0', modelValue === option.value ? 'opacity-95' : 'opacity-80']"
          >
            {{ option.description }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { DropdownOption } from "./dropdown.types";
import { PhCaretDown } from "@phosphor-icons/vue";
import { useIconSizes } from "@/shared/composables";

// Props
interface Props {
  modelValue?: string | number;
  options: DropdownOption[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: "Select an option",
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  change: [value: string | number];
}>();

// Composables
const { xs } = useIconSizes();

// Reactive state
const isOpen = ref(false);
const dropdown = ref<HTMLElement | null>(null);

// Computed
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected?.label;
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value: string | number) => {
  emit("update:modelValue", value);
  emit("change", value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Dropdown trigger button */
.dropdown-trigger {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: var(--text-lg);
  border: 2px solid var(--color-gray-200);
  border-radius: 0.375rem;
  background: var(--color-white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-normal);
}

.dropdown-trigger:hover {
  border-color: var(--color-gray-300);
}

.dropdown-trigger:focus {
  outline: none;
  border-color: var(--color-success);
  box-shadow: var(--shadow-focus-accent);
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--color-white);
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: var(--shadow-dropdown);
  z-index: var(--z-dropdown);
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Dropdown items */
.dropdown-item {
  padding: 0.6rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  border-bottom: 1px solid var(--color-gray-100);
  background: var(--color-white);
}

.dropdown-item:last-child {
  border-bottom: 0;
}

.dropdown-item:first-child {
  border-top: 0;
}

.dropdown-item:hover {
  background: var(--color-gray-50);
}

.dropdown-item.dropdown-item-active:hover {
  background: var(--gradient-accent);
}

.dropdown-item-active {
  background: var(--gradient-accent);
  color: var(--color-white);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .dropdown-item {
    padding: 1rem 1.25rem;
  }
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
