<template>
  <nav
    class="bg-white shadow-sm px-8 py-4 sticky top-0 lg:px-6 md:px-4"
    style="z-index: var(--z-navigation)"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="max-w-7xl mx-auto flex justify-between items-center relative">
      <router-link
        to="/"
        class="flex items-center gap-3 no-underline"
        style="z-index: var(--z-index-fixed)"
        @click="closeMobileMenu"
      >
        <PhStar :size="md" class="icon-decor" weight="fill" />
        <span class="text-2xl md:text-2xl lg:text-2xl font-semibold logo-text"
          >Insurance Rewards</span
        >
      </router-link>

      <button
        type="button"
        class="lg:hidden icon-btn p-2"
        style="z-index: var(--z-index-fixed)"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
        :aria-expanded="isMobileMenuOpen"
      >
        <PhList v-if="!isMobileMenuOpen" :size="sm" weight="bold" />
        <PhX v-else :size="sm" weight="bold" />
      </button>

      <!-- Desktop navigation - always visible on large screens -->
      <div class="hidden lg:flex gap-2 items-center">
        <router-link
          to="/"
          class="nav-link flex items-center gap-2 lg:text-xl"
        >
          <PhHouseSimple :size="md" />
          Home
        </router-link>

        <router-link
          to="/register"
          class="nav-link flex items-center gap-2 lg:text-xl"
        >
          <PhPlusCircle :size="md" />
          Register Sale
        </router-link>

        <router-link
          to="/rewards"
          class="nav-link flex items-center gap-2 lg:text-xl"
        >
          <PhGift :size="md" />
          Reward
        </router-link>
      </div>

      <!-- Mobile navigation - toggle visibility -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl mt-4 flex flex-col"
        style="z-index: var(--z-index-dropdown)"
      >
        <router-link
          to="/"
          class="nav-link flex items-center gap-2 border-b border-gray-100 last:border-b-0"
          @click="closeMobileMenu"
        >
          <PhHouseSimple :size="xs" />
          Home
        </router-link>
        <router-link
          to="/register"
          class="nav-link flex items-center gap-2 border-b border-gray-100 last:border-b-0"
          @click="closeMobileMenu"
        >
          <PhPlusCircle :size="xs" />
          Register Sale
        </router-link>
        <router-link
          to="/rewards"
          class="nav-link flex items-center gap-2 border-b border-gray-100 last:border-b-0"
          @click="closeMobileMenu"
        >
          <PhGift :size="xs" />
          Reward
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { PhX, PhHouseSimple, PhGift, PhPlusCircle, PhStar, PhList } from "@phosphor-icons/vue";
import { useIconSizes } from "@/shared/composables";

export default defineComponent({
  name: "Navbar",
  components: {
    PhX,
    PhHouseSimple,
    PhGift,
    PhPlusCircle,
    PhStar,
    PhList,
  },
  setup() {
    const { xs, sm, md } = useIconSizes();
    const isMobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    return {
      xs,
      sm,
      md,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
});
</script>

<style scoped>
/* Navigation link styles */
.nav-link {
  color: var(--color-gray-500);
  text-decoration: none;
  transition: color var(--transition-normal);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.nav-link :deep(svg) {
  color: var(--color-gray-500);
  transition: color var(--transition-normal);
}

.nav-link:hover {
  color: var(--color-gray-900);
  background: var(--color-gray-100);
}

.nav-link.router-link-active {
  color: var(--color-brand-purple);
  font-weight: 600;
}

.nav-link.router-link-active :deep(svg) {
  color: var(--color-brand-purple);
}

.logo-text {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
