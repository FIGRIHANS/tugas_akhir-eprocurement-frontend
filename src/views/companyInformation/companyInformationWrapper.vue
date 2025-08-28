<template>
  <div>
    <div class="card bg-primary-light border border-primary">
      <div class="card-body p-4 flex flex-row items-center justify-between gap-4 text-primary">
        <div class="flex flex-row items-center gap-4">
          <UiIcon variant="duotone" name="information-3" class="text-4xl" />

          <div class="flex flex-col gap-1">
            <span class="font-semibold text-gray-800">Changes to Overall Data</span>
            <p class="font-medium text-sm text-gray-600">
              If you want to change the overall data please send a request via email to the admin
              <strong>(superadmin@gmail.com)</strong>
            </p>
          </div>
        </div>
        <UiButton variant="primary" clear data-modal-toggle="#modal-req-change-data">
          Detail
        </UiButton>
      </div>
    </div>

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

    <AdministrationData
      v-if="currentTab === 'administration_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <BusinessLicenseData
      v-if="currentTab === 'business_license_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <PaymentDetailData
      v-if="currentTab === 'payment_information_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <CompanyDeedData
      v-if="currentTab === 'company_deed_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <EquipmentData
      v-if="currentTab === 'equipment_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <ExperienceData
      v-if="currentTab === 'experience_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <ExpertPersonnelData
      v-if="currentTab === 'expert_personnel_data'"
      :vendor-id="userData?.profile.profileId"
    />
    <OtherDocumentData
      v-if="currentTab === 'other_documents'"
      :vendor-id="userData?.profile.profileId"
    />
  </div>

  <Teleport to="body">
    <div
      class="modal"
      data-modal="true"
      data-modal-backdrop-static="true"
      id="modal-req-change-data"
    >
      <div class="modal-content modal-center-y max-w-4xl max-h-[95%]">
        <div class="modal-header">
          <h3 class="modal-title text-lg">How to request change data</h3>
          <UiIcon name="cross" variant="filled" class="cursor-pointer" data-modal-dismiss="true" />
        </div>

        <div class="modal-body scrollable-y !py-5 flex flex-col gap-4">
          <div class="border border-gray-300 rounded-md p-1 flex items-center gap-2">
            <UiButton
              class="flex-1 flex items-center justify-center !border-none"
              :variant="emailLanguage === 'english' ? 'primary' : 'light'"
              @click="emailLanguage = 'english'"
            >
              English
            </UiButton>
            <UiButton
              class="flex-1 flex items-center justify-center !border-none"
              :variant="emailLanguage === 'indonesia' ? 'primary' : 'light'"
              @click="emailLanguage = 'indonesia'"
            >
              Indonesia
            </UiButton>
          </div>

          <span>{{ emailLanguage === 'english' ? 'First Step' : 'Langkah Pertama' }}</span>
          <div class="bg-gray-200 rounded-lg px-8 py-4">
            <p>
              {{ emailLanguage === 'english' ? englishEmail.firstStep : indonesaiEmail.firstStep }}
            </p>
          </div>

          <span>{{ emailLanguage === 'english' ? 'Second Step' : 'Langkah Kedua' }}</span>
          <div class="bg-gray-200 rounded-lg px-8 py-4">
            <p>
              {{
                emailLanguage === 'english' ? englishEmail.createEmail : indonesaiEmail.createEmail
              }}
              <br />
              Ardyan Saputra - <em class="text-primary">ardyan.saputra@aryanoble.co.id</em> <br />
              {{ emailLanguage === 'english' ? englishEmail.subject : indonesaiEmail.subject }}
              <br />
              ------------------------------------------- <br />
              {{ emailLanguage === 'english' ? englishEmail.ccEmail : indonesaiEmail.ccEmail }}
              <br />
              Basaria: <em class="text-primary">basaria.tambunan@genero.co.id</em> <br />
              Cirscelda: <em class="text-primary">criscelda.kurniasih@aryanoble.co.id</em> <br />
              Bella: <em class="text-primary">bella.agustina@aryanoble.co.id</em>
            </p>
          </div>

          <span>{{ emailLanguage === 'english' ? 'Third Step' : 'Langkah Ketiga' }}</span>
          <div class="bg-gray-200 rounded-lg px-8 py-4">
            <p>
              {{
                emailLanguage === 'english' ? englishEmail.writeEmail : indonesaiEmail.writeEmail
              }}
            </p>
          </div>
          <div class="bg-gray-200 rounded-lg px-8 py-4">
            <p
              v-html="
                emailLanguage === 'english' ? englishEmail.bodyEmail : indonesaiEmail.bodyEmail
              "
            ></p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type TabItemType = {
  name: string
  value: string
}

import { computed, ref } from 'vue'

import { useLoginStore } from '@/stores/views/login'

import { indonesaiEmail, englishEmail } from '@/static/emailRequestChangeData'

import AdministrationData from './details/AdministrationData.vue'
import PaymentDetailData from './details/PaymentDetailData.vue'
import BusinessLicenseData from './details/BusinessLicenseData.vue'
import CompanyDeedData from './details/CompanyDeedData.vue'
import EquipmentData from './details/EquipmentData.vue'
import ExperienceData from './details/ExperienceData.vue'
import ExpertPersonnelData from './details/ExpertPersonnelData.vue'
import OtherDocumentData from './details/OtherDocumentData.vue'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

const userStore = useLoginStore()
const userData = computed(() => userStore.userData)

const emailLanguage = ref<'english' | 'indonesia'>('english')
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
