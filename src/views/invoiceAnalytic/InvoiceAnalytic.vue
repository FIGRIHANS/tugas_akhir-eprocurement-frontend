<template>
  <div class="invoice-analytic">
    <BreadcrumbView
      :routes="[
        { name: 'Supply Chain Analytic', to: '#' },
        { name: 'Invoice Analytic', to: '/invoice-analytic' }
      ]"
      title="Invoice Analytic"
    />

    <!-- Header Section -->
    <div class="header-section bg-white border rounded-lg p-4 mb-6">
      <div class="filter-section flex justify-between items-center">
        <div class="flex gap-4">
          <div class="filter-group">
            <label class="text-sm text-gray-600">Entity</label>
            <select class="border rounded-lg px-3 py-2">
              <option>Corporate US</option>
            </select>
          </div>
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
        <div class="chart-wrapper ap-aging-chart" style="block-size: 300px">
          <div class="bar-chart-container">
            <div v-for="item in apAgingData" :key="item.period" class="bar-group">
              <div class="bar-container" style="position: relative; block-size: 200px;">
                <div
                  class="bar"
                  :style="{
                    'block-size': `${(item.amount / maxAmount) * 100}%`,
                    'background-color': '#3b82f6',
                    'position': 'absolute',
                    'inset-block-end': '0',
                    'inset-inline-start': '50%',
                    'transform': 'translateX(-50%)',
                    'inline-size': '40px'
                  }"
                ></div>
              </div>
              <span class="bar-label">{{ item.period }}</span>
              <div class="bar-value">{{ formatCurrency(item.amount) }}</div>
              <div class="bar-count">{{ formatNumber(item.count) }} inv</div>
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
              <div class="metric-value text-4xl font-bold text-gray-900">{{ formatMetricCurrency(totalOutstanding) }}</div>
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
        <div class="chart-wrapper" style="block-size: 300px">
          <div class="bar-chart-container">
            <div v-for="payment in upcomingPayments" :key="payment.period" class="bar-group">
              <div class="bar-container" style="position: relative; block-size: 200px;">
                <div class="bar" :style="{ 'block-size': (payment.amount / maxUpcomingAmount) * 100 + '%', 'background-color': '#10b981', position: 'absolute', 'inset-block-end': '0', 'inset-inline-start': '50%', transform: 'translateX(-50%)', 'inline-size': '40px' }"></div>
              </div>
              <span class="bar-label">{{ formatLabel(payment.period) }}</span>
              <div class="bar-value">{{ formatCurrency(payment.amount) }}</div>
              <div class="bar-count">{{ formatNumber(payment.count) }} inv</div>
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
              <button @click="zoomOutPaidOnTime" class="px-2 py-1 bg-white border rounded">-</button>
              <div class="px-2">{{ paidOnTimeZoom.toFixed(1) }}x</div>
              <button @click="zoomInPaidOnTime" class="px-2 py-1 bg-white border rounded">+</button>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="revenue-label writing-vertical text-gray-500 mr-2">
            Revenue
          </div>
          <div class="line-chart-wrapper flex-grow" style="block-size: 200px" @wheel.passive.prevent="handleWheelPaidOnTime($event)">
            <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="paidOnTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#bbf7d0" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#bbf7d0" stop-opacity="0.05" />
                </linearGradient>
              </defs>
              <path :d="paidOnTimeAreaPath" fill="url(#paidOnTimeGradient)" class="area-path"/>
              <path :d="paidOnTimeLinePath" fill="none" stroke="#10b981" stroke-width="2" class="line-path"/>
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
          <div class="revenue-label writing-vertical text-gray-500 mr-2">
            Revenue
          </div>
          <div class="line-chart-wrapper flex-grow" style="block-size: 200px" @wheel.passive.prevent="handleWheelAvgAge($event)">
            <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="avgAgeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#ffedd5" stop-opacity="0.05" />
                </linearGradient>
              </defs>
              <path :d="avgAgeAreaPath" fill="url(#avgAgeGradient)" class="area-path"/>
              <path :d="avgAgeLinePath" fill="none" stroke="#f59e0b" stroke-width="2" class="line-path"/>
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
        <div class="stacked-chart-wrapper" style="block-size: 220px">
          <div class="stacked-bars">
            <div v-for="(item, index) in timeSeriesData" :key="index" class="stacked-bar-group">
              <div class="stacked-bar" style="background-color: #3b82f6"></div>
              <div class="stacked-bar" style="background-color: #f59e0b"></div>
              <div class="stacked-bar" style="background-color: #ef4444"></div>
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
            <div v-for="(data, index) in timeSeriesData" :key="index" class="trend-bar">
              <div class="trend-bar-fill" style="background-color: #e5e7eb; block-size: 100%; position: absolute; inset-block-start: 0; inset-inline-start: 0; inset-inline-end: 0;"></div>
              <div class="trend-bar-base" :style="{ 'block-size': data.paidOnTime + '%', 'background-color': '#3b82f6', position: 'absolute', 'inset-block-end': '0', 'inset-inline-start': '0', 'inset-inline-end': '0' }"></div>
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
            <div v-for="(data, index) in timeSeriesData" :key="index" class="trend-bar">
              <div class="trend-bar-fill" style="background-color: #e5e7eb; block-size: 100%; position: absolute; inset-block-start: 0; inset-inline-start: 0; inset-inline-end: 0;"></div>
              <div class="trend-bar-base" :style="{ 'block-size': (data.avgAge / maxAge) * 100 + '%', 'background-color': '#3b82f6', position: 'absolute', 'inset-block-end': '0', 'inset-inline-start': '0', 'inset-inline-end': '0' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { AgingPeriod, UpcomingPayment } from './types/InvoiceAnalytic'
