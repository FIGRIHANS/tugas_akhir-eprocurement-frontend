<template>
  <BreadcrumbView :routes="[
    { name: 'Invoice Configuration List', to: '/invoice-configuration' },
    { name: 'Invoice Configuration Add', to: '#' },
  ]" title="Invoice Configuration Create" />

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Invoice Configuration</h3>
    </div>

    <div class="card-body">
      <div class="grid grid-cols-2 gap-6 items-start">
        <!-- LEFT COLUMN -->
        <div class="space-y-2">
          <!-- Connection Code -->
          <!-- Configuration Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">
                Configuration Code <span class="text-red-500">*</span>
              </label>
              <UiInput v-model="header.configCode" placeholder="e.g. IVOX001" row class="flex-1" />
            </div>
          </div>

          <!-- Company Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">Company Code</label>
              <UiSelect v-model="header.companyCode" :options="companyCodeList" text-key="name" value-key="code" row
                class="flex-1" />
            </div>
          </div>

          <!-- System Client -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">System Client</label>
              <UiSelect v-model="header.systemClient" :options="clientOptions" row class="flex-1" />
            </div>
          </div>

          <!-- Invoice Group -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">Invoice Group</label>
              <UiSelect v-model="header.invoiceGroup" :options="invoiceGroupOptions" row class="flex-1" />
            </div>
          </div>

          <!-- Invoice Type -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">Invoice Type</label>
              <UiSelect v-model="header.invoiceType" :options="invoiceTypeOptions" row class="flex-1" />
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-2">
          <!-- OCR -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">OCR</label>
              <UiSelect v-model="header.isOcr" text-key="text" value-key="value" :options="booleanOptions" row
                class="flex-1" />
            </div>
          </div>

          <!-- QR Code -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">QR Code</label>
              <UiSelect v-model="header.isQr" text-key="text" value-key="value" :options="booleanOptions" row
                class="flex-1" />
            </div>
          </div>

          <!-- PJAP Validation -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">PJAP Validation</label>
              <UiSelect v-model="header.isPjap" text-key="text" value-key="value" :options="booleanOptions" row
                class="flex-1" />
            </div>
          </div>

          <!-- ERP 3 Way Matching -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">ERP 3 Way Matching</label>
              <UiSelect v-model="header.is3WayMatching" text-key="text" value-key="value" :options="booleanOptions" row
                class="flex-1" />
            </div>
          </div>

          <!-- Source -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">Source</label>
              <UiSelect v-model="header.source" :options="sourceOptions" row class="flex-1" />
            </div>
          </div>

          <!-- Workflow ID -->
          <div class="px-2 py-1">
            <div class="flex items-center gap-3">
              <label class="w-[160px] text-sm font-medium">Workflow ID</label>
              <UiSelect v-model="header.workflowId" :options="workflowOptions" row class="flex-1" />
            </div>
          </div>

        </div>
      </div>
      <div class="flex justify-end mt-6 pr-4 gap-2">
        <UiButton @click="goBack()">
          <span>Back</span>
        </UiButton>
        <UiButton type="button" class="btn btn-primary" @click="submitErp()">
          <span>Save</span>
          <UiIcon name="arrows-circle" variant="duotone" class="w-4 h-1" />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
// import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
// import UiRadio from '@/components/ui/atoms/radio/UiRadio.vue'
import { useSystemIntegrationStore } from '@/stores/system-integration/systemIntegration'


import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
const systemIntegrationStore = useSystemIntegrationStore()
// const integrationList = ref([])

// import IntegrationAddModal from './erpModal/erpAddModal.vue'

const invoiceMasterApi = useInvoiceMasterDataStore()


const companyCodeList = computed(() => invoiceMasterApi.companyCode)

// const route = useRoute()
const router = useRouter()
// const id = route.params.id as string



// Interface for WF Header
interface header {
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
// const search = ref('')

const header = ref({
  configCode: '',
  companyCode: '',
  companyName: '',
  systemClient: 'PRD',

  invoiceGroup: '',
  invoiceType: '',

  isOcr: true,
  isQr: true,
  isPjap: true,
  is3WayMatching: true,

  source: '',
  workflowId: '',
})

const clientOptions = [
  { text: 'PRD', value: 'PRD' },
  { text: 'DEV', value: 'DEV' },
  { text: 'QA', value: 'QA' },
]


const invoiceGroupOptions = [
  { text: 'Invoice With PO', value: 'Invoice With PO' },
  { text: 'Invoice Without PO', value: 'Invoice Without PO' },
]

const invoiceTypeOptions = [
  { text: 'PO Normal', value: 'PO Normal' },
  { text: 'PO Credit Card', value: 'PO Credit Card' },
  { text: 'PO Asset', value: 'PO Asset' },
]

const booleanOptions = [
  { text: 'Active', value: true },
  { text: 'Inactive', value: false },
]

const sourceOptions = [
  { text: 'Multi Channel', value: 'Multi Channel' },
  { text: 'FTP Integration', value: 'FTP Integration' },
  { text: 'Email Integration', value: 'Email Integration' },
  { text: 'VSS Integration', value: 'VSS Integration' },
]

const workflowOptions = [
  { text: 'WF001 - 3 Step VF Invoice - Head Office', value: 'WF001' },
  { text: 'WF003 - 5 Step VF Invoice - Branch Office', value: 'WF003' },
]

const getCompanyName = () => {
  const company = companyCodeList.value.find(
    (item) => item.code === header.value.companyCode
  )

  if (!company?.name) return ''

  // ambil teks setelah " - "
  return company.name.split(' - ').slice(1).join(' - ')
}

const submitErp = () => {

  header.value.configCode = header.value.configCode
  header.value.companyName = getCompanyName()
  systemIntegrationStore.addErp({ ...header.value })


  router.push({
    name: 'invoice-configuration'
  })
}

const goBack = () => {
  router.push({
    name: 'invoice-configuration'
  })
}



// On Mounted to fetch data
onMounted(() => {

  invoiceMasterApi.getCompanyCode(header.value.configCode)
})




</script>