<template>
  <aside
    class="w-[280px] bg-white border border-gray-200 border-t-0 h-full -mt-[80px] fixed scrollable-y-auto"
  >
    <div class="h-[80px] flex items-center mb-5 px-[25px]">
      <RouterLink to="/dashboard">
        <LogoAN class="w-[83px]" />
      </RouterLink>
    </div>

    <div
      class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5"
      data-menu="true"
    >
      <div
        v-for="menu in filteredSidebarMenu"
        :key="menu.id"
        class="menu-item"
        data-menu-item-placement=""
        data-menu-item-toggle="accordion"
        data-menu-item-trigger="click"
      >
        <a class="menu-link" href="#" @click.prevent="redirectTo(menu.to)">
          <span class="menu-icon">
            <i class="ki-duotone" :class="`ki-${menu.icon}`"> </i>
          </span>
          <span class="menu-title"> {{ menu.title }} </span>
          <span v-if="menu.child.length > 0" class="menu-arrow">
            <i class="ki-outline ki-plus menu-item-show:hidden"> </i>
            <i class="ki-outline ki-minus hidden menu-item-show:block"> </i>
          </span>
        </a>
        <div v-if="menu.child.length > 0" class="menu-accordion">
          <div v-for="subMenu in menu.child" :key="subMenu.id" class="menu-item">
            <a class="menu-link" href="#" @click.prevent="redirectTo(subMenu.to)">
              <span class="menu-title">{{ subMenu.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import sidebarMenu from '@/static/sidebar'
import { useRouter } from 'vue-router'

import LogoAN from '@/assets/svg/LogoAN.vue'
import { computed } from 'vue'
import { useLoginStore } from '@/stores/views/login'

const router = useRouter()
const userStore = useLoginStore()

const redirectTo = (path?: string) => {
  if (path) {
    router.push({
      name: path,
    })
  }
}

const filteredSidebarMenu = computed(() => {
  if (userStore.userData?.profile.vendorCode) {
    return sidebarMenu.filter(
      (menu) => menu.id !== 'vendor-management' && menu.id !== 'userManagement',
    )
  }

  return sidebarMenu
})
</script>

<style lang="scss" scoped>
@use './styles/sidebar.scss';
</style>
