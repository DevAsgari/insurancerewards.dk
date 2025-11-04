<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main
      class="p-8 max-w-7xl mx-auto flex justify-center items-center lg:p-30 md:p-15 sm:p-10"
    >
      <div
        class="bg-white rounded-2xl max-w-4xl w-full text-center shadow-md p-8"
      >
        <div
          class="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-brand-from/20 to-brand-to/20 rounded-full flex items-center justify-center"
        >
          <PhStar :size="md" class="icon-decor" weight="fill" />
        </div>

        <h1
          class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight"
        >
          Boost Your Sales Performance
        </h1>

        <p
          class="text-sm md:text-base lg:text-lg text-gray-500 leading-relaxed mb-10 max-w-[700px] mx-auto"
        >
          Unlock your earning potential with Insurance Rewards. Track every sale, analyze
          performance metrics, and watch your sales grow with this reward system.
        </p>

        <router-link
          to="/register"
          class="btn-primary text-sm md:text-base lg:text-lg w-full"
        >
          Register Sale
        </router-link>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useIconSizes } from "@/shared/composables";
import { Navbar } from "@/shared/layout";
import { PhStar } from "@phosphor-icons/vue";

export default defineComponent({
  name: "HomePage",
  components: {
    Navbar,
    PhStar,
  },
  setup() {
    const { md } = useIconSizes();

    return {
      md,
    };
  },
});
</script>
