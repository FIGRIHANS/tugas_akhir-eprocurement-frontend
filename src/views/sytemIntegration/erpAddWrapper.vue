<template>
  <BreadcrumbView :routes="[
    { name: 'ERP Integration List', to: '/erp-integratione' },
    { name: 'ERP Add', to: '#' },
  ]" title="ERP Integration Create" />

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
              <UiInput v-model="wfHeader.connectionCode" placeholder="e.g. EVOSAP01" row required class="flex-1" />
            </div>
          </div>

          <!-- Company Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Company Code
              </label>
              <!-- <UiInput v-model="wfHeader.companyCode" placeholder="e.g. MF00" row class="flex-1" /> -->
              <UiSelect v-model="wfHeader.companyCode" placeholder="Select Company Code" row text-key="name"
                value-key="code" :options="companyCodeList" class="flex-1" />
            </div>
          </div>

          <!-- Description -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Description
              </label>
              <UiInput v-model="wfHeader.description" placeholder="e.g. SAP PRD Connection MF00" row class="flex-1" />
            </div>
          </div>

          <!-- ERP -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0"> ERP </label>
              <UiSelect v-model="wfHeader.erp" placeholder="Select ERP" row :options="erpOptions" class="flex-1" />
            </div>
          </div>

          <!-- System Client -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                System Client
              </label>
              <UiSelect v-model="wfHeader.client" placeholder="Select Client" row :options="clientOptions"
                class="flex-1" />
            </div>
          </div>

          <!-- Client ID -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Client ID
              </label>
              <UiInput v-model="wfHeader.clientId" type="number" placeholder="e.g. 120" row class="flex-1" />
            </div>
          </div>

          <!-- Status -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Status
              </label>
              <UiSelect v-model="wfHeader.status" placeholder="Select Status" row :options="statusOptions"
                class="flex-1" />
            </div>
          </div>

          <!-- Process Group -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-[140px] flex-shrink-0">
                Process Group
              </label>
              <UiSelect v-model="wfHeader.processGroup" placeholder="Select Process Group" row
                :options="processGroupOptions" class="flex-1" />
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
                <UiRadio v-model="wfHeader.connectionMethod" value="RFC" label="RFC" name="connectionMethod" />
                <UiRadio v-model="wfHeader.connectionMethod" value="API" label="API" name="connectionMethod" />
                <UiRadio v-model="wfHeader.connectionMethod" value="Integration Suite" label="Integration Suite"
                  name="connectionMethod" />
                <UiRadio v-model="wfHeader.connectionMethod" value="RPA" label="RPA" name="connectionMethod" />
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
                <UiInput v-model="wfHeader.connectorDriver" placeholder="e.g. .net connector Versi XX121" row
                  class="flex-1" />
                <UiButton
                  class="w-[160px] flex items-center pl-4 gap-2 bg-blue-50 border border-blue-400 text-blue-600 text-xs font-medium rounded h-10 px-3 hover:bg-blue-100 flex-shrink-0"
                  @click="console.log('Add driver')">
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
                <UiInput v-model="wfHeader.destinationName" placeholder="e.g. IDES-NEW" row class="flex-1" />
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
                <UiInput v-model="wfHeader.appServerHost" placeholder="e.g. 192.168.5.50" row class="flex-1" />
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
                  <UiInput v-model="wfHeader.password" :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter Password" row class="w-full" />
                  <button type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    @click="showPassword = !showPassword">
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
      <div class="flex justify-end mt-6 pr-4">
        <UiButton type="button" class="btn btn-primary">
          <span>Save</span>
          <UiIcon name="arrows-circle" variant="duotone" class="w-4 h-1" />
        </UiButton>
      </div>
    </div>
  </div>

  <!-- Table Section (Placeholder for now, or similar to Workflow Config) -->
  <div class="mt-6">
    <div class="border border-gray-200 rounded-xl p-[24px]">
      <div class="flex justify-between items-center gap-[8px]">
        <h3 class="font-bold text-lg text-slate-800">Integration List</h3>
        <div class="flex gap-3 items-center">
          <UiInputSearch v-model="search" placeholder="Search..." />
          <button class="dropdown-toggle btn btn-primary">
            <i class="ki-filled ki-filter"></i>
            Filter
          </button>
          <button class="btn btn-primary" @click="goToAddIntegrationPage()">
            <i class="ki-duotone ki-plus-circle"></i>
            Add New
          </button>
        </div>
      </div>
      <div class="overflow-x-auto integration__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"></th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Code
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Client
              </th>
              <th
                class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500 integration__field-base--long">
                Process Integration
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Services
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Type
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Source
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Destination
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Transaction Code
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Connection
              </th>
              <th
                class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500 integration__field-base--tech">
                Technical Object
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Field Mapping
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Integration Status
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500">
                Connection Test
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in integrationList" :key="index" class="integration__field-items hover:bg-blue-50">
              <td class="flex items-center gap-[24px]">
                <button class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]" title="View Detail"
                  @click="goToDetail(item.code)">
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>
                <button class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]" title="Field Mapping"
                  @click="goToEdit(item.code)">
                  <i class="ki-duotone ki-pencil !text-lg"></i>
                </button>
              </td>
              <td class="whitespace-nowrap font-medium">
                {{ item.code }}
              </td>
              <td class="whitespace-nowrap">{{ item.client }}</td>
              <td class="whitespace-nowrap">{{ item.processIntegration }}</td>
              <td class="whitespace-nowrap">{{ item.services }}</td>
              <td class="text-center">
                <span class="badge badge-outline" :class="item.type === 'Outbound'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-orange-50 text-orange-600'
                  ">
                  {{ item.type }}
                </span>
              </td>
              <td class="whitespace-nowrap font-medium">{{ item.source }}</td>
              <td class="whitespace-nowrap font-medium">{{ item.destination }}</td>
              <td class="whitespace-nowrap">{{ item.transactionCode }}</td>
              <td class="whitespace-nowrap">{{ item.connection }}</td>
              <td class="whitespace-nowrap font-mono text-xs">{{ item.technicalObject }}</td>
              <td class="text-center">
                <span class="badge badge-outline" :class="item.fieldMapping === 'Active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'
                  ">
                  {{ item.fieldMapping }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge badge-outline" :class="item.integrationStatus === 'Active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'
                  ">
                  {{ item.integrationStatus }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge badge-outline" :class="item.connectionTest === 'Success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
                  ">
                  {{ item.connectionTest }}
                </span>
              </td>
            </tr>
            <tr v-if="integrationList.length === 0">
              <td colspan="14" class="text-center py-8 text-gray-500">No data found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <IntegrationAddModal v-model="showAddIntegrationModal" @submit="handleAddIntegration" /> -->
  </div>



  <!-- Modals -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'
import { useIntegrationStore } from '@/stores/system-integration/systemIntegration'
import { storeToRefs } from 'pinia'

import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
const integrationStore = useIntegrationStore()
const { integrationList } = storeToRefs(integrationStore)

// import IntegrationAddModal from './erpModal/erpAddModal.vue'

const invoiceMasterApi = useInvoiceMasterDataStore()


const companyCodeList = computed(() => invoiceMasterApi.companyCode)

const route = useRoute()
const router = useRouter()
const id = route.params.id as string


// Reactive state
// const bracketAmount = ref<'yes' | 'no' | undefined>(undefined)
// const showBracketModal = ref(false)
// const showProfileModal = ref(false)
// const showAuthModal = ref(false)

const goToAddIntegrationPage = () => {
  router.push({
    name: 'add-integration',
  })
}




// Interface for Integration Item
// interface IntegrationItem {
//   code: string
//   client: string
//   processIntegration: string
//   services: string
//   type: string
//   source: string
//   destination: string
//   transactionCode: string
//   connection: string
//   technicalObject: string
//   fieldMapping: string
//   integrationStatus: string
//   connectionTest: string
// }

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


// const integrationList = ref<IntegrationItem[]>([])
const showPassword = ref(false)
const search = ref('')



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

// const handleAddIntegration = (data: IntegrationItem) => {
//   integrationList.value.push(data)
// }

const goToDetail = (code: string) => {
  router.push(
    {
      name: 'detail-integration',
      params: { id: code }
    }
  )
}

const goToEdit = (code: string) => {
  router.push(
    {
      name: 'edit-integration',
      params: { id: code }
    }
  )
}



// On Mounted to fetch data
onMounted(async () => {

  await invoiceMasterApi.getCompanyCode()

  // Mock data fetching based on ID
  // console.log('Fetching details for:', id)

  // define mock data
  const mockDB: Record<string, WfHeader> = {
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

// const handleGenerateWFStep = () => {
//     integrationList.value = dummyIntegrationList
// }

// const dummyIntegrationList = [
// {
//     code: 'IV01',
//     client: 'PRD',
//     processIntegration: 'Invoice Posting With PO',
//     services: 'Transaction',
//     type: 'Outbound',
//     source: 'EVOQ',
//     destination: 'SAP',
//     transactionCode: 'MIRO',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVPO_MIRO',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV02',
//     client: 'PRD',
//     processIntegration: 'Invoice Without PO GL Master',
//     services: 'Master Data',
//     type: 'Inbound',
//     source: 'SAP',
//     destination: 'EVOQ',
//     transactionCode: 'FS00',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVNONPO_GLMASTER',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV03',
//     client: 'PRD',
//     processIntegration: 'Invoice Posting Without PO',
//     services: 'Transaction',
//     type: 'Outbound',
//     source: 'EVOQ',
//     destination: 'SAP',
//     transactionCode: 'FB60',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVPO_FB60',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV04',
//     client: 'PRD',
//     processIntegration: 'GR Posted for Invoice',
//     services: 'Transaction',
//     type: 'Outbound',
//     source: 'EVOQ',
//     destination: 'SAP',
//     transactionCode: 'MB51',
//     connection: 'RFC',
//     technicalObject: 'ZFM_MATDOC_GRLIST',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV05',
//     client: 'PRD',
//     processIntegration: 'Invoice With PO Reversal',
//     services: 'Transaction',
//     type: 'Outbound',
//     source: 'EVOQ',
//     destination: 'SAP',
//     transactionCode: 'MR8M',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVPO_REVERSAL',
//     fieldMapping: 'Not Active',
//     integrationStatus: 'Not Active',
//     connectionTest: 'Not Active',
// },
// {
//     code: 'IV06',
//     client: 'PRD',
//     processIntegration: 'Payment Terms',
//     services: 'Master Data',
//     type: 'Inbound',
//     source: 'SAP',
//     destination: 'EVOQ',
//     transactionCode: 'OBB8',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVNONPO_GLMASTER',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV07',
//     client: 'PRD',
//     processIntegration: 'Payment Method',
//     services: 'Master Data',
//     type: 'Inbound',
//     source: 'SAP',
//     destination: 'EVOQ',
//     transactionCode: 'OBB8',
//     connection: 'RFC',
//     technicalObject: 'ZFM_INVNONPO_GLMASTER',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// {
//     code: 'IV08',
//     client: 'PRD',
//     processIntegration: 'Employee Master Role',
//     services: 'Master Data',
//     type: 'Inbound',
//     source: 'SAP',
//     destination: 'EVOQ',
//     transactionCode: 'PPOME',
//     connection: 'RFC',
//     technicalObject: 'ZFM_EMPLOYEE_ORGSTRUCTURE',
//     fieldMapping: 'Active',
//     integrationStatus: 'Active',
//     connectionTest: 'Success',
// },
// ]



</script>