// Helper: apakah semua filter kosong?
const isAllFilterEmpty = computed(() => {
  return !companyCode.value && !vendor.value && !poType.value && !invoiceType.value && !departement.value && (!date.value || (!date.value[0] && !date.value[1]))
})
<template>
  <div>
    <Breadcrumb title="Invoice Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Header Section -->
    <div class="header-section bg-white border rounded-lg p-4 mb-6">
      <div class="filter-section">
        <div class="filter-group">
          <label class="text-sm text-gray-600">Company Code</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="companyCode"
              :options="companyCodeList"
              label="name"
              :reduce="(option: any) => option.code"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Vendor</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="vendor"
              :options="vendorList"
              label="vendorName"
              :reduce="(option: any) => option.vendorCode"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Po Type</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="poType"
              :options="poList"
              label="name"
              :reduce="(option: any) => option.code"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Invoice Type</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="invoiceType"
              :options="invoiceTypeList"
              label="name"
              :reduce="(option: any) => option.code"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group" v-if="invoiceType === '901'">
          <label class="text-sm text-gray-600">Dp Option</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="dpOption"
              :options="dpOptionList"
              label="name"
              :reduce="(option: any) => option.code"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Department</label>
          <div class="filter-select-wrapper">
            <v-select
              v-model="departement"
              :options="constCenterList"
              label="name"
              :reduce="(option: any) => option.code"
              placeholder="Select"
              :clearable="true"
              class="filter-vselect"
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg @click="deselect" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6b7280" stroke-width="1" stroke-linecap="round"><path d="M2 2L12 12M12 2L2 12"/></svg>
              </template>
            </v-select>
          </div>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Date Range</label>
          <DatePicker v-model="date" format="yyyy/MM/dd" teleport :min-days="7" :range="true" />
        </div>
      </div>
    </div>

    <!-- Analytics Metrics Container -->
    <div class="analytics-metrics-container">
      <!-- Main Grid -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Row 1: AP Aging, Total Outstanding, Invoice Status Monitoring -->
        <div class="col-span-5 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Accounts Payable Aging</h3>
          </div>
          <div class="chart-with-labels">
            <div class="mini-trend-chart" style="block-size: 220px">
              <div class="trend-bars aging-bars">
                <div v-for="(item, idx) in filteredApAgingData" :key="`aging-${idx}`" class="trend-bar">
                  <div class="trend-bar-base" :style="{
                    'block-size': (item.amount / maxAmount) * 100 + '%',
                    'background-color': '#3b82f6',
                    position: 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '0',
                    'inset-inline-end': '0',
                  }"></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels aging-labels">
              <div v-for="(item, idx) in filteredApAgingData" :key="`aging-label-${idx}`" class="chart-bottom-label">
                <div class="font-medium text-gray-900 text-xs">{{ item.period }}</div>
                <div class="text-xs text-gray-700">{{ formatCurrency(item.amount) }}</div>
                <div class="text-xs text-gray-500">{{ formatNumber(item.count) }} inv</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total AP Outstanding -->
        <div class="col-span-2 bg-white border rounded-lg p-4">
          <div class="metric-card h-full">
            <div class="metric-header">
              <h3 class="text-sm font-semibold text-center">Total AP Outstanding</h3>
            </div>
            <div class="metric-content flex-grow flex flex-col items-center text-center justify-center">
              <div class="mb-3">
                <div class="text-2xl font-bold text-gray-900">
                  {{ formatMetricCurrency(totalOutstanding) }}
                </div>
                <div class="text-xs text-gray-600 mt-1">Invoice SUM</div>
              </div>
              <div class="metric-divider my-2"></div>
              <div class="mt-2">
                <div class="text-2xl font-semibold text-red-500">{{ overduePercentage }}%</div>
                <div class="text-xs text-gray-600 mt-1">Invoice Overdue</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Status Monitoring -->
        <div class="col-span-5 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Invoice Status Monitoring</h3>
          </div>
          <div class="chart-with-labels">
            <div class="mini-trend-chart" style="block-size: 220px">
              <div class="trend-bars status-bars">
                <div v-for="(status, idx) in invoiceStatusData" :key="`status-${idx}`" class="trend-bar">
                  <div class="trend-bar-base" :style="{
                    'block-size': (status.amount / maxStatusAmount) * 100 + '%',
                    'background-color': status.color,
                    position: 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '0',
                    'inset-inline-end': '0',
                  }"></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels status-labels">
              <div v-for="(status, idx) in invoiceStatusData" :key="`status-label-${idx}`" class="chart-bottom-label">
                <div class="font-medium text-gray-900 text-xs">{{ status.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Invoices Paid On Time and Average Age -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Invoices Paid On Time</h3>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="hidden sm:inline">(Use mouse wheel to zoom)</span>
              <div class="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1">
                <button @click="zoomOutPaidOnTime" class="px-2 py-1 bg-white border rounded">
                  -
                </button>
                <div class="px-2">{{ paidOnTimeZoom.toFixed(1) }}x</div>
                <button @click="zoomInPaidOnTime" class="px-2 py-1 bg-white border rounded">
                  +
                </button>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="revenue-label writing-vertical text-gray-500 mr-2">Revenue</div>
            <div class="line-chart-wrapper flex-grow" style="block-size: 200px"
              @wheel.passive.prevent="handleWheelPaidOnTime($event)">
              <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="paidOnTimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#bbf7d0" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="#bbf7d0" stop-opacity="0.05" />
                  </linearGradient>
                </defs>
                <path :d="paidOnTimeAreaPath" fill="url(#paidOnTimeGradient)" class="area-path" />
                <path :d="paidOnTimeLinePath" fill="none" stroke="#10b981" stroke-width="2" class="line-path" />
              </svg>
              <div class="chart-labels">
                <div v-for="(data, index) in paidOnTimeVisibleLabels" :key="index" class="chart-label">
                  {{ data }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Age at Payment Chart -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Average Age at Payment</h3>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="hidden sm:inline">(Use mouse wheel to zoom)</span>
              <div class="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1">
                <button @click="zoomOutAvgAge" class="px-2 py-1 bg-white border rounded">-</button>
                <div class="px-2">{{ avgAgeZoom.toFixed(1) }}x</div>
                <button @click="zoomInAvgAge" class="px-2 py-1 bg-white border rounded">+</button>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="revenue-label writing-vertical text-gray-500 mr-2">Revenue</div>
            <div class="line-chart-wrapper flex-grow" style="block-size: 200px"
              @wheel.passive.prevent="handleWheelAvgAge($event)">
              <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="avgAgeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.95" />
                    <stop offset="100%" stop-color="#ffedd5" stop-opacity="0.05" />
                  </linearGradient>
                </defs>
                <path :d="avgAgeAreaPath" fill="url(#avgAgeGradient)" class="area-path" />
                <path :d="avgAgeLinePath" fill="none" stroke="#f59e0b" stroke-width="2" class="line-path" />
              </svg>
              <div class="chart-labels">
                <div v-for="(data, index) in avgAgeVisibleLabels" :key="index" class="chart-label">
                  {{ data }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 3: AP Summary and Aging Trends -->
        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">AP Summary Trend</h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #3b82f6"></div>
              <span>Summary Trend</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendCountData" :key="index" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (data.trendValue / maxTrendCountValue) * 100 + '%',
                  'background-color': '#3b82f6',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- AP Aging Trends -->
        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">AP Aging Trend (Count)</h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #3b82f6"></div>
              <span>Invoice Count</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendCountData" :key="index" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (data.trendValue / maxTrendCountValue) * 100 + '%',
                  'background-color': '#3b82f6',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">AP Aging Trend (Amount)</h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #3b82f6"></div>
              <span>Invoice Amount</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendAmountData" :key="index" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (data.trendValue / maxTrendAmountValue) * 100 + '%',
                  'background-color': '#3b82f6',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Helper: apakah semua filter kosong?
const isAllFilterEmpty = computed(() => {
  return !companyCode.value && !vendor.value && !poType.value && !invoiceType.value && !departement.value && (!date.value || (!date.value[0] && !date.value[1]))
})
import { ref, onMounted, computed, watch } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { AgingPeriod } from './types/InvoiceAnalytic'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { format } from 'date-fns'
import DatePicker from '@/components/datePicker/DatePicker.vue'

const invoiceMasterApi = useInvoiceMasterDataStore()

const routes = ref<routeTypes[]>([
  {
    name: 'Analytic Dashboard',
    to: '#',
  },
])

const companyCode = ref('MF00')
const vendor = ref('')
const poType = ref<number | null>(1)
const invoiceType = ref('')
const dpOption = ref('')
const departement = ref('')
const date = ref<[Date | null, Date | null] | null>([null, null])
const filterUpdateKey = ref(0)

const invoiceTypeList = ref([])

const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const vendorList = computed(() => invoiceMasterApi.vendorList)
const invoiceNonPoType = computed(() => invoiceMasterApi.invoiceNonPoType)
const invoicePoType = computed(() => invoiceMasterApi.invoicePoType)
const dpOptionList = computed(() => invoiceMasterApi.dpType)
const constCenterList = computed(() => invoiceMasterApi.costCenterList)

const poList = ref([
  {
    name: "Invoice PO",
    code: 1
  },
  {
    name: "Invoice Non PO",
    code: 2
  }
])

// Data and computed values
const apAgingData = ref<AgingPeriod[]>([
  { period: 'Current', amount: 9500000, count: 150 },
  { period: '1-30', amount: 6500000, count: 100 },
  { period: '31-60', amount: 2500000, count: 40 },
  { period: '> 60', amount: 7000000, count: 90 },
])

// Invoice Status Data for monitoring chart
const invoiceStatusData = computed(() => {
  void filterUpdateKey.value
  const multiplier = getFilterMultiplier()
  if (isAllFilterEmpty.value) {
    return [
      { label: 'Submitted', amount: 0, count: 0, color: '#3b82f6' },
      { label: 'In Approval', amount: 0, count: 0, color: '#f97316' },
      { label: 'Approved', amount: 0, count: 0, color: '#22c55e' },
      { label: 'Rejected', amount: 0, count: 0, color: '#f472b6' },
      { label: 'Paid', amount: 0, count: 0, color: '#06b6d4' },
      { label: 'Overdue', amount: 0, count: 0, color: '#ef4444' },
    ]
  }
  return [
    { label: 'Submitted', amount: Math.round(10000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(150 * multiplier * (0.5 + Math.random() * 1.5)), color: '#3b82f6' },
    { label: 'In Approval', amount: Math.round(4000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(60 * multiplier * (0.5 + Math.random() * 1.5)), color: '#f97316' },
    { label: 'Approved', amount: Math.round(8000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(120 * multiplier * (0.5 + Math.random() * 1.5)), color: '#22c55e' },
    { label: 'Rejected', amount: Math.round(1000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(15 * multiplier * (0.5 + Math.random() * 1.5)), color: '#f472b6' },
    { label: 'Paid', amount: Math.round(6000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(90 * multiplier * (0.5 + Math.random() * 1.5)), color: '#06b6d4' },
    { label: 'Overdue', amount: Math.round(3000000 * multiplier * (0.5 + Math.random() * 1.5)), count: Math.round(45 * multiplier * (0.5 + Math.random() * 1.5)), color: '#ef4444' },
  ]
})

const maxStatusAmount = computed(() => {
  return Math.max(...invoiceStatusData.value.map(item => item.amount)) || 1
})

// Filter applied data
// Filter applied data with random jitter for animation effect
const filteredApAgingData = computed(() => {
  // Use filterUpdateKey to trigger re-calculation with fresh random values
  void filterUpdateKey.value
  if (isAllFilterEmpty.value) {
    return apAgingData.value.map(item => ({ ...item, amount: 0, count: 0 }))
  }
  return apAgingData.value.map(item => {
    const jitter = 0.5 + Math.random() * 1.5 // Random between 0.5 and 2.0
    return {
      ...item,
      amount: Math.round(item.amount * getFilterMultiplier() * jitter),
      count: Math.round(item.count * getFilterMultiplier() * jitter)
    }
  })
})

// Helper function to calculate multiplier based on filters
const getFilterMultiplier = () => {
  let multiplier = 1

  // Apply vendor filter
  if (vendor.value) {
    multiplier *= 10
  }

  // Apply invoice type filter
  if (invoiceType.value) {
    multiplier *= (invoiceType.value === '901' ? 0.05 : 10)
  }

  // Apply department filter
  if (departement.value) {
    multiplier *= 10
  }

  // Apply date range filter
  if (date.value && (date.value[0] || date.value[1])) {
    multiplier *= 0.05
  }

  // Apply poType filter
  if (poType.value) {
    multiplier *= (poType.value === 1 ? 10 : 0.1)
  }

  // Apply companyCode filter
  if (companyCode.value) {
    multiplier *= 10
  }

  // Clamp multiplier to a much wider range for more significant effect
  return Math.max(0.01, Math.min(multiplier, 1000))
}

// Create data for time series visualization
const generateData = () => {
  const weeklyData = Array.from({ length: 5 }, (_, weekIndex) => ({
    id: `week-${weekIndex + 1}`,
    label: `Week ${weekIndex + 1}`,
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10,
    current: Math.random() * 30 + 10,
    processing: Math.random() * 30 + 10,
    overdue: Math.random() * 20 + 5,
  }))

  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => ({
    id: `month-${monthIndex}`,
    label: format(new Date(2025, monthIndex, 1), 'MMM'),
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10,
    current: Math.random() * 30 + 10,
    processing: Math.random() * 30 + 10,
    overdue: Math.random() * 20 + 5,
  }))

  const quarterlyData = Array.from({ length: 4 }, (_, quarterIndex) => ({
    id: `quarter-${quarterIndex}`,
    label: `Q${quarterIndex + 1}`,
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10,
    current: Math.random() * 30 + 10,
    processing: Math.random() * 30 + 10,
    overdue: Math.random() * 20 + 5,
  }))

  return {
    weeklyData,
    monthlyData,
    quarterlyData,
  }
}

const chartData = generateData()

const timeSeriesData = computed(() => {
  const zoom = Math.max(paidOnTimeZoom.value, avgAgeZoom.value)
  const baseData = zoom <= 1.5 ? chartData.quarterlyData : zoom <= 2.3 ? chartData.monthlyData : chartData.weeklyData
  const multiplier = getFilterMultiplier()
  if (isAllFilterEmpty.value) {
    return baseData.map(item => ({
      ...item,
      paidOnTime: 0,
      avgAge: 0,
      current: 0,
      processing: 0,
      overdue: 0,
    }))
  }
  return baseData.map(item => {
    const jitter = 0.5 + Math.random() * 1.5 // Random between 0.5 and 2.0
    return {
      ...item,
      paidOnTime: Math.round(item.paidOnTime * multiplier * jitter),
      avgAge: Math.round(item.avgAge * multiplier * jitter),
      current: Math.round(item.current * multiplier * jitter),
      processing: Math.round(item.processing * multiplier * jitter),
      overdue: Math.round(item.overdue * multiplier * jitter),
    }
  })
})

const totalOutstanding = computed(() => {
  return filteredApAgingData.value.reduce((sum, item) => sum + item.amount, 0)
})

const overduePercentage = computed(() => {
  const total = totalOutstanding.value
  if (!total) return 0
  const overdue = filteredApAgingData.value
    .filter((item) => item.period !== 'Current')
    .reduce((sum, item) => sum + item.amount, 0)
  return Math.round((overdue / total) * 100)
})

const maxAmount = computed(() => {
  return Math.max(...filteredApAgingData.value.map((item) => item.amount)) || 1
})

const maxAge = computed(() => {
  return Math.max(...timeSeriesData.value.map((item) => item.avgAge)) || 1
})

const agingTrendCountData = computed(() => {
  const totalCount = filteredApAgingData.value.reduce((sum, item) => sum + item.count, 0)
  return timeSeriesData.value.map(item => ({
    ...item,
    trendValue: Math.round((item.paidOnTime / 100) * totalCount)
  }))
})

const agingTrendAmountData = computed(() => {
  const totalAmount = totalOutstanding.value
  return timeSeriesData.value.map(item => ({
    ...item,
    trendValue: Math.round((item.avgAge / 100) * totalAmount)
  }))
})

const maxTrendCountValue = computed(() => {
  return Math.max(...agingTrendCountData.value.map(item => item.trendValue)) || 1
})

const maxTrendAmountValue = computed(() => {
  return Math.max(...agingTrendAmountData.value.map(item => item.trendValue)) || 1
})

const paidOnTimeZoom = ref(1)
const avgAgeZoom = ref(1)

function catmullRom2bezier(points: { x: number; y: number }[]) {
  const d = [] as string[]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const bp1x = p1.x + (p2.x - p0.x) / 6
    const bp1y = p1.y + (p2.y - p0.y) / 6
    const bp2x = p2.x - (p3.x - p1.x) / 6
    const bp2y = p2.y - (p3.y - p1.y) / 6
    d.push(`C ${bp1x},${bp1y} ${bp2x},${bp2y} ${p2.x},${p2.y}`)
  }
  return d.join(' ')
}

function buildPointsForSeries(values: number[], normalizeTo = 100, zoom = 1) {
  const n = values.length
  const center = 0.5
  return values.map((v, i) => {
    const t = i / (n - 1)
    const x = (t - center) * 300 * zoom + 150
    let y = 100 - (v / normalizeTo) * 100
    if (y < 0) y = 0
    if (y > 100) y = 100
    return { x, y }
  })
}

const maxPaidOnTime = computed(() => Math.max(...timeSeriesData.value.map((d) => d.paidOnTime)))
const paidOnTimePoints = computed(() =>
  buildPointsForSeries(
    timeSeriesData.value.map((d) => d.paidOnTime),
    Math.max(100, maxPaidOnTime.value),
    paidOnTimeZoom.value,
  ),
)
const paidOnTimeLinePath = computed(() => {
  const pts = paidOnTimePoints.value
  if (!pts.length) return ''
  const move = `M ${pts[0].x},${pts[0].y}`
  const curve = catmullRom2bezier(pts)
  return `${move} ${curve}`
})
const paidOnTimeAreaPath = computed(() => {
  const pts = paidOnTimePoints.value
  if (!pts.length) return ''
  const line = paidOnTimeLinePath.value
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L ${last.x},100 L ${first.x},100 Z`
})
const paidOnTimeVisibleLabels = computed(() => timeSeriesData.value.map((d) => formatDate(d)))

const avgAgePoints = computed(() =>
  buildPointsForSeries(
    timeSeriesData.value.map((d) => d.avgAge),
    maxAge.value || 1,
    avgAgeZoom.value,
  ),
)
const avgAgeLinePath = computed(() => {
  const pts = avgAgePoints.value
  if (!pts.length) return ''
  const move = `M ${pts[0].x},${pts[0].y}`
  const curve = catmullRom2bezier(pts)
  return `${move} ${curve}`
})
const avgAgeAreaPath = computed(() => {
  const pts = avgAgePoints.value
  if (!pts.length) return ''
  const line = avgAgeLinePath.value
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L ${last.x},100 L ${first.x},100 Z`
})
const avgAgeVisibleLabels = computed(() => timeSeriesData.value.map((d) => formatDate(d)))

const zoomInPaidOnTime = () => {
  let newZoom = paidOnTimeZoom.value
  if (newZoom <= 1.5) newZoom = 1.6
  else if (newZoom <= 2.3) newZoom = 2.4
  paidOnTimeZoom.value = Math.min(3, newZoom)
}
const zoomOutPaidOnTime = () => {
  let newZoom = paidOnTimeZoom.value
  if (newZoom >= 2.4) newZoom = 2.3
  else if (newZoom >= 1.6) newZoom = 1.5
  paidOnTimeZoom.value = Math.max(1, newZoom)
}
const handleWheelPaidOnTime = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomInPaidOnTime()
  else zoomOutPaidOnTime()
}
const zoomInAvgAge = () => {
  let newZoom = avgAgeZoom.value
  if (newZoom <= 1.5) newZoom = 1.6
  else if (newZoom <= 2.3) newZoom = 2.4
  avgAgeZoom.value = Math.min(3, newZoom)
}
const zoomOutAvgAge = () => {
  let newZoom = avgAgeZoom.value
  if (newZoom >= 2.4) newZoom = 2.3
  else if (newZoom >= 1.6) newZoom = 1.5
  avgAgeZoom.value = Math.max(1, newZoom)
}
const handleWheelAvgAge = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomInAvgAge()
  else zoomOutAvgAge()
}

const formatDate = (item: { label: string }): string => item.label
const formatMetricCurrency = (value: number): string => {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(2)} M`
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(2)} Jt`
  return formatCurrency(value)
}
const formatCurrency = (value: number): string => {
  // Add random jitter to currency for demo effect
  const jitter = 0.9 + Math.random() * 0.2 // 0.9 - 1.1
  const displayValue = value * jitter
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayValue)
}
const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value)

onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()
  await invoiceMasterApi.getVendorList()
  await invoiceMasterApi.getInvoicePoType()
  await invoiceMasterApi.getDpTypes()
  invoiceTypeList.value = invoicePoType.value
})

watch(
  () => poType.value,
  async () => {
    if (poType.value === null) {
      invoiceTypeList.value = []
    } else if (poType.value === 1) {
      await invoiceMasterApi.getInvoicePoType()
      invoiceTypeList.value = invoicePoType.value
    } else {
      await invoiceMasterApi.getInvoiceNonPoType()
      invoiceTypeList.value = invoiceNonPoType.value
    }
  },
  { deep: true },
)

watch(
  () => companyCode.value,
  () => {
    if (companyCode.value) invoiceMasterApi.getCostCenter(companyCode.value || '')
  },
  { immediate: true },
)

// Watch for filter changes to ensure reactivity and trigger animations
watch(
  [
    () => vendor.value,
    () => invoiceType.value,
    () => departement.value,
    () => date.value,
    () => poType.value,
    () => companyCode.value
  ],
  () => {
    filterUpdateKey.value++
  }
)
</script>

<style lang="scss" scoped>
@use './styles/InvoiceAnalytic.scss';
</style>
