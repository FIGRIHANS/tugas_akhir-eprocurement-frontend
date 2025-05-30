<template>
  <header class="w-full bg-white border border-gray-200">
    <div class="flex justify-center">
      <nav
        class="flex lg:w-[1440px] justify-between items-center py-[20px] px-[40px]"
        :class="{ full: isFull }"
      >
        <div class="logo">
          <RouterLink to="/">
            <LogoAN class="w-[81px] h-auto" />
          </RouterLink>
        </div>

        <div class="flex items-center gap-3.5">
          <LNavbarMenu v-if="route.name !== 'landing-page'" />
          <LNavbarProfile />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { INavbarProps } from './types/navbar'
import { useNavbarUtilsStore } from '@/stores/navbar'

/**Layout components */
import LNavbarMenu from './LNavbar/LNavbarMenu.vue'
import LNavbarProfile from './LNavbar/LNavbarProfile.vue'

/**Atoms components */
// import UiLogo from '@/components/ui/atoms/logo/UiLogo.vue'
import LogoAN from '@/assets/svg/LogoAN.vue'

const props = withDefaults(defineProps<INavbarProps>(), {
  full: false,
})

const route = useRoute()

/**SECTION - Navbar utils */
const navbarUtils = useNavbarUtilsStore()
const isFull = computed(() => navbarUtils.isFull || props.full)
/**!SECTION */
</script>

<style lang="scss" scoped>
@use './styles/navbar.scss';
</style>
