<template>
  <BreadcrumbView :routes="[
    { name: 'Invoice Configuration List', to: '/invoice-configuratione' },
    { name: 'Invoice Configuration Detail', to: '#' },
  ]" title="Invoice Configuration Detail" />

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Invoice Configuration Header</h3>
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
        <UiButton type="button" class="btn btn-primary" @click="editErp(header.configCode)">
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
        <h3 class="font-bold text-lg text-slate-800">PO & GR Data Condition</h3>
        <div class="flex gap-3 items-center">
          <UiInputSearch v-model="search" placeholder="Search..." />
          <button class="dropdown-toggle btn btn-primary">
            <i class="ki-filled ki-filter"></i>
            Filter
          </button>
          <button class="btn btn-primary" @click="goToAdd">
            <i class="ki-duotone ki-plus-circle"></i>
            Add New
          </button>
        </div>
      </div>

      <div class="overflow-x-auto integration__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1000px]">
          <thead>
            <tr>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100"></th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                Code
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                Client
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 integration__field-base--long">
                Process Integration
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                PO Type
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                PO Description
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100 integration__field-base--tech">
                Technical Object
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                Field Mapping
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                Integration Status
              </th>
              <th class="integration__field-base !border-b-blue-500 !bg-blue-100">
                Connection Test
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in dummyIntegrationList" :key="item.code" class="integration__field-items hover:bg-blue-50">
              <!-- ACTION -->
              <td class="flex items-center gap-[16px]">
                <button class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]" title="View Detail"
                  @click="goToDetail(item.code)">
                  <i class="ki-filled ki-eye !text-lg"></i>
                </button>

                <button class="btn btn-outline btn-icon btn-primary w-[32px] h-[32px]" title="Field Mapping"
                  @click="goToEdit(item.code)">
                  <i class="ki-filled ki-pencil !text-lg"></i>
                </button>
              </td>

              <td class="font-medium whitespace-nowrap">{{ item.code }}</td>
              <td class="whitespace-nowrap">{{ item.client }}</td>
              <td class="whitespace-nowrap">{{ item.processIntegration }}</td>
              <td class="whitespace-nowrap">{{ item.poType }}</td>
              <td class="whitespace-nowrap">{{ item.poDescription }}</td>

              <td class="font-mono text-xs whitespace-nowrap">
                {{ item.technicalObject }}
              </td>

              <td class="text-center">
                <span class="badge badge-outline" :class="item.fieldMapping === 'Active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'">
                  {{ item.fieldMapping }}
                </span>
              </td>

              <td class="text-center">
                <span class="badge badge-outline" :class="item.integrationStatus === 'Active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'">
                  {{ item.integrationStatus }}
                </span>
              </td>

              <td class="text-center">
                <span class="badge badge-outline" :class="item.connectionTest === 'Active'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'">
                  {{ item.connectionTest }}
                </span>
              </td>
            </tr>

            <tr v-if="dummyIntegrationList.length === 0">
              <td colspan="10" class="text-center py-8 text-gray-500">
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modals -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { useSystemConfigurationStore } from '@/stores/system-configuration/systemConfiguration'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const route = useRoute()
const router = useRouter()

const systemConfigurationStore = useSystemConfigurationStore()
const invoiceMasterApi = useInvoiceMasterDataStore()

const companyCodeList = computed(() => invoiceMasterApi.companyCode)


const id = route.params.id as string


const search = ref('')

// Interface for WF Header

const editErp = (id: string) => {

  systemConfigurationStore.updateErp(id, header.value)

  router.push({
    name: 'invoice-configuration',
  })
}

const goBack = () => {
  router.push({
    name: 'invoice-configuration'
  })
}

const goToDetail = (item: string) => {
  router.push({
    name: 'detail-integration-invoice',
    params: { id: id, definitionId: item }
  })
}

const goToAdd = () => {
  router.push({
    name: 'add-integration-invoice',
    params: { id: id },
    query: {
      routeFrom: 'detail',
    }
  })
}

const goToEdit = (item: string) => {
  router.push({
    name: 'edit-integration-invoice',
    params: { id: id, definitionId: item },
    query: {
      routeFrom: 'detail',
    }
  })
}



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

const dummyIntegrationList = ref<any>([])

// On Mounted to fetch data
onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()
  const dataFromStore = systemConfigurationStore.getErpByConfigCode(id)

  console.log(dataFromStore.header, 'dataFromStore');

  if (!dataFromStore) return

  const headerData = dataFromStore.header
  const integrations = dataFromStore.integrations ?? []

  // HEADER (Invoice Configuration)
  header.value = {
    configCode: headerData.configCode,
    companyCode: headerData.companyCode,
    companyName: headerData.companyName,
    systemClient: headerData.systemClient,

    invoiceGroup: headerData.invoiceGroup,
    invoiceType: headerData.invoiceType,

    isOcr: headerData.isOcr,
    isQr: headerData.isQr,
    isPjap: headerData.isPjap,
    is3WayMatching: headerData.is3WayMatching,

    source: headerData.source,
    workflowId: headerData.workflowId,
  }

  // INTEGRATION LIST
  dummyIntegrationList.value = integrations
})




</script>
