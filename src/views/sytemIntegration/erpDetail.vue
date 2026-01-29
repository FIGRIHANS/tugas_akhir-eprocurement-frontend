<template>
  <BreadcrumbView
    :routes="[
      { name: 'ERP Integration List', to: '/erp-integratione' },
      { name: 'ERP Detail', to: '#' },
    ]"
    title="ERP Integration Detail"
  />

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">ERP Header Configuration</h3>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-2 gap-6 items-start">
        <!-- LEFT COLUMN -->
        <div class="space-y-2">
          <!-- Connection Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Connection Code <span class="text-red-500">*</span>
              </label>
              <UiInput
                v-model="wfHeader.connectionCode"
                placeholder="e.g. EVOSAP01"
                row
                required
                class="flex-1"
              />
            </div>
          </div>

          <!-- Company Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Company Code
              </label>
              <UiInput v-model="wfHeader.companyCode" placeholder="e.g. MF00" row class="flex-1" />
            </div>
          </div>

          <!-- Description -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Description
              </label>
              <UiInput
                v-model="wfHeader.description"
                placeholder="e.g. SAP PRD Connection MF00"
                row
                class="flex-1"
              />
            </div>
          </div>

          <!-- ERP -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0"> ERP </label>
              <UiSelect
                v-model="wfHeader.erp"
                placeholder="Select ERP"
                row
                :options="erpOptions"
                class="flex-1"
              />
            </div>
          </div>

          <!-- System Client -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                System Client
              </label>
              <UiSelect
                v-model="wfHeader.client"
                placeholder="Select Client"
                row
                :options="clientOptions"
                class="flex-1"
              />
            </div>
          </div>

          <!-- Client ID -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Client ID
              </label>
              <UiInput
                v-model="wfHeader.clientId"
                type="number"
                placeholder="e.g. 120"
                row
                class="flex-1"
              />
            </div>
          </div>

          <!-- Status -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Status
              </label>
              <UiSelect
                v-model="wfHeader.status"
                placeholder="Select Status"
                row
                :options="statusOptions"
                class="flex-1"
              />
            </div>
          </div>

          <!-- Process Group -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Process Group
              </label>
              <UiSelect
                v-model="wfHeader.processGroup"
                placeholder="Select Process Group"
                row
                :options="processGroupOptions"
                class="flex-1"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-2">
          <!-- Connection Method -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Connection Method
              </label>
              <div class="flex-1 flex gap-4 items-center">
                <UiRadio
                  v-model="wfHeader.connectionMethod"
                  value="RFC"
                  label="RFC"
                  name="connectionMethod"
                />
                <UiRadio
                  v-model="wfHeader.connectionMethod"
                  value="API"
                  label="API"
                  name="connectionMethod"
                />
                <UiRadio
                  v-model="wfHeader.connectionMethod"
                  value="Integration Suite"
                  label="Integration Suite"
                  name="connectionMethod"
                />
                <UiRadio
                  v-model="wfHeader.connectionMethod"
                  value="RPA"
                  label="RPA"
                  name="connectionMethod"
                />
              </div>
            </div>
          </div>

          <!-- Connector Driver -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Connector Driver
              </label>
              <div class="flex-1 flex gap-2">
                <UiInput
                  v-model="wfHeader.connectorDriver"
                  placeholder="e.g. .net connector Versi XX121"
                  row
                  class="flex-1"
                />
                <UiButton
                  class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
                  @click="console.log('Add driver')"
                >
                  <div class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100">
                    <UiIcon name="plus" class="text-blue-600" size="xs" />
                  </div>
                  Add Driver
                </UiButton>
              </div>
            </div>
          </div>

          <!-- Destination Name -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Destination Name
              </label>
              <div class="flex-1 flex gap-2">
                <UiInput
                  v-model="wfHeader.destinationName"
                  placeholder="e.g. IDES-NEW"
                  row
                  class="flex-1"
                />
                <div class="w-[160px] flex-shrink-0"></div>
              </div>
            </div>
          </div>

          <!-- App Server Host -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                App Server Host
              </label>
              <div class="flex-1 flex gap-2">
                <UiInput
                  v-model="wfHeader.appServerHost"
                  placeholder="e.g. 192.168.5.50"
                  row
                  class="flex-1"
                />
                <div class="w-[160px] flex-shrink-0"></div>
              </div>
            </div>
          </div>

          <!-- User -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                User
              </label>
              <div class="flex-1 flex gap-2">
                <UiInput v-model="wfHeader.user" placeholder="e.g. TMS_EVOQ" row class="flex-1" />
                <div class="w-[160px] flex-shrink-0"></div>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Password
              </label>
              <div class="flex-1 flex gap-2">
                <div class="flex-1 relative">
                  <UiInput
                    v-model="wfHeader.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter Password"
                    row
                    class="w-full"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    @click="showPassword = !showPassword"
                  >
                    <UiIcon :name="showPassword ? 'eye-slash' : 'eye'" size="sm" />
                  </button>
                </div>
                <div class="w-[160px] flex-shrink-0"></div>
              </div>
            </div>
          </div>

          <!-- Language -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Language
              </label>
              <div class="flex-1 flex gap-2">
                <UiInput v-model="wfHeader.language" placeholder="e.g. EN" row class="flex-1" />
                <div class="w-[160px] flex-shrink-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Table Section (Placeholder for now, or similar to Workflow Config) -->
  <div class="mt-6">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">ERP Details Table</h3>
      </div>
      <div class="card-body">
        <div class="text-center text-gray-500 py-8">
          Details will appear here based on configuration.
        </div>
      </div>
    </div>
  </div>

  <!-- Modals -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'

