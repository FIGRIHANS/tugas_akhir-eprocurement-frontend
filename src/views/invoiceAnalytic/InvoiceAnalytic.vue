<template>
  <div>
    <Breadcrumb title="Invoice Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Header Section -->
    <div class="header-section bg-white border rounded-lg p-4 mb-6">
      <div class="filter-section">
        <div class="filter-group">
          <label class="text-sm text-gray-600">Entity</label>
          <select v-model="companyCode" class="select">
            <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Vendor</label>
          <select v-model="vendor" class="select">
            <option v-for="item of vendorList" :key="item.vendorId" :value="item.vendorCode">
              {{ item.vendorName }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Po Type</label>
          <select v-model="poType" class="select">
            <option v-for="item of poList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Invoice Type</label>
          <select v-model="invoiceType" class="select">
            <option v-for="item of invoiceTypeList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-group" v-if="invoiceType === '901'">
          <label class="text-sm text-gray-600">Dp Option</label>
          <select v-model="dpOption" class="select">
            <option v-for="item of dpOptionList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="text-sm text-gray-600">Department</label>
          <select v-model="departement" class="select">
            <option v-for="item of constCenterList" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
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
        <!-- Row 1: AP Aging, Total Outstanding, Upcoming Payments -->
        <div class="col-span-5 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Accounts Payable Aging</h3>
          </div>
          <div class="mini-trend-chart" style="block-size: 300px">
            <div class="trend-bars">
              <div v-for="(item, idx) in filteredApAgingData" :key="`aging-${idx}`" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (item.amount / maxAmount) * 100 + '%',
                  'background-color': '#3b82f6',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                }"></div>
                <div class="trend-bar-label" style="inset-block-start: -3rem;">
                  <div style="font-weight: 500; color: #111827;">{{ item.period }}</div>
                  <div style="font-size: 0.7rem; margin-top: 2px;">{{ formatCurrency(item.amount) }}</div>
                  <div style="font-size: 0.7rem; color: #6b7280;">{{ formatNumber(item.count) }} inv</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total AP Outstanding -->
        <div class="col-span-3 bg-white border rounded-lg p-4">
          <div class="metric-card h-full">
            <div class="metric-header">
              <h3 class="text-lg font-semibold">Total AP Outstanding</h3>
            </div>
            <div class="metric-content flex-grow flex flex-col items-center text-center">
              <div class="mt-6 mb-2">
                <div class="metric-value text-4xl font-bold text-gray-900">
                  {{ formatMetricCurrency(totalOutstanding) }}
                </div>
                <div class="metric-label text-xl text-gray-600">Invoice SUM</div>
              </div>
              <div class="metric-divider my-4"></div>
              <div class="mb-6">
                <div class="text-2xl font-semibold text-red-500">{{ overduePercentage }}%</div>
                <div class="text-gray-600">Invoice Overdue</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Payments Chart -->
        <div class="col-span-4 bg-white border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Upcoming Payments</h3>
          </div>
          <div class="mini-trend-chart" style="block-size: 300px">
            <div class="trend-bars">
              <div v-for="(payment, idx) in filteredUpcomingPayments" :key="`upcoming-${idx}`" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (payment.amount / maxUpcomingAmount) * 100 + '%',
                  'background-color': '#10b981',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                }"></div>
                <div class="trend-bar-label" style="inset-block-start: -3rem;">
                  <div style="font-weight: 500; color: #111827;">{{ formatLabel(payment.period) }}</div>
                  <div style="font-size: 0.7rem; margin-top: 2px;">{{ formatCurrency(payment.amount) }}</div>
                  <div style="font-size: 0.7rem; color: #6b7280;">{{ formatNumber(payment.count) }} inv</div>
                </div>
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
              <span>Current</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #f59e0b"></div>
              <span>Processing</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ef4444"></div>
              <span>Overdue</span>
            </div>
          </div>
          <div class="mini-trend-chart" style="block-size: 220px">
            <div class="trend-bars">
              <div v-for="(data, index) in timeSeriesData" :key="index" class="trend-bar">
                <div class="trend-bar-base" :style="{
                  'block-size': (data.current / (data.current + data.processing + data.overdue)) * 100 + '%',
                  'background-color': '#3b82f6',
                  position: 'absolute',
                  'inset-block-end': '0',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                  'z-index': 1
                }"></div>
                <div class="trend-bar-base" :style="{
                  'block-size': (data.processing / (data.current + data.processing + data.overdue)) * 100 + '%',
                  'background-color': '#f59e0b',
                  position: 'absolute',
                  'inset-block-end': (data.current / (data.current + data.processing + data.overdue)) * 100 + '%',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                  'z-index': 2
                }"></div>
                <div class="trend-bar-base" :style="{
                  'block-size': (data.overdue / (data.current + data.processing + data.overdue)) * 100 + '%',
                  'background-color': '#ef4444',
                  position: 'absolute',
                  'inset-block-end': ((data.current + data.processing) / (data.current + data.processing + data.overdue)) * 100 + '%',
                  'inset-inline-start': '0',
                  'inset-inline-end': '0',
                  'z-index': 3
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
import { ref, onMounted, computed, watch } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import type { AgingPeriod, UpcomingPayment } from './types/InvoiceAnalytic'
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
const poType = ref(1)
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
    name: "invoice PO",
    code: 1
  },
  {
    name: "invoice Non PO",
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

const upcomingPayments = ref<UpcomingPayment[]>([
  { period: 'Now', amount: 9500000, count: 120 },
  { period: '15 Days', amount: 1500000, count: 30 },
  { period: '30 Days', amount: 500000, count: 10 },
  { period: '> 30 Days', amount: 7000000, count: 80 },
])

// Filter applied data
// Filter applied data with random jitter for animation effect
const filteredApAgingData = computed(() => {
  // Use filterUpdateKey to trigger re-calculation with fresh random values
  void filterUpdateKey.value
  return apAgingData.value.map(item => {
    const jitter = 0.9 + Math.random() * 0.2 // Random between 0.9 and 1.1
    return {
      ...item,
      amount: Math.round(item.amount * getFilterMultiplier() * jitter),
      count: Math.round(item.count * getFilterMultiplier() * jitter)
    }
  })
})

const filteredUpcomingPayments = computed(() => {
  void filterUpdateKey.value
  return upcomingPayments.value.map(item => {
    const jitter = 0.85 + Math.random() * 0.3 // Random between 0.85 and 1.15
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
    multiplier *= 1.2
  }

  // Apply invoice type filter
  if (invoiceType.value) {
    multiplier *= (invoiceType.value === '901' ? 0.8 : 1.1)
  }

  // Apply department filter
  if (departement.value) {
    multiplier *= 1.15
  }

  // Apply date range filter
  if (date.value && (date.value[0] || date.value[1])) {
    multiplier *= 0.95
  }

  return Math.max(0.5, Math.min(multiplier, 2))
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
  return baseData.map(item => ({
    ...item,
    paidOnTime: Math.round(item.paidOnTime * (multiplier * 0.95)),
    avgAge: Math.round(item.avgAge * multiplier * 1.1),
    current: Math.round(item.current * multiplier),
    processing: Math.round(item.processing * multiplier * 0.9),
    overdue: Math.round(item.overdue * multiplier * 1.2),
  }))
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

const maxUpcomingAmount = computed(() => {
  return Math.max(...filteredUpcomingPayments.value.map((item) => item.amount)) || 1
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
  if (value >= 1000000) return `$ ${(value / 1000000).toFixed(2)}M`
  return formatCurrency(value)
}
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value)
const formatLabel = (label: string): string => {
  if (label === 'Within 15 Days' || label === 'Within 30 Days') return label.replace('Within ', 'W/in\n')
  return label
}

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
    if (poType.value === 1) {
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
@import './styles/InvoiceAnalytic.scss';
</style>
