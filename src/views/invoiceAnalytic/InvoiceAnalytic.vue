<template>
  <div class="invoice-analytic">
    <Breadcrumb title="Invoice Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading overlay -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-teal-500 animate-spin"></i>
        <p class="mt-3 text-gray-500 text-sm">Loading invoice analytics...</p>
      </div>
    </div>

    <template v-else>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
              append-to-body
            >
              <template #open-indicator>
                <i class="ki-outline ki-down text-gray-500"></i>
              </template>
              <template #deselect="{ deselect }">
                <svg
                  @click="deselect"
                  class="cursor-pointer"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-linecap="round"
                >
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
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
        <!-- Section 1: Accounts Payable Overview -->
        <div class="col-span-12">
          <p class="section-label">
            <i class="ki-duotone ki-calculator text-teal-500 mr-1"></i> Accounts Payable Overview
          </p>
        </div>
        <!-- Row 1: AP Aging, Total Outstanding, Invoice Status Monitoring -->
        <div class="col-span-5 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title">
              <i class="ki-duotone ki-time text-teal-500"></i>
              Accounts Payable Aging
            </h3>
          </div>
          <div class="chart-with-labels">
            <div class="mini-trend-chart" style="block-size: 220px">
              <div class="trend-bars aging-bars">
                <div
                  v-for="(item, idx) in visualApAgingData"
                  :key="`aging-${idx}`"
                  class="trend-bar"
                >
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size':
                        (item.amount /
                          (Math.max(...lastFilteredApAgingData.map((i) => i.amount)) || 1)) *
                          100 +
                        '%',
                      'background-color': '#14B8A6',
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels aging-labels">
              <div
                v-for="(item, idx) in lastFilteredApAgingData"
                :key="`aging-label-${idx}`"
                class="chart-bottom-label"
              >
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
              <h3 class="chart-title justify-center text-sm" style="font-size: 0.875rem;">
                <i class="ki-duotone ki-dollar text-teal-500"></i>
                Total AP Outstanding
              </h3>
            </div>
            <div
              class="metric-content flex-grow flex flex-col items-center text-center justify-center"
            >
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
            <h3 class="chart-title">
              <i class="ki-duotone ki-chart-line text-blue-500"></i>
              Invoice Status Monitoring
            </h3>
          </div>
          <div class="chart-with-labels">
            <div class="mini-trend-chart" style="block-size: 220px">
              <div class="trend-bars status-bars">
                <div
                  v-for="(status, idx) in visualInvoiceStatusData"
                  :key="`status-${idx}`"
                  class="trend-bar"
                >
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size':
                        (status.amount /
                          (Math.max(...lastInvoiceStatusData.map((i) => i.amount)) || 1)) *
                          100 +
                        '%',
                      'background-color': status.color,
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels status-labels">
              <div
                v-for="(status, idx) in lastInvoiceStatusData"
                :key="`status-label-${idx}`"
                class="chart-bottom-label"
              >
                <div class="font-medium text-gray-900 text-xs">{{ status.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: AP Performance Trends -->
        <div class="col-span-12 mt-4">
          <p class="section-label">
            <i class="ki-duotone ki-chart-line-star text-purple-500 mr-1"></i> AP Performance Trends
          </p>
        </div>

        <!-- Row 2: Invoices Paid On Time and Average Age -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title mb-0">
              <i class="ki-duotone ki-shield-tick text-green-600"></i>
              Invoices Paid On Time
            </h3>
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
            <div
              class="line-chart-wrapper flex-grow"
              style="block-size: 200px"
              @wheel.passive.prevent="handleWheelPaidOnTime($event)"
            >
              <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="paidOnTimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#bbf7d0" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="#bbf7d0" stop-opacity="0.05" />
                  </linearGradient>
                </defs>
                <path :d="paidOnTimeAreaPath" fill="url(#paidOnTimeGradient)" class="area-path" />
                <path
                  :d="paidOnTimeLinePath"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="2"
                  class="line-path"
                />
              </svg>
              <div class="chart-labels">
                <div
                  v-for="(data, index) in paidOnTimeVisibleLabels"
                  :key="index"
                  class="chart-label"
                >
                  {{ data }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Age at Payment Chart -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title mb-0">
              <i class="ki-duotone ki-time text-orange-500"></i>
              Average Age at Payment
            </h3>
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
            <div
              class="line-chart-wrapper flex-grow"
              style="block-size: 200px"
              @wheel.passive.prevent="handleWheelAvgAge($event)"
            >
              <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="avgAgeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.95" />
                    <stop offset="100%" stop-color="#ffedd5" stop-opacity="0.05" />
                  </linearGradient>
                </defs>
                <path :d="avgAgeAreaPath" fill="url(#avgAgeGradient)" class="area-path" />
                <path
                  :d="avgAgeLinePath"
                  fill="none"
                  stroke="#f59e0b"
                  stroke-width="2"
                  class="line-path"
                />
              </svg>
              <div class="chart-labels">
                <div v-for="(data, index) in avgAgeVisibleLabels" :key="index" class="chart-label">
                  {{ data }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: AP Analysis Trends -->
        <div class="col-span-12 mt-4">
          <p class="section-label">
            <i class="ki-duotone ki-element-11 text-blue-500 mr-1"></i> AP Analysis Trends
          </p>
        </div>

        <!-- Row 3: AP Summary and Aging Trends -->
        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title mb-0">
              <i class="ki-duotone ki-chart-line-star text-teal-500"></i>
              AP Summary Trend
            </h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #14b8a6"></div>
              <span>Summary Trend</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendCountData" :key="index" class="trend-bar">
                <div
                  class="trend-bar-base"
                  :style="{
                    'block-size': (data.trendValue / maxTrendCountValue) * 100 + '%',
                    'background-color': '#14B8A6',
                    position: 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '0',
                    'inset-inline-end': '0',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- AP Aging Trends -->
        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title mb-0">
              <i class="ki-duotone ki-package text-teal-500"></i>
              AP Aging Trend (Count)
            </h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #14b8a6"></div>
              <span>Invoice Count</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendCountData" :key="index" class="trend-bar">
                <div
                  class="trend-bar-base"
                  :style="{
                    'block-size': (data.trendValue / maxTrendCountValue) * 100 + '%',
                    'background-color': '#14B8A6',
                    position: 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '0',
                    'inset-inline-end': '0',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="chart-title mb-0">
              <i class="ki-duotone ki-dollar text-teal-500"></i>
              AP Aging Trend (Amount)
            </h3>
          </div>
          <div class="chart-legend mb-3 flex gap-4">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #14b8a6"></div>
              <span>Invoice Amount</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in agingTrendAmountData" :key="index" class="trend-bar">
                <div
                  class="trend-bar-base"
                  :style="{
                    'block-size': (data.trendValue / maxTrendAmountValue) * 100 + '%',
                    'background-color': '#14B8A6',
                    position: 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '0',
                    'inset-inline-end': '0',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const isAllFilterEmpty = computed(() => {
  // Hanya filter selain date yang dicek
  return (
    (companyCode.value === '' || companyCode.value === null) &&
    (vendor.value === '' || vendor.value === null) &&
    poType.value === null &&
    (invoiceType.value === '' || invoiceType.value === null) &&
    (departement.value === '' || departement.value === null)
  )
})
import { ref, onMounted, computed, watch, shallowRef } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { AgingPeriod, InvoiceStatusItem, TimeSeriesChartItem } from './types/InvoiceAnalytic'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { format } from 'date-fns'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import InvoiceAnalyticsService, { type InvoiceAnalyticsData } from '@/services/invoiceAnalytics.service'

const invoiceMasterApi = useInvoiceMasterDataStore()
const dbAnalytics = ref<InvoiceAnalyticsData | null>(null)
const isLoading = ref(true)

const routes = ref<routeTypes[]>([
  {
    name: 'Analytic Dashboard',
    to: '#',
  },
])

const companyCode = ref('')
const vendor = ref('')
const poType = ref<number | null>(null)
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
    name: 'Invoice PO',
    code: 1,
  },
  {
    name: 'Invoice Non PO',
    code: 2,
  },
])

const staticDataMap: Record<string, Record<string, AgingPeriod[]>> = {
  MF00: {
    '': [
      { period: 'Current', amount: 500000, count: 50 },
      { period: '1-30', amount: 400000, count: 40 },
      { period: '31-60', amount: 300000, count: 30 },
      { period: '> 60', amount: 360000, count: 36 },
    ],
    VEND01: [
      { period: 'Current', amount: 200000, count: 20 },
      { period: '1-30', amount: 150000, count: 15 },
      { period: '31-60', amount: 100000, count: 10 },
      { period: '> 60', amount: 50000, count: 5 },
    ],
  },
  MF01: {
    '': [
      { period: 'Current', amount: 2500000, count: 250 },
      { period: '1-30', amount: 1500000, count: 150 },
      { period: '31-60', amount: 1000000, count: 100 },
      { period: '> 60', amount: 800000, count: 80 },
    ],
  },
  MF02: {
    '': [
      { period: 'Current', amount: 1000000, count: 100 },
      { period: '1-30', amount: 800000, count: 80 },
      { period: '31-60', amount: 430000, count: 43 },
      { period: '> 60', amount: 400000, count: 40 },
    ],
  },
}

const apAgingData = computed<AgingPeriod[]>(() => {
  if (dbAnalytics.value) {
    return [
      { period: 'Current', amount: dbAnalytics.value.agingCurrentAmount, count: dbAnalytics.value.agingCurrentCount },
      { period: '1-30', amount: dbAnalytics.value.aging1To30Amount, count: dbAnalytics.value.aging1To30Count },
      { period: '31-60', amount: dbAnalytics.value.aging31To60Amount, count: dbAnalytics.value.aging31To60Count },
      { period: '> 60', amount: dbAnalytics.value.agingMoreThan60Amount, count: dbAnalytics.value.agingMoreThan60Count },
    ]
  }

  if (!companyCode.value) {
    const periods = ['Current', '1-30', '31-60', '> 60']
    return periods.map((p) => {
      let totalAmount = 0
      let totalCount = 0
      Object.keys(staticDataMap).forEach((cc) => {
        const item = staticDataMap[cc]['']?.find((i) => i.period === p)
        if (item) {
          totalAmount += item.amount
          totalCount += item.count
        }
      })
      return { period: p, amount: totalAmount, count: totalCount }
    })
  }

  const company = companyCode.value
  const vendorVal = vendor.value || ''
  if (staticDataMap[company] && staticDataMap[company][vendorVal]) {
    return staticDataMap[company][vendorVal]
  }
  // fallback if vendor specific not found
  if (staticDataMap[company] && staticDataMap[company]['']) {
    return staticDataMap[company]['']
  }
  return staticDataMap['MF00']['']
})

function computeInvoiceStatusData(isVisual = false) {
  const multiplier = getFilterMultiplier()
  const appliedMultiplier = isAllFilterEmpty.value ? 1 : multiplier

  const base = dbAnalytics.value
    ? [
        { label: 'Submitted', amount: dbAnalytics.value.statusSubmittedAmount, count: dbAnalytics.value.statusSubmittedCount, color: '#14B8A6' },
        { label: 'In Approval', amount: dbAnalytics.value.statusInApprovalAmount, count: dbAnalytics.value.statusInApprovalCount, color: '#f97316' },
        { label: 'Approved', amount: dbAnalytics.value.statusApprovedAmount, count: dbAnalytics.value.statusApprovedCount, color: '#22c55e' },
        { label: 'Rejected', amount: dbAnalytics.value.statusRejectedAmount, count: dbAnalytics.value.statusRejectedCount, color: '#f472b6' },
        { label: 'Paid', amount: dbAnalytics.value.statusPaidAmount, count: dbAnalytics.value.statusPaidCount, color: '#06b6d4' },
        { label: 'Overdue', amount: dbAnalytics.value.statusOverdueAmount, count: dbAnalytics.value.statusOverdueCount, color: '#ef4444' },
      ]
    : [
        { label: 'Submitted', amount: 10000000, count: 150, color: '#14B8A6' },
        { label: 'In Approval', amount: 4000000, count: 60, color: '#f97316' },
        { label: 'Approved', amount: 8000000, count: 120, color: '#22c55e' },
        { label: 'Rejected', amount: 1000000, count: 15, color: '#f472b6' },
        { label: 'Paid', amount: 6000000, count: 90, color: '#06b6d4' },
        { label: 'Overdue', amount: 3000000, count: 45, color: '#ef4444' },
      ]

  return base.map((item) => {
    const jitter = isVisual ? 0.5 + Math.random() * 1.0 : 1
    return {
      ...item,
      amount: Math.round(item.amount * appliedMultiplier * jitter),
      count: Math.round(item.count * appliedMultiplier * jitter),
    }
  })
}

function computeFilteredApAgingData(isVisual = false) {
  const multiplier = getFilterMultiplier()
  const appliedMultiplier = isAllFilterEmpty.value ? 1 : multiplier

  return apAgingData.value.map((item) => {
    const jitter = isVisual ? 0.5 + Math.random() * 1.0 : 1
    return {
      ...item,
      amount: Math.round(item.amount * appliedMultiplier * jitter),
      count: Math.round(item.count * appliedMultiplier * jitter),
    }
  })
}

// Helper function to calculate multiplier based on filters
const getFilterMultiplier = () => {
  let multiplier = 1

  // Apply vendor filter
  if (vendor.value) {
    multiplier *= 1.5
  }

  // Apply invoice type filter
  if (invoiceType.value) {
    multiplier *= invoiceType.value === '901' ? 0.05 : 1.2
  }

  // Apply department filter
  if (departement.value) {
    multiplier *= 1.1
  }

  // Date range filter is ignored per requirement

  // Apply poType filter
  if (poType.value) {
    multiplier *= poType.value === 1 ? 1.1 : 0.9
  }

  // Clamp multiplier
  return Math.max(0.01, Math.min(multiplier, 10))
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

function computeTimeSeriesData(isVisual = false) {
  const zoom = Math.max(paidOnTimeZoom.value, avgAgeZoom.value)

  if (dbAnalytics.value && dbAnalytics.value.monthlyTrends && dbAnalytics.value.monthlyTrends.length > 0) {
    const multiplier = getFilterMultiplier()
    const appliedMultiplier = isAllFilterEmpty.value ? 1 : multiplier

    return dbAnalytics.value.monthlyTrends.map((item) => {
      const jitter = isVisual ? 0.5 + Math.random() * 1.0 : 1
      return {
        id: item.monthLabel,
        label: item.monthLabel,
        paidOnTime: Math.round(Number(item.paidOnTime) * appliedMultiplier * jitter),
        avgAge: Math.round(Number(item.avgAge) * appliedMultiplier * jitter),
        current: Math.round(Number(item.current) * appliedMultiplier * jitter),
        processing: Math.round(Number(item.processing) * appliedMultiplier * jitter),
        overdue: Math.round(Number(item.overdue) * appliedMultiplier * jitter),
      }
    })
  }

  const baseData =
    zoom <= 1.5
      ? chartData.quarterlyData
      : zoom <= 2.3
        ? chartData.monthlyData
        : chartData.weeklyData
  const multiplier = getFilterMultiplier()
  const appliedMultiplier = isAllFilterEmpty.value ? 1 : multiplier

  return baseData.map((item) => {
    const jitter = isVisual ? 0.5 + Math.random() * 1.0 : 1
    return {
      ...item,
      paidOnTime: Math.round(item.paidOnTime * appliedMultiplier * jitter),
      avgAge: Math.round(item.avgAge * appliedMultiplier * jitter),
      current: Math.round(item.current * appliedMultiplier * jitter),
      processing: Math.round(item.processing * appliedMultiplier * jitter),
      overdue: Math.round(item.overdue * appliedMultiplier * jitter),
    }
  })
}

const totalOutstanding = computed(() => {
  return lastFilteredApAgingData.value.reduce((sum, item) => sum + item.amount, 0)
})

const overduePercentage = computed(() => {
  const total = totalOutstanding.value
  if (!total) return 0
  const overdue = lastFilteredApAgingData.value
    .filter((item) => item.period !== 'Current')
    .reduce((sum, item) => sum + item.amount, 0)
  return Math.round((overdue / total) * 100)
})

const maxAge = computed(() => {
  return Math.max(...lastTimeSeriesData.value.map((item) => item.avgAge)) || 1
})

const agingTrendCountData = computed(() => {
  const totalCount = lastFilteredApAgingData.value.reduce((sum, item) => sum + item.count, 0)
  return visualTimeSeriesData.value.map((item) => ({
    ...item,
    trendValue: Math.round((item.paidOnTime / 100) * totalCount),
  }))
})

const agingTrendAmountData = computed(() => {
  const totalAmount = totalOutstanding.value
  return visualTimeSeriesData.value.map((item) => ({
    ...item,
    trendValue: Math.round((item.avgAge / 100) * totalAmount),
  }))
})

const maxTrendCountValue = computed(() => {
  const totalCount = lastFilteredApAgingData.value.reduce((sum, item) => sum + item.count, 0)
  return (
    Math.max(
      ...lastTimeSeriesData.value.map((item) => Math.round((item.paidOnTime / 100) * totalCount)),
    ) || 1
  )
})

const maxTrendAmountValue = computed(() => {
  const totalAmount = lastFilteredApAgingData.value.reduce((sum, item) => sum + item.amount, 0)
  return (
    Math.max(
      ...lastTimeSeriesData.value.map((item) => Math.round((item.avgAge / 100) * totalAmount)),
    ) || 1
  )
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

const maxPaidOnTime = computed(
  () => Math.max(...lastTimeSeriesData.value.map((d) => d.paidOnTime)) || 1,
)
const paidOnTimePoints = computed(() =>
  buildPointsForSeries(
    visualTimeSeriesData.value.map((d) => d.paidOnTime),
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
const paidOnTimeVisibleLabels = computed(() => lastTimeSeriesData.value.map((d) => formatDate(d)))

const avgAgePoints = computed(() =>
  buildPointsForSeries(
    visualTimeSeriesData.value.map((d) => d.avgAge),
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
const avgAgeVisibleLabels = computed(() => lastTimeSeriesData.value.map((d) => formatDate(d)))

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
// Format Total AP Outstanding: X.XXXK (4 digit, dibulatkan ke atas)
const formatMetricCurrency = (value: number): string => {
  if (!value) return '0K'
  const kValue = Math.ceil(value / 1000)
  return `${kValue.toLocaleString('id-ID')}K`
}
// Format bar chart AP Aging: Rp. XXXK
const formatCurrency = (value: number): string => {
  if (!value) return 'Rp 0K'
  const kValue = Math.ceil(value / 1000)
  return `Rp ${kValue.toLocaleString('id-ID')}K`
}
const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value)

onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()
  await invoiceMasterApi.getVendorList()
  await invoiceMasterApi.getInvoicePoType()
  await invoiceMasterApi.getDpTypes()
  invoiceTypeList.value = invoicePoType.value

  try {
    const res = await InvoiceAnalyticsService.getAnalytics()
    if (res.result && !res.result.isError && res.result.content) {
      dbAnalytics.value = res.result.content
      filterUpdateKey.value++
    }
  } catch (err) {
    console.error('Failed to load invoice analytics:', err)
  } finally {
    isLoading.value = false
  }
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

// Watch for filter changes untuk trigger animasi, kecuali date (date tidak trigger data random baru)
watch(
  [
    () => vendor.value,
    () => invoiceType.value,
    () => departement.value,
    () => poType.value,
    () => companyCode.value,
  ],
  (newVals, oldVals) => {
    // Only increment if any non-date filter actually changed
    let changed = false
    for (let i = 0; i < newVals.length; i++) {
      if (newVals[i] !== oldVals[i]) changed = true
    }
    if (changed) filterUpdateKey.value++
  },
)

// --- Stable Data State for Charts (For Metrics & Labels) ---
const lastFilteredApAgingData = shallowRef<AgingPeriod[]>([])
const lastInvoiceStatusData = shallowRef<InvoiceStatusItem[]>([])
const lastTimeSeriesData = shallowRef<TimeSeriesChartItem[]>([])

// --- Visual Data State (With Jitter for Animation) ---
const visualApAgingData = shallowRef<AgingPeriod[]>([])
const visualInvoiceStatusData = shallowRef<InvoiceStatusItem[]>([])
const visualTimeSeriesData = shallowRef<TimeSeriesChartItem[]>([])

watch(
  filterUpdateKey,
  () => {
    // Update stable data (no randomness)
    lastFilteredApAgingData.value = computeFilteredApAgingData(false)
    lastInvoiceStatusData.value = computeInvoiceStatusData(false)
    lastTimeSeriesData.value = computeTimeSeriesData(false)

    // Update visual data with "drastic" independent jitter per item
    visualApAgingData.value = computeFilteredApAgingData(true)
    visualInvoiceStatusData.value = computeInvoiceStatusData(true)
    visualTimeSeriesData.value = computeTimeSeriesData(true)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
@use './styles/InvoiceAnalytic.scss';
</style>

<style lang="scss">
/* Global styles for vue-select dropdown when appended to body */
.vs__dropdown-menu {
  border-color: #d1d5db !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  font-family: inherit;
  z-index: 9999 !important; /* Ensure it is on top of other elements */
}

.vs__dropdown-option {
  font-size: 0.875rem !important;
  padding: 0.5rem 0.75rem !important;
}

.vs__dropdown-option--highlight {
  background-color: #14b8a6 !important;
  color: white !important;
}

.vs__no-options {
  font-size: 0.875rem !important;
  color: #6b7280 !important;
}
</style>
