<template>
  <div>
    <Breadcrumb title="Recurring Invoice Reminder" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="border border-gray-200 rounded-xl p-[24px]">
      <div class="flex justify-between align-items-center gap-[8px]">
        <h1>Recurring Invoice Reminder</h1>
        <div class="flex align-items-center gap-3">
          <UiInputSearch v-model="search" placeholder="Search" @keypress="goSearch" />
          <FilterList :data="filterForm" @setData="setDataFilter" />
        </div>
      </div>
      <div class="flex overflow-x-auto gap-3 mb-5 items-center" v-if="filteredPayload.length > 0">
        <div class="font-medium text-lg text-gray-800">Filter</div>
        <div v-for="items in filteredPayload" :key="items.key">
          <div class="btn btn-light btn-sm" v-if="items.value !== ''">
            <span class="text-gray-500"> {{ items.key }} </span>
            <span class="font-semibold">
              <p v-if="items.key === 'Status'">
                {{
                  statusList.find((item) => item.value.toString() === items.value.toString())?.label
                }}
              </p>
              <p v-else>{{ items.value }}</p>
            </span>
            <i class="ki-filled ki-cross" @click="deleteFilter(items.key)"></i>
          </div>
        </div>
        <UiButton variant="light" size="sm" class="btn-clear" @click="resetFilter()">
          {{ $t('vendor.masterFilters.reset') }}
        </UiButton>
      </div>
      <div class="overflow-x-auto list__table mt-[24px]">
        <table class="table align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                class="!border-b-teal-500 !bg-teal-100 !text-teal-500 whitespace-nowrap"
                :class="{
                  'list__long ': index !== 0,
                  'cursor-pointer': item,
                  '!text-teal-700': item === sortColumnName && sortBy !== '',
                }"
                @click="sortColumn(item)"
              >
                {{ item }}
                <i v-if="item" class="ki-filled ki-arrow-up-down"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="list.length === 0">
              <td colspan="10" class="text-center">No data found.</td>
            </tr>
            <tr v-for="(row, index) in list" :key="index">
              <td class="whitespace-nowrap">
                <div
                  class="dropdown"
                  data-dropdown="true"
                  data-dropdown-trigger="click"
                  data-dropdown-placement="bottom-end"
                >
                  <UiButton
                    class="dropdown-toggle"
                    variant="light"
                    :outline="false"
                    :icon="true"
                    size="sm"
                  >
                    <i class="ki-filled ki-dots-vertical"></i>
                  </UiButton>
                  <div class="dropdown-content w-auto p-4 space-y-2">
                    <div class="flex flex-col space-y-2">
                      <UiButton
                        variant="light"
                        class="border-none"
                        :outline="true"
                        size="md"
                        @click="openDetailModal(row)"
                      >
                        <UiIcon name="eye" class="mr-2" />
                        View Detail
                      </UiButton>
                    </div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap">{{ row.invoiceReminder }}</td>
              <td class="whitespace-nowrap">{{ formatDate(row.dueDate) }}</td>
              <td class="whitespace-nowrap">
                <span class="badge" :class="getStatusBadgeClass(row.status)">
                  {{ row.status }}
                </span>
              </td>
              <td class="whitespace-nowrap">{{ row.periode }}</td>
              <td class="whitespace-nowrap">{{ row.invoiceType }}</td>
              <td class="whitespace-nowrap">{{ row.activityCode }}</td>
              <td class="whitespace-nowrap">{{ row.activityName }}</td>
              <td class="whitespace-nowrap text-right">{{ formatCurrency(row.billedAmount) }}</td>
              <td class="whitespace-nowrap">{{ row.agingDays }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <div class="modal" data-modal="true" id="rir_detail_modal">
      <div class="modal-content max-w-[900px] modal-center-y">
        <div class="modal-header">
          <h3 class="modal-title text-lg font-semibold text-gray-700">
            Recurring Invoice Reminder - {{ selectedDetail?.invoiceReminder }}
          </h3>
          <button class="btn btn-xs btn-icon btn-light btn-clear" data-modal-dismiss="true">
            <i class="ki-duotone ki-cross"></i>
          </button>
        </div>
        <div class="modal-body p-[16px]">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-semibold text-gray-700">Invoice Reminder</label>
                <p class="text-gray-600">{{ selectedDetail?.invoiceReminder }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Status</label>
                <p class="text-gray-600">{{ selectedDetail?.status }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Due Date</label>
                <p class="text-gray-600">{{ formatDate(selectedDetail?.dueDate) }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Periode</label>
                <p class="text-gray-600">{{ selectedDetail?.periode }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Invoice Type</label>
                <p class="text-gray-600">{{ selectedDetail?.invoiceType }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Activity Code</label>
                <p class="text-gray-600">{{ selectedDetail?.activityCode }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Activity Name</label>
                <p class="text-gray-600">{{ selectedDetail?.activityName }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Billed Amount</label>
                <p class="text-gray-600">{{ formatCurrency(selectedDetail?.billedAmount) }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700">Aging Days</label>
                <p class="text-gray-600">{{ selectedDetail?.agingDays }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { KTModal } from '@/metronic/core'

const FilterList = defineAsyncComponent(() => import('./recurringInvoiceReminderFilter.vue'))

interface RecurringInvoiceReminder {
  invoiceReminder: string
  dueDate: string
  status: string
  periode: string
  invoiceType: string
  activityCode: string
  activityName: string
  billedAmount: number
  agingDays: string
}

interface filterListTypes {
  status: string
  periode: string
  invoiceType: string
}

const routes = [
  { label: 'Home', url: '/' },
  { label: 'Recurring Invoice Reminder', url: '#' },
] as any

const columns = ref<string[]>([
  'Action',
  'Invoice Reminder',
  'Due Date',
  'Status',
  'Periode',
  'Invoice Type',
  'Activity Code',
  'Activity Name',
  'Billed Amount',
  'Aging Days',
])

const search = ref<string>('')
const sortBy = ref<string>('')
const sortColumnName = ref<string>('')
const selectedDetail = ref<RecurringInvoiceReminder | null>(null)

// Mock data
const mockData: RecurringInvoiceReminder[] = [
  {
    invoiceReminder: 'IR0000000001',
    dueDate: '2026-01-01',
    status: 'Open',
    periode: 'Monthly',
    invoiceType: 'Recurring Expense',
    activityCode: '6302010002',
    activityName: 'Listrik & Air',
    billedAmount: 12000000,
    agingDays: '2 Days',
  },
  {
    invoiceReminder: 'IR0000000002',
    dueDate: '2026-01-01',
    status: 'Paid',
    periode: 'Yearly',
    invoiceType: 'Recurring Expense',
    activityCode: '7102010002',
    activityName: 'Cleaning Service',
    billedAmount: 30000000,
    agingDays: '3 Days',
  },
]

const list = ref<RecurringInvoiceReminder[]>(mockData)

const filterForm = ref<filterListTypes>({
  status: '',
  periode: '',
  invoiceType: '',
})

const statusList = [
  { value: 'Open', label: 'Open' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
]

const filteredPayload = computed(() => {
  const payload = []
  if (filterForm.value.status) {
    payload.push({ key: 'Status', value: filterForm.value.status })
  }
  if (filterForm.value.periode) {
    payload.push({ key: 'Periode', value: filterForm.value.periode })
  }
  if (filterForm.value.invoiceType) {
    payload.push({ key: 'Invoice Type', value: filterForm.value.invoiceType })
  }
  return payload
})

const setDataFilter = (data: any) => {
  filterForm.value = { ...filterForm.value, ...data }
  filterData()
}

const filterData = () => {
  let filtered = mockData

  if (filterForm.value.status) {
    filtered = filtered.filter((item) => item.status === filterForm.value.status)
  }
  if (filterForm.value.periode) {
    filtered = filtered.filter((item) => item.periode === filterForm.value.periode)
  }
  if (filterForm.value.invoiceType) {
    filtered = filtered.filter((item) => item.invoiceType === filterForm.value.invoiceType)
  }

  list.value = filtered
}

const deleteFilter = (key: string) => {
  if (key === 'Status') filterForm.value.status = ''
  if (key === 'Periode') filterForm.value.periode = ''
  if (key === 'Invoice Type') filterForm.value.invoiceType = ''
  filterData()
}

const resetFilter = () => {
  filterForm.value = { status: '', periode: '', invoiceType: '' }
  list.value = mockData
}

const goSearch = () => {
  if (search.value) {
    list.value = mockData.filter(
      (item) =>
        item.invoiceReminder.toLowerCase().includes(search.value.toLowerCase()) ||
        item.activityName.toLowerCase().includes(search.value.toLowerCase()),
    )
  } else {
    list.value = mockData
  }
}

const sortColumn = (column: string) => {
  if (sortColumnName.value === column) {
    sortBy.value = sortBy.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = 'asc'
    sortColumnName.value = column
  }
}

const openDetailModal = (row: RecurringInvoiceReminder) => {
  selectedDetail.value = row
  const modal = KTModal.getInstance(document.querySelector('#rir_detail_modal'))
  modal?.show()
}

const formatDate = (date: string | undefined): string => {
  if (!date) return '-'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  return new Date(date).toLocaleDateString('de-DE', options)
}

const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-yellow-50 text-yellow-700'
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700'
    case 'Pending':
      return 'bg-primary-light text-primary'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}
</script>

<style scoped>
.list__table {
  min-width: 100%;
}

.list__long {
  min-width: 150px;
}
</style>
