<template>
  <div>
    <BreadcrumbView
      title="Workflow List"
      :routes="[
        { name: 'Workflow Configuration', to: '/workflow-list' },
        { name: 'Workflow List', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Workflow List</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Workflow" />
            <!-- Filter Dropdown -->
            <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
              <button class="dropdown-toggle btn btn-primary">
                <i class="ki-filled ki-filter"></i>
                Filter
              </button>
              <div class="dropdown-content w-full max-w-[305px] p-[16px]">
                <p class="text-lg font-semibold mb-[8px]">Filter</p>
                <div class="flex flex-col gap-[24px] py-[16px]">
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Company Code</label
                    >
                    <select v-model="tempFilters.companyCode" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of companyOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Invoice Type</label
                    >
                    <select v-model="tempFilters.invoiceType" class="select" name="select">
                      <option value="">All</option>
                      <option
                        v-for="item of invoiceTypeOptions"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >PO Type</label
                    >
                    <select v-model="tempFilters.poType" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of poTypeOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Status</label
                    >
                    <select v-model="tempFilters.status" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of statusOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex align-center justify-between gap-[16px]">
                  <button class="btn btn-outline btn-primary btn-lg" @click="resetTempFilters">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                  </button>
                  <button
                    class="btn btn-primary btn-lg"
                    @click="applyFilters"
                    data-dropdown-dismiss="true"
                  >
                    <i class="ki-filled ki-check-circle"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <UiButton variant="primary" @click="addWorkflow()">
              <UiIcon variant="duotone" name="plus" />
              Add Workflow
            </UiButton>
          </div>
        </div>
      </div>
      <div class="card-body integration">
        <div>
          <div
            v-if="workflowList.length > 0"
            class="integration__table border border-gray-200 rounded-xl overflow-x-auto"
          >
            <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1200px]">
              <thead>
                <tr>
                  <th
                    class="integration__field-base !border-b-teal-500 !bg-teal-100 !text-teal-500"
                  ></th>
                  <th
                    class="text-nowrap integration__field-base !border-b-teal-500 !bg-teal-100 !text-teal-500"
                    v-for="item in Columns"
                    :key="item.name"
                  >
                    {{ item.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="workflow in filteredWorkflowList"
                  :key="workflow.wfCode"
                  class="integration__field-items hover:bg-primary-light"
                >
                  <td>
                    <div class="flex items-center space-x-3">
                      <div
                        class="dropdown"
                        data-dropdown="true"
                        data-dropdown-trigger="click"
                        data-dropdown-placement="bottom-end"
                      >
                        <UiButton
                          class="dropdown-toggle"
                          variant="light"
                          :outline="true"
                          :icon="true"
                          size="sm"
                        >
                          <UiIcon name="dots-vertical" />
                        </UiButton>
                        <div class="dropdown-content w-auto p-4 space-y-2">
                          <div class="flex flex-col space-y-2">
                            <UiButton
                              variant="light"
                              class="border-none"
                              :outline="true"
                              size="md"
                              @click="viewDetail(workflow)"
                            >
                              <UiIcon name="eye" class="mr-2" />
                              View Detail
                            </UiButton>
                            <UiButton
                              variant="light"
                              class="border-none"
                              :outline="true"
                              size="md"
                              @click="editWorkflow(workflow)"
                            >
                              <UiIcon name="pencil" class="mr-2" />
                              Edit Workflow
                            </UiButton>
                            <UiButton
                              variant="light"
                              class="border-none text-red-500 hover:text-red-600"
                              :outline="true"
                              size="md"
                              @click="deleteWorkflow(workflow.wfCode)"
                            >
                              <UiIcon name="trash" class="mr-2" />
                              Delete Workflow
                            </UiButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="font-medium">{{ workflow.wfCode }}</span>
                  </td>
                  <td>{{ workflow.wfName }}</td>
                  <td>{{ workflow.companyCode }}</td>
                  <td>{{ workflow.invoiceType }}</td>
                  <td>{{ workflow.poType || '-' }}</td>
                  <td>{{ workflow.poType === 'PO' ? getDpOptionName(workflow.dpOption) : '-' }}</td>
                  <td>{{ workflow.wfStep }}</td>
                  <td>{{ workflow.bracketAmount }}</td>
                  <td>
                    <span
                      class="badge badge-outline border-transparent bg-green-50 text-green-600"
                      >{{ workflow.status }}</span
                    >
                  </td>
                  <td>{{ workflow.lastChange }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-4">No workflows found.</div>
        </div>

        <LPagination
          v-if="workflowList.length > 0"
          class="mt-4"
          :totalItems="totalItems"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @page-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import router from '@/router'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useWorkflowConfigurationStore } from '@/stores/workflow-configurantion/wokrflowConfiguration'

const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const filters = reactive({
  companyCode: '',
  invoiceType: '',
  poType: '',
  status: '',
})

// tempFilters used by the filter UI. Only when user clicks Apply we copy tempFilters -> filters
const tempFilters = reactive({
  companyCode: '',
  invoiceType: '',
  poType: '',
  status: '',
})

// Master data store for invoice/company lookup
const invoiceMasterApi = useInvoiceMasterDataStore()

const companyOptions = computed(() =>
  invoiceMasterApi.companyCode.map((c) => ({ text: c.name, value: c.code })),
)
const dpOptionList = computed(() => invoiceMasterApi.dpType)

// Invoice Type options: only two choices shown in the filter UI
const invoiceTypeOptions = computed(() => [
  { text: 'Invoice PO', value: 'Invoice PO' },
  { text: 'Invoice Non PO', value: 'Invoice Non PO' },
])

// PO Type options depend on selected invoice type in the temp filter UI
const poTypeOptions = computed(() => {
  if (tempFilters.invoiceType === 'Invoice PO') {
    return invoiceMasterApi.invoicePoType.map((i) => ({ text: i.name, value: i.name }))
  }
  if (tempFilters.invoiceType === 'Invoice Non PO') {
    return invoiceMasterApi.invoiceNonPoType.map((i) => ({ text: i.name, value: i.name }))
  }
  return []
})

const statusOptions = [
  { text: 'Active', value: 'Active' },
  { text: 'Inactive', value: 'Inactive' },
]

// removed unused resetFilters

const resetTempFilters = () => {
  tempFilters.companyCode = ''
  tempFilters.invoiceType = ''
  tempFilters.poType = ''
  tempFilters.status = ''
}

const applyFilters = () => {
  filters.companyCode = tempFilters.companyCode
  filters.invoiceType = tempFilters.invoiceType
  filters.poType = tempFilters.poType
  filters.status = tempFilters.status
}

const Columns = ref([
  { name: 'WF Code' },
  { name: 'WF Name' },
  { name: 'Company Code' },
  { name: 'Invoice Type' },
  { name: 'PO Type' },
  { name: 'DP Option' },
  { name: 'WF Step' },
  { name: 'Bracket Amount' },
  { name: 'Status' },
  { name: 'Last Changed' },
])

const workflowStore = useWorkflowConfigurationStore()
const workflowList = computed(() => workflowStore.workflowList)

totalItems.value = workflowList.value.length

const filteredWorkflowList = computed(() => {
  let list = workflowList.value

  // Global search
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (item) =>
        item.wfCode.toLowerCase().includes(q) ||
        item.wfName.toLowerCase().includes(q) ||
        item.companyCode.toLowerCase().includes(q),
    )
  }

  // Column filters
  if (filters.companyCode) {
    list = list.filter((item) => item.companyCode === filters.companyCode)
  }
  if (filters.invoiceType) {
    list = list.filter((item) => item.invoiceType === filters.invoiceType)
  }
  if (filters.poType) {
    list = list.filter((item) => item.poType === filters.poType)
  }
  if (filters.status) {
    list = list.filter((item) => item.status === filters.status)
  }

  return list
})