import { format } from 'date-fns'

// Data and computed values
const apAgingData = ref<AgingPeriod[]>([
  { period: 'Current', amount: 9500000, count: 150 },
  { period: '1-30', amount: 6500000, count: 100 },
  { period: '31-60', amount: 2500000, count: 40 },
  { period: '> 60', amount: 7000000, count: 90 }
])

const upcomingPayments = ref<UpcomingPayment[]>([
  { period: 'Now', amount: 9500000, count: 120 },
  { period: '15 Days', amount: 1500000, count: 30 },
  { period: '30 Days', amount: 500000, count: 10 },
  { period: '> 30 Days', amount: 7000000, count: 80 }
])

// Create data for time series visualization
const generateData = () => {
  const weeklyData = Array.from({ length: 5 }, (_, weekIndex) => ({
    id: `week-${weekIndex + 1}`,
    label: `Week ${weekIndex + 1}`,
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10
  }))

  // Generate monthly data
  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => ({
    id: `month-${monthIndex}`,
    label: format(new Date(2025, monthIndex, 1), 'MMM'),
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10
  }))

  // Generate quarterly data
  const quarterlyData = Array.from({ length: 4 }, (_, quarterIndex) => ({
    id: `quarter-${quarterIndex}`,
    label: `Q${quarterIndex + 1}`,
    paidOnTime: Math.random() * 100 + 50,
    avgAge: Math.random() * 30 + 10
  }))

  return {
    weeklyData,
    monthlyData,
    quarterlyData
  }
}

// Generate initial data
const chartData = generateData()

const timeSeriesData = computed(() => {
  const zoom = Math.max(paidOnTimeZoom.value, avgAgeZoom.value)

  if (zoom <= 1.5) {
    return chartData.quarterlyData
  } else if (zoom <= 2.3) {
    return chartData.monthlyData
  } else {
    return chartData.weeklyData
  }
})

// Computed properties
const totalOutstanding = computed(() => {
  return apAgingData.value.reduce((sum, item) => sum + item.amount, 0)
})

const overduePercentage = computed(() => {
  const overdue = apAgingData.value
    .filter(item => item.period !== 'Current')
    .reduce((sum, item) => sum + item.amount, 0)
  return Math.round((overdue / totalOutstanding.value) * 100)
})

const maxAmount = computed(() => {
  return Math.max(...apAgingData.value.map(item => item.amount))
})

