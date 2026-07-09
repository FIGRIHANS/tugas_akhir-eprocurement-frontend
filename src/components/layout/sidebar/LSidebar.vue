<template>
  <aside
    class="w-[280px] bg-white border border-gray-200 border-t-0 h-screen top-0 fixed scrollable-y-auto transition-[transform,z-index] duration-300 ease-in-out z-[99]"
    :class="{
      '-translate-x-full': sidebarStore.isCollapsed,
      'sidebar--behind-modal': isAnyModalOpen,
    }"
  >
    <div class="h-[80px] flex items-center mb-5 px-[25px]">
      <div class="flex items-center">
        <RouterLink to="/" class="mt-2.5">
          <LogoEPOQ height="35px" />
        </RouterLink>
      </div>
    </div>

    <div
      class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5"
      data-menu="true"
    >
      <div
        v-for="menu in filteredSidebarMenu"
        :key="menu.id"
        class="menu-item"
        :class="{ show: isMenuActive(menu) }"
        data-menu-item-placement=""
        data-menu-item-toggle="accordion"
        data-menu-item-trigger="click"
      >
        <a
          class="menu-link"
          href="#"
          :class="{ 'menu-link--active': isMenuActive(menu) }"
          @click.prevent="redirectTo(menu.to)"
        >
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
            <a
              class="menu-link"
              href="#"
              :class="{ 'menu-link--active': isSubMenuActive(subMenu.to) }"
              @click.prevent="redirectTo(subMenu.to)"
            >
              <span class="menu-title">{{ subMenu.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { useGlobalModalState } from '@/composables/useGlobalModalState'

// import LogoAN from '@/assets/svg/LogoAN.vue'
import LogoEPOQ from '@/assets/svg/EvoxLogo.vue'
import { computed } from 'vue'
import { useLoginStore } from '@/stores/views/login'
import { useSidebarStore } from '@/stores/sidebar'
import { getFilteredSidebarMenu } from '@/core/utils/menuAccess'

type MenuItem = {
  id?: string
  to?: string
  title?: string
  icon?: string
  child?: MenuItem[]
}

const router = useRouter()
const route = useRoute()
const userStore = useLoginStore()
const sidebarStore = useSidebarStore()
const { isAnyModalOpen } = useGlobalModalState()

// Matches exact route OR any child route (detail/create pages)
// e.g. 'whtPasal21' also matches 'whtPasal21Detail', 'whtPasal21Create'
// Matches exact route OR common detail/create suffixes for that route
const isSubMenuActive = (path?: string) => {
  if (!path) return false
  const currentName = String(route.name ?? '')
  const suffixes = ['Detail', 'Create', 'Edit']
  return currentName === path || suffixes.some((s) => currentName === path + s)
}

const isMenuActive = (menu: MenuItem) => {
  if (menu.to) {
    if (isSubMenuActive(menu.to)) return true
  }
  if (menu.child?.length > 0) {
    return menu.child.some((child: MenuItem) => isSubMenuActive(child.to))
  }
  return false
}

const redirectTo = (path?: string) => {
  if (path) {
    router.push({
      name: path,
    })
  }
}

const filteredSidebarMenu = computed(() => getFilteredSidebarMenu(userStore.userData))
</script>

<style lang="scss">
.menu-default .menu-item > .menu-link {
  padding: 10px 16px;
  margin: 4px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  background-color: transparent;
  position: relative;

  // Normal state
  .menu-title {
    color: #4b5563;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  .menu-icon i {
    color: #9ca3af;
    transition: all 0.2s ease;
  }
  .menu-arrow i {
    color: #9ca3af;
    transition: color 0.2s ease;
  }

  // Hover state (non-active)
  &:hover:not(.menu-link--active) {
    background-color: #f8fafc !important;

    .menu-title {
      color: #0d9488 !important;
    }
    .menu-icon i {
      color: #0d9488 !important;
      transform: translateX(2px);
    }
    .menu-arrow i {
      color: #0d9488 !important;
    }

    // Minimal side indicator
    &::before {
      content: '';
      position: absolute;
      inset-inline-start: 0;
      inset-block-start: 50%;
      transform: translateY(-50%);
      block-size: 16px;
      inline-size: 3px;
      background-color: #0d9488;
      border-radius: 0 4px 4px 0;
    }
  }

  // Active state: The "Floating Pill"
  &.menu-link--active {
    background-color: #f0fdfa !important;

    .menu-title {
      color: #0d9488 !important;
      font-weight: 600;
    }
    .menu-icon i {
      color: #0d9488 !important;
    }
    .menu-arrow i {
      color: #0d9488 !important;
    }

    &:hover {
      background-color: #ccfbf1 !important;
    }
  }
}

// Sub-menu specific styling
.menu-sub-accordion .menu-item .menu-link,
.menu-accordion .menu-item > .menu-link {
  padding-inline-start: 48px;
  margin: 2px 12px;
  border-radius: 8px;
  font-size: 0.9em;
  position: relative;
  transition: all 0.2s ease;

  // Normal state
  .menu-title {
    color: #6b7280;
    transition: color 0.2s ease;
  }

  // Hover state (non-active)
  &:hover:not(.menu-link--active) {
    background-color: #f1f5f9 !important;
    .menu-title {
      color: #0d9488 !important;
      font-weight: 500;
    }
  }

  // Active state
  &.menu-link--active {
    background-color: transparent !important;

    .menu-title {
      color: #0d9488 !important;
      font-weight: 600;
    }

    // Static dot indicator for minimalism
    &::before {
      content: '';
      position: absolute;
      inset-inline-start: 32px;
      inset-block-start: 50%;
      transform: translateY(-50%);
      inline-size: 4px;
      block-size: 4px;
      border-radius: 50%;
      background-color: #0d9488;
    }

    &:hover {
      background-color: #ccfbf1 !important;
    }
  }
}

.menu-icon i {
  font-size: 18px;
  margin-inline-end: 12px;
  inline-size: 24px;
  text-align: center;
}

.menu-accordion {
  padding-inline-start: 0;
}

.menu-arrow i {
  font-size: 12px;
}

.sidebar--behind-modal {
  z-index: 30 !important;
}
</style>
