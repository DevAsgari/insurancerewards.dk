<template>
  <div class="bg-white rounded-2xl px-8 py-16 text-center shadow-md md:px-6 md:py-12">
    <div class="w-20 h-20 mx-auto mb-6 text-gray-300">
      <PhTrendUp :size="xxl" />
    </div>
    <p class="text-lg text-gray-500 mb-8">{{ message }}</p>
    <button
      v-if="showButton"
      class="btn-primary"
      @click="$emit('action')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { PhTrendUp } from "@phosphor-icons/vue"
  import { useIconSizes } from '@/shared/composables'

export default defineComponent({
  name: 'EmptyState',
  components: {
    PhTrendUp
  },
  setup() {
    const { xxl } = useIconSizes()

    return {
      xxl
    }
  },
  props: {
    message: {
      type: String,
      default: 'No data available.'
    },
    showButton: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: 'Get Started'
    }
  },
  emits: ['action']
})
</script>

