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

    <div class="menu menu-default flex flex-col border-0 rounded-lg w-full py-0 px-1.5" data-menu="true">
      <div v-for="menu in filteredSidebarMenu" :key="menu.id" class="menu-item"
        :class="{ 'show': isMenuActive(menu) }"
        data-menu-item-placement=""
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
import { useGlobalModalState } from '@/composables/useGlobalModalState'

// import LogoAN from '@/assets/svg/LogoAN.vue'
import LogoEPOQ from '@/assets/svg/EvoxLogo.vue'
import { computed } from 'vue'
import { useLoginStore } from '@/stores/views/login'
import { useSidebarStore } from '@/stores/sidebar'
import { isEmpty } from 'lodash'

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
  return currentName === path || suffixes.some(s => currentName === path + s)
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

const filteredSidebarMenu = computed(() => {
  if (!isEmpty(userStore.userData)) {
    // Ensure profileId 3200 always gets full access as configured below.
    if (Number(userStore.userData?.profile?.profileId) === 3200) {
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
              ? menu.child.filter((child) =>
                  [
                    'vendor-master',
                    'invoice-list',
                    'invoice-list-non-po',
                    'ftp-invoice-integration',
                    'scorecard-performance',
                    'invoiceAnalytic',
                    'taxAnalytic',
                    'inboundLogisticAnalytic',
                    'email-invoice-integration',
                    'mock-sap-list',
                    'receiving-confirmation',
                    'receiving-confirmation-list',
                    'delivery-notes',
                    'delivery-notes-list',
                    'goods-receipt-list',
                    'vat-reconciliation',
                    'vat-out-reconciliation',
                    'wht-unifikasi',
                    'wht-pasal-21',
                    'invoice-type',
                    'list-user',
                    'master-profile',
                    'master-role',
                    'master-employee',
                    'master-menu',
                    'report-user-authorization',
                    'erp-integration',
                    'activity-expenses',
                    'invoice-configuration',
                    'cash-advance',
                    'recurring-invoice-reminder',
                  ].includes(child.id),
                )
              : [],
          }
        })
    }
    if (Number(userStore.userData?.profile?.profileId) === 3001) {
      return sidebarMenu
        .filter((menu) => menu.id === 'e-invoice' || menu.id === 'dashboard')
        .map((menu) => {
          return {
            ...menu,
            child: menu.child ? menu.child.filter((child) => child.id === 'invoice-list') : [],
          }
        })
    }

    // Finance AP Officer (3002) — verify only
    if (Number(userStore.userData?.profile?.profileId) === 3002) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' ||
            menu.id === 'vendor-management' ||
            menu.id === 'dashboard' ||
            menu.id === 'tax-reconciliation',
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
                  child.id === 'vendor-master' ||
                  child.id === 'vat-reconciliation' ||
                  child.id === 'vat-out-reconciliation' ||
                  child.id === 'wht-unifikasi' ||
                  child.id === 'wht-pasal-21',
              )
              : [],
          }
        })
    }

    // Accounting & Tax (3003) — 1st approval after verify
    if (Number(userStore.userData?.profile?.profileId) === 3003) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' ||
            menu.id === 'vendor-management' ||
            menu.id === 'dashboard' ||
            menu.id === 'tax-reconciliation',
        )
        .map((menu) => {
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-list' ||
                  child.id === 'invoice-list-non-po' ||
                  child.id === 'invoice-approval' ||
                  child.id === 'invoice-approval-no-po' ||
                  child.id === 'recurring-invoice-reminder' ||
                  child.id === 'vendor-master' ||
                  child.id === 'vat-reconciliation' ||
                  child.id === 'vat-out-reconciliation' ||
                  child.id === 'wht-unifikasi' ||
                  child.id === 'wht-pasal-21',
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

    // Finance AP Supervisor (3004) — 2nd approval
    if (Number(userStore.userData?.profile?.profileId) === 3004) {
      return sidebarMenu
        .filter(
          (menu) =>
            menu.id === 'e-invoice' ||
            menu.id === 'vendor-management' ||
            menu.id === 'dashboard' ||
            menu.id === 'tax-reconciliation',
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
                  child.id === 'vendor-master' ||
                  child.id === 'vat-reconciliation' ||
                  child.id === 'vat-out-reconciliation' ||
                  child.id === 'wht-unifikasi' ||
                  child.id === 'wht-pasal-21',
              )
              : [],
          }
        })
    }

    // ProfileId 3180 — Warehouse Checker (can create RC)
    if (Number(userStore.userData?.profile?.profileId) === 3180) {
      return sidebarMenu
        .filter((menu) => menu.id === 'digital-receiving-confirmation')
        .map((menu) => ({
          ...menu,
          child: menu.child
            ? menu.child.filter(
                (child) =>
                  child.id === 'receiving-confirmation' ||
                  child.id === 'receiving-confirmation-list' ||
                  child.id === 'mock-sap-list',
              )
            : [],
        }))
    }

    // ProfileId 3185 — Warehouse Checker Approver (view + approve only, no create)
    // Inbound analytic lives under analytic-dashboard in sidebar.ts (id inboundLogisticAnalytic), not under DRC.
    if (Number(userStore.userData?.profile?.profileId) === 3185) {
      const inboundAnalyticOnly = sidebarMenu
        .filter((menu) => menu.id === 'analytic-dashboard')
        .map((menu) => ({
          ...menu,
          child: menu.child
            ? menu.child.filter((child) => child.id === 'inboundLogisticAnalytic')
            : [],
        }))
      const digitalReceiving = sidebarMenu
        .filter((menu) => menu.id === 'digital-receiving-confirmation')
        .map((menu) => ({
          ...menu,
          child: menu.child
            ? menu.child.filter(
                (child) =>
                  child.id === 'receiving-confirmation-list' ||
                  child.id === 'mock-sap-list' ||
                  child.id === 'delivery-notes-list',
              )
            : [],
        }))
      return [ ...inboundAnalyticOnly, ...digitalReceiving]
    }

    if (
      userStore.userData?.profile?.vendorCode &&
      Number(userStore.userData?.profile?.profileId) === 3200
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
            menu.id === 'dashboard' ||
            menu.id === 'e-invoice' ||
            menu.id === 'vendor-management' ||
            menu.id === 'digital-receiving-confirmation',
        )

        .map((menu) => {
          if (menu.id === 'digital-receiving-confirmation') {
            return {
              ...menu,
              child: menu.child
                ? menu.child.filter(
                  (child) =>
                    child.id === 'mock-sap-list' ||
                    child.id === 'delivery-notes' ||
                    child.id === 'delivery-notes-list' ||
                    child.id === 'goods-receipt-list',
                )
                : [],
            }
          }
          return {
            ...menu,
            child: menu.child
              ? menu.child.filter(
                (child) =>
                  child.id === 'invoice-list' ||
                  child.id === 'invoice-list-non-po' ||
                  child.id === 'recurring-invoice-reminder' ||
                  child.id === 'vat-out-reconciliation' ||
                  child.id === 'vendor-detail',
              )
              : [],
          }
        })
    }

    if (Number(userStore.userData?.profile?.profileId) === 3192) {
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

    if (Number(userStore.userData?.profile?.profileId) === 3132) {
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
      Number(userStore.userData?.profile?.profileId) === 3029 ||
      Number(userStore.userData?.profile?.profileId) === 3075 ||
      Number(userStore.userData?.profile?.profileId) === 3036 ||
      Number(userStore.userData?.profile?.profileId) === 3066 ||
      Number(userStore.userData?.profile?.profileId) === 3030 ||
      Number(userStore.userData?.profile?.profileId) === 3089 ||
      Number(userStore.userData?.profile?.profileId) === 3028 ||
      Number(userStore.userData?.profile?.profileId) === 3193 ||
      Number(userStore.userData?.profile?.profileId) === 3194
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
      Number(userStore.userData?.profile?.profileId) === 3201 ||
      Number(userStore.userData?.profile?.profileId) === 3202
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
                  child.id === 'inboundLogisticAnalytic' ||
                  child.id === 'email-invoice-integration' ||
                  child.id === 'mock-sap-list' ||
                  child.id === 'receiving-confirmation' ||
                  child.id === 'receiving-confirmation-list' ||
                  child.id === 'delivery-notes' ||
                  child.id === 'delivery-notes-list' ||
                  child.id === 'goods-receipt-list' ||
                  child.id === 'vat-reconciliation' ||
                  child.id === 'vat-out-reconciliation' ||
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

    .menu-title { color: #0d9488 !important; }
    .menu-icon i {
      color: #0d9488 !important;
      transform: translateX(2px);
    }
    .menu-arrow i { color: #0d9488 !important; }

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
