<template>
  <aside class="w-[280px] bg-white border border-gray-200 border-t-0 h-full -mt-[80px] fixed">
    <div class="h-[80px] flex items-center mb-5 px-[40px]">
      <RouterLink to="/dashboard">
        <UiLogo />
      </RouterLink>
    </div>

    <div
      class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5"
      data-menu="true"
    >
      <div
        v-for="menu in sidebarMenu"
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

import UiLogo from '@/components/ui/atoms/logo/UiLogo.vue'

const router = useRouter()

const redirectTo = (path?: string) => {
  if (path) {
    router.push(path)
  }
}
</script>

<style lang="scss" scoped>
@use './styles/sidebar.scss';
</style>