// Reactive state
// const bracketAmount = ref<'yes' | 'no' | undefined>(undefined)
// const showBracketModal = ref(false)
// const showProfileModal = ref(false)
// const showAuthModal = ref(false)

const showPassword = ref(false)

// Interface for WF Header
interface WfHeader {
  connectionCode: string
  companyCode: string
  description: string
  erp: string | undefined
  client: string | undefined
  clientId: string
  status: string | undefined
  processGroup: string | undefined
  connectionMethod: string
  connectorDriver: string
  destinationName: string
  appServerHost: string
  user: string
  password: string
  language: string
}

const wfHeader = ref<WfHeader>({
  connectionCode: '',
  companyCode: '',
  description: '',
  erp: undefined,
  client: undefined,
  clientId: '',
  status: undefined,
  processGroup: undefined,
  // New fields
  connectionMethod: 'RFC',
  connectorDriver: '',
  destinationName: '',
  appServerHost: '',
  user: '',
  password: '',
  language: '',
})

const erpOptions = [
  { text: 'SAP HANA 2020', value: 'sap_hana_2020' },
  { text: 'SAP HANA 2023', value: 'sap_hana_2023' },
  { text: 'SAP ECC 6 EHP 7', value: 'sap_ecc_6' },
  { text: 'Odoo 17', value: 'odoo_17' },
  { text: 'Odoo 18', value: 'odoo_18' },
  { text: 'Odoo 19', value: 'odoo_19' },
]

const clientOptions = [
  { text: 'PRD', value: 'PRD' },
  { text: 'DEV', value: 'DEV' },
  { text: 'QA', value: 'QA' },
]

const statusOptions = [
  { text: 'Active', value: 'Active' },
  { text: 'Inactive', value: 'Inactive' },
]

const processGroupOptions = [
  { text: 'Invoice Management', value: 'Invoice Management' },
  { text: 'Vendor Management', value: 'Vendor Management' },
  { text: 'Procurement Management', value: 'Procurement Management' },
  { text: 'Warehouse Management', value: 'Warehouse Management' },
]

// Handlers for modals (empty for now or log)
// const handleBracketSubmit = (formData: BracketForm) => {
//   console.log('Bracket submitted', formData)
//   showBracketModal.value = false
// }
// const handleProfileSubmit = (formData: ProfileForm) => {
//   console.log('Profile submitted', formData)
//   showProfileModal.value = false
// }
// const handleAuthSubmit = (formData: AuthForm) => {
//   console.log('Auth submitted', formData)
//   showAuthModal.value = false
// }

// On Mounted to fetch data
onMounted(() => {
  const route = useRoute()
  const id = route.params.id as string

  // Mock data fetching based on ID
  console.log('Fetching details for:', id)

  // define mock data
  const mockDB: Record<string, any> = {
    EVOSAP01: {
      connectionCode: 'EVOSAP01',
      companyCode: 'MF00',
      description: 'SAP PRD Connection MF00',
      erp: 'sap_hana_2020',
      client: 'PRD',
      clientId: '120',
      status: 'Active',
      processGroup: 'Invoice Management',
      connectionMethod: 'RFC',
      connectorDriver: '.net connector Versi XX121',
      destinationName: 'IDES-NEW',
      appServerHost: '192.168.5.50',
      user: 'TMS_EVOQ',
      password: 'Teamwork2026!!!',
      language: 'EN',
    },
    EVOSAP02: {
      connectionCode: 'EVOSAP02',
      companyCode: 'MF00',
      description: 'SAP PRD Connection MF00',
      erp: 'sap_hana_2020',
      client: 'PRD',
      clientId: '120',
      status: 'Active',
      processGroup: 'Invoice Management',
      connectionMethod: 'RFC',
      connectorDriver: '.net connector Versi XX121',
      destinationName: 'IDES-NEW',
      appServerHost: '192.168.5.50',
      user: 'TMS_EVOQ',
      password: 'Teamwork2026!!!',
      language: 'EN',
    },
  }

  const data = mockDB[id] || {
    connectionCode: id,
    companyCode: '',
    description: '',
    erp: undefined,
    client: undefined,
    clientId: '',
    status: undefined,
    processGroup: undefined,
    connectionMethod: 'RFC',
    connectorDriver: '',
    destinationName: '',
    appServerHost: '',
    user: '',
    password: '',
    language: '',
  }

  wfHeader.value = data
})
</script>
