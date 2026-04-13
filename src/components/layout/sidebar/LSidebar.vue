<template>
<aside 
    class="w-[280px] bg-white border border-gray-200 border-t-0 h-full -mt-[80px] fixed scrollable-y-auto transition-transform duration-300 ease-in-out z-[99]"
    :class="{ '-translate-x-full': sidebarStore.isCollapsed }"
  >
    <div class="h-[80px] flex items-center mb-5 px-[25px]">
      <div class="flex items-center">
        <RouterLink to="/" class="mt-2.5">
          <LogoEPOQ class="h-[35px] w-auto" />
        </RouterLink>
        <div class="ml-2">
          <img src="@/assets/TMS.png" class="h-[35px] w-max" alt="" />
        </div>
      </div>
    </div>

    <div class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5" data-menu="true">
      <div v-for="menu in filteredSidebarMenu" :key="menu.id" class="menu-item" data-menu-item-placement=""
        data-menu-item-toggle="accordion" data-menu-item-trigger="click">
        <a class="menu-link" href="#" :class="{ 'menu-link--active': isMenuActive(menu) }" @click.prevent="redirectTo(menu.to)">
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
import sidebarMenu from '@/static/sidebar'
import { useRouter, useRoute } from 'vue-router'

// import LogoAN from '@/assets/svg/LogoAN.vue'
import LogoEPOQ from '@/assets/svg/EvoxLogo.vue'
import { computed } from 'vue'
import { useLoginStore } from '@/stores/views/login'
import { useSidebarStore } from '@/stores/sidebar'
import { isEmpty } from 'lodash'

const router = useRouter()
const route = useRoute()
const userStore = useLoginStore()
const sidebarStore = useSidebarStore()

const isSubMenuActive = (path?: string) => {
  return route.name === path
}