// Computed values for charts
const maxUpcomingAmount = computed(() => {
  return Math.max(...upcomingPayments.value.map(item => item.amount))
})

const maxAge = computed(() => {
  return Math.max(...timeSeriesData.value.map(item => item.avgAge))
})

// SVG path generators for line charts
// Zoom state (1 = default, >1 zoomed in)
const paidOnTimeZoom = ref(1)
const avgAgeZoom = ref(1)

// Helper: Catmull-Rom to Bezier conversion for smooth curves
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
    // scale around center
    const x = ((t - center) * 300 * zoom) + 150
    let y = 100 - (v / normalizeTo) * 100
    // clamp to viewBox (0..100) so curves don't draw outside and get clipped
    if (y < 0) y = 0
    if (y > 100) y = 100
    return { x, y }
  })
}

// Paid on time computed points and smooth paths
const maxPaidOnTime = computed(() => Math.max(...timeSeriesData.value.map(d => d.paidOnTime)))
const paidOnTimePoints = computed(() => buildPointsForSeries(timeSeriesData.value.map(d => d.paidOnTime), Math.max(100, maxPaidOnTime.value), paidOnTimeZoom.value))
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
const paidOnTimeVisibleLabels = computed(() => timeSeriesData.value.map(d => formatDate(d)))

// Avg age computed points and smooth paths
const avgAgePoints = computed(() => buildPointsForSeries(timeSeriesData.value.map(d => d.avgAge), maxAge.value || 1, avgAgeZoom.value))
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
const avgAgeVisibleLabels = computed(() => timeSeriesData.value.map(d => formatDate(d)))

// Zoom handlers
const zoomInPaidOnTime = () => {
  let newZoom = paidOnTimeZoom.value
  if (newZoom <= 1.5) {
    // Transitioning from quarters to months
    newZoom = 1.6
  } else if (newZoom <= 2.3) {
    // Transitioning from months to weeks
    newZoom = 2.4
  }
  paidOnTimeZoom.value = Math.min(3, newZoom)
}

const zoomOutPaidOnTime = () => {
  let newZoom = paidOnTimeZoom.value
  if (newZoom >= 2.4) {
    // Transitioning from weeks to months
    newZoom = 2.3
  } else if (newZoom >= 1.6) {
    // Transitioning from months to quarters
    newZoom = 1.5
  }
  paidOnTimeZoom.value = Math.max(1, newZoom)
}

const handleWheelPaidOnTime = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomInPaidOnTime()
  else zoomOutPaidOnTime()
}

const zoomInAvgAge = () => {
  let newZoom = avgAgeZoom.value
  if (newZoom <= 1.5) {
    // Transitioning from quarters to months
    newZoom = 1.6
  } else if (newZoom <= 2.3) {
    // Transitioning from months to weeks
    newZoom = 2.4
  }
  avgAgeZoom.value = Math.min(3, newZoom)
}

const zoomOutAvgAge = () => {
  let newZoom = avgAgeZoom.value
  if (newZoom >= 2.4) {
    // Transitioning from weeks to months
    newZoom = 2.3
  } else if (newZoom >= 1.6) {
    // Transitioning from months to quarters
    newZoom = 1.5
  }
  avgAgeZoom.value = Math.max(1, newZoom)
}

const handleWheelAvgAge = (e: WheelEvent) => {
  if (e.deltaY < 0) zoomInAvgAge()
  else zoomOutAvgAge()
}

// Already defined above

// Methods
const formatDate = (item: { label: string }): string => {
  return item.label
}

// Format currency using the metric value display format
const formatMetricCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$ ${(value / 1000000).toFixed(2)}M`
  }
  return formatCurrency(value)
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatLabel = (label: string): string => {
  if (label === 'Within 15 Days' || label === 'Within 30 Days') {
    return label.replace('Within ', 'W/in\n')
  }
  return label
}

onMounted(() => {
  // Initialize charts here using chart library of choice
  // (e.g., Chart.js, ApexCharts, or other preferred library)
})
</script>

<style lang="scss" scoped>
@import './styles/InvoiceAnalytic.scss';
</style>