const addWorkflow = () => {
  router.push({ name: 'workflow-configuration' })
}

const viewDetail = (workflow?: any) => {
  if (!workflow?.wfCode) return
  console.log(workflow.wfCode)

  router.push({
    name: 'workflow-configuration',
    params: {
      id: workflow.wfCode,
    },
    query: { mode: 'view' },
  })
}

const editWorkflow = (workflow?: any) => {
  if (!workflow?.wfCode) return
  router.push({
    name: 'workflow-configuration',
    params: { id: workflow.wfCode },
    query: { mode: 'edit' },
  })
}

const changePage = (page: number) => {
  currentPage.value = page
}

const deleteWorkflow = (wfCode: string) => {
  workflowStore.removeByCode(wfCode)
  totalItems.value = workflowList.value.length
}

const getDpOptionName = (code: string) => {
  const found = dpOptionList.value.find((item) => item.code === code)
  return found?.name || '-'
}

watch(
  () => workflowList.value.length,
  (len) => {
    totalItems.value = len
  },
  { immediate: true },
)

onMounted(() => {
  // load master data for filters
  invoiceMasterApi.getCompanyCode()
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getInvoiceNonPoType()
  invoiceMasterApi.getDpTypes()
})
</script>

<style lang="scss" scoped>
@use './styles/integration-list.scss';
</style>