const isMenuActive = (menu: any) => {
  if (menu.to && route.name === menu.to) return true
  if (menu.child?.length > 0) {
    return menu.child.some((child: any) => route.name === child.to)
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

const filteredSidebarMenu = computed(() => {
  if (!isEmpty(userStore.userData)) {
    if (userStore.userData?.profile.profileId === 3001) {
      return sidebarMenu
        .filter((menu) => menu.id === 'e-invoice' || menu.id === 'dashboard')
        .map((menu) => {
          return {
            ...menu,
            child: menu.child ? menu.child.filter((child) => child.id === 'invoice-list') : [],
          }
        })
    }

    // Sementara Buka Sidebar
    if (
      userStore.userData?.profile.profileId === 3002 ||
      userStore.userData?.profile.profileId === 3003
    ) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' || menu.id === 'vendor-management' || menu.id === 'dashboard',
        )
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-list' ||
                  child.id === 'invoice-list-non-po' ||
                  child.id === 'invoice-verification' ||
                  child.id === 'invoice-approval-no-po' ||
                  child.id === 'recurring-invoice-reminder' ||
                  child.id === 'vendor-master',
                // child.id === 'invoice-verification-no-po' ||
                // child.id === 'invoice-list-non-po',
              )
              : [],
          }
        })
    }

    // Sidebar Asli 3002

    // if (
    //   userStore.userData?.profile.profileId === 3002 ||
    //   userStore.userData?.profile.profileId === 3003
    // ) {
    //   return sidebarMenu
    //     .filter((menu) => menu.id === 'e-invoice' || menu.id === 'vendor-management' || menu.id === 'dashboard')
    //     .map((menu) => {
    //       return {
    //         ...menu,
    //         child: menu.child
    //           ? menu.child.filter((child) => child.id === 'invoice-verification' || child.id === 'invoice-approval-no-po' || child.id === 'vendor-master')
    //           : [],
    //       }
    //     })
    // }

    if (userStore.userData?.profile.profileId === 3004) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' || menu.id === 'vendor-management' || menu.id === 'dashboard',
        )
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-approval' ||
                  child.id === 'invoice-approval-no-po' ||
                  child.id === 'recurring-invoice-reminder' ||
                  child.id === 'vendor-master',
              )
              : [],
          }
        })
    }

    if (
      userStore.userData?.profile?.vendorCode &&
      userStore.userData?.profile?.profileId === 3200
    ) {
      return sidebarMenu
        .filter((menu) => menu.id === 'dashboard' || menu.id === 'e-invoice')
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter((child) => child.id === 'invoice-list-non-po')
              : [],
          }
        })
    }

    if (userStore.userData?.profile?.vendorCode) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'dashboard' || menu.id === 'e-invoice' || menu.id === 'vendor-management',
        )

        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-list' ||
                  child.id === 'invoice-list-non-po' ||
                  child.id === 'recurring-invoice-reminder' ||
                  child.id === 'vendor-detail',
              )
              : [],
          }
        })
    }

    if (userStore.userData?.profile?.profileId === 3192) {
      return sidebarMenu
        .filter((menu) => menu.id !== 'company-information')
        .map((menu) => ({
          ...menu,
          child: menu.child
            ? menu.child.filter(
              (child) => child.id !== 'vendor-approval' && child.id !== 'vendor-verification',
            )
            : [],
        }))
    }

    if (userStore.userData?.profile?.profileId === 3132) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id !== 'company-information' &&
            menu.id !== 'e-invoice' &&
            menu.id !== 'userManagement',
        )
        .map((menu) => ({
          ...menu,
          child: menu.child ? menu.child.filter((child) => child.id !== 'vendor-blacklist') : [],
        }))
    }

    // non po
    if (
      userStore.userData?.profile.profileId === 3029 ||
      userStore.userData?.profile.profileId === 3075 ||
      userStore.userData?.profile.profileId === 3036 ||
      userStore.userData?.profile.profileId === 3066 ||
      userStore.userData?.profile.profileId === 3030 ||
      userStore.userData?.profile.profileId === 3089 ||
      userStore.userData?.profile.profileId === 3028 ||
      userStore.userData?.profile.profileId === 3193 ||
      userStore.userData?.profile.profileId === 3194
    ) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' || menu.id === 'vendor-management' || menu.id === 'dashboard',
        )
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-verification-no-po' ||
                  child.id === 'vendor-master' ||
                  child.id === 'vendor-verification' ||
                  child.id === 'vendor-approval',
              )
              : [],
          }
        })
    }
    if (
      userStore.userData?.profile.profileId === 3201 ||
      userStore.userData?.profile.profileId === 3202
    ) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' || menu.id === 'vendor-management' || menu.id === 'dashboard',
        )
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) => child.id === 'invoice-approval-no-po' || child.id === 'vendor-master',
              )
              : [],
          }
        })
    }
    if (userStore.userData?.profile?.profileId === 3200) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' ||
            menu.id === 'vendor-management' ||
            menu.id === 'dashboard' ||
            menu.id === 'analytic-dashboard' ||
            menu.id === 'digital-receiving-confirmation' ||
            menu.id === 'tax-reconciliation' ||
            menu.id === 'userManagement' ||
            menu.id === 'workflow-configuration' ||
            menu.id === 'system-integration' ||
            menu.id === 'system-configuration',
        )
        .map((menu) => {
          // Untuk workflow-configuration dan system-integration, jangan filter child
          if (
            menu.id === 'workflow-configuration' ||
            menu.id === 'system-integration' ||
            menu.id === 'system-configuration'
          ) {
            return { ...menu }
          }
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'vendor-master' ||
                  child.id === 'invoice-list' ||
                  child.id === 'invoice-list-non-po' ||
                  child.id === 'ftp-invoice-integration' ||
                  child.id === 'scorecard-performance' ||
                  child.id === 'invoiceAnalytic' ||
                  child.id === 'taxAnalytic' ||
                  child.id === 'email-invoice-integration' ||
                  child.id === 'receiving-confirmation' ||
                  child.id === 'receiving-confirmation-list' ||
                  child.id === 'delivery-notes' ||
                  child.id === 'delivery-notes-list' ||
                  child.id === 'vat-reconciliation' ||
                  child.id === 'wht-unifikasi' ||
                  child.id === 'wht-pasal-21' ||
                  child.id === 'invoice-type' ||
                  child.id === 'list-user' ||
                  child.id === 'master-profile' ||
                  child.id === 'master-role' ||
                  child.id === 'master-employee' ||
                  child.id === 'master-menu' ||
                  child.id === 'report-user-authorization' ||
                  child.id === 'erp-integration' ||
                  child.id === 'activity-expenses' ||
                  child.id === 'invoice-configuration' ||
                  child.id === 'cash-advance' ||
                  child.id === 'recurring-invoice-reminder'
              )
              : [],
          }
        })
    }
  }

  return sidebarMenu
    .filter((menu) => menu.id !== 'company-information' && menu.id !== 'vendor-tender')
    .map((menu) => ({
      ...menu,
      child: menu.child ? menu.child.filter((child) => child.id !== 'vendor-blacklist') : [],
    }))
})
</script>

<style lang="scss">
/* ──── Sidebar menu ──── */
.menu-default .menu-link {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background-color: #f0fdfa !important;

    .menu-title { color: #14B8A6 !important; }
    .menu-icon i { color: #14B8A6 !important; }
  }

  &.menu-link--active {
    background-color: #f0fdfa !important;

    .menu-title { color: #14B8A6 !important; font-weight: 600; }
    .menu-icon i { color: #14B8A6 !important; }
  }
}

/* ──── Sub-menu items ──── */
.menu-sub-accordion .menu-item .menu-link {
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background-color: #f0fdfa !important;
    .menu-title { color: #14B8A6 !important; }
  }

  &.menu-link--active {
    background-color: #f0fdfa !important;

    .menu-title {
      color: #14B8A6 !important;
      font-weight: 600;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background-color: #14B8A6;
        border-radius: 2px;
      }
    }
  }
}

/* ──── Icon size ──── */
.menu-icon i {
  font-size: 20px;
  margin-right: 12px;
}
</style>
