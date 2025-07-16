<template>
  <div>
    <Breadcrumb title="Data Perusahaan" :routes="routes" />

    <div class="tabs mb-6" data-tab="true">
      <div
        v-for="(item, index) in tabItems"
        :key="index"
        class="tab"
        :class="item.value === currentTab ? 'active' : ''"
      >
        <span @click="changeTab(item.value)" class="cursor-pointer">
          {{ item.name }}
        </span>
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="cursor-pointer"
          @click="closeTab(item.value)"
        />
      </div>
      <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
        <button class="dropdown-toggle">
          <UiIcon name="dots-vertical" />
        </button>

        <div class="dropdown-content w-full max-w-72" data-dropdown-dismiss="true">
          <div class="menu menu-default flex flex-col w-full text-sm">
            <div
              v-for="(menu, index) in tabsMenu"
              :key="index"
              class="menu-item"
              @click="addTab(menu)"
            >
              <div class="menu-link">
                <span>{{ menu.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdministrationData v-if="currentTab === 'administration_data'" />
    <PaymentDetailData v-if="currentTab === 'payment_information_data'" />
    <!-- <CompanyDeedData v-if="currentTab === 'company_deed_data'" />
    <EquipmentData v-if="currentTab === 'equipment_data'" />
    <ExperienceData v-if="currentTab === 'experience_data'" />
    <ExpertPersonnelData v-if="currentTab === 'expert_personnel_data'" />
    <OtherDocument v-if="currentTab === 'other_documents'" /> -->
  </div>
</template>

<script setup lang="ts">
type TabItemType = {
  name: string
  value: string
}

import { computed, ref } from 'vue'

import AdministrationData from './details/AdministrationData.vue'
import PaymentDetailData from './details/PaymentDetailData.vue'
// import CompanyDeedData from './details/CompanyDeedData.vue'
// import EquipmentData from './details/EquipmentData.vue'
// import ExpertPersonnelData from './details/ExpertPersonnelData.vue'
// import OtherDocument from './details/OtherDocument.vue'
// import ExperienceData from './details/ExperienceData.vue'

import type { routeTypes } from '@/core/type/components/breadcrumb'

import Breadcrumb from '@/components/BreadcrumbView.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const routes = ref<routeTypes[]>([
  {
    name: 'Data Perusahaan',
    to: '/company-information',
  },
])

const currentTab = ref<string>('administration_data')
const tabItems = ref<TabItemType[]>([
  {
    name: 'Administration Data',
    value: 'administration_data',
  },
])
const tabsMenu = computed<TabItemType[]>(() => {
  const menu = [
    {
      name: 'Administration Data',
      value: 'administration_data',
    },
    {
      name: 'Business License Data',
      value: 'business_license_data',
    },
    {
      name: 'Payment Information Data',
      value: 'payment_information_data',
    },
    {
      name: 'Company Deed Data',
      value: 'company_deed_data',
    },
    {
      name: 'Equipment Data',
      value: 'equipment_data',
    },
    {
      name: 'Experience Data',
      value: 'experience_data',
    },
    {
      name: 'Expert Personnel Data',
      value: 'expert_personnel_data',
    },
    {
      name: 'Other Documents',
      value: 'other_documents',
    },
  ]

  return menu.filter(
    (menuItem) => !tabItems.value.some((tabItem) => tabItem.value === menuItem.value),
  )
})

const changeTab = (value: string) => {
  currentTab.value = value
}

const closeTab = (value: string) => {
  const findIndex = tabItems.value.findIndex((item) => item.value === value)

  if (currentTab.value === value) {
    if (findIndex === tabItems.value.length - 1) {
      currentTab.value = tabItems.value[findIndex - 1]?.value
    } else {
      currentTab.value = tabItems.value[findIndex + 1]?.value
    }
  }

  tabItems.value.splice(findIndex, 1)
}

const addTab = (menu: TabItemType) => {
  tabItems.value.push(menu)
}
</script>
