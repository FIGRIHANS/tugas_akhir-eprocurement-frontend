<template>
  <header class="w-full bg-white border border-gray-200">
    <div class="flex justify-center">
      <nav
        class="flex lg:w-[1440px] justify-between items-center py-[20px] px-[40px]"
        :class="{ full: isFull }"
      >
        <div class="logo">
          <RouterLink to="/">
            <UiLogo />
          </RouterLink>
        </div>

        <div class="flex items-center gap-3.5">
          <LNavbarMenu />
          <LNavbarProfile />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { INavbarProps } from './types/navbar'
import { useNavbarUtilsStore } from '@/stores/navbar'

/**Layout components */
import LNavbarMenu from './LNavbar/LNavbarMenu.vue'
import LNavbarProfile from './LNavbar/LNavbarProfile.vue'

/**Atoms components */
import UiLogo from '@/components/ui/atoms/logo/UiLogo.vue'

const props = withDefaults(defineProps<INavbarProps>(), {
  full: false,
})

/**SECTION - Navbar utils */
const navbarUtils = useNavbarUtilsStore()
const isFull = computed(() => navbarUtils.isFull || props.full)
/**!SECTION */
</script>

<style lang="scss" scoped>
@use './styles/navbar.scss';
</style>
