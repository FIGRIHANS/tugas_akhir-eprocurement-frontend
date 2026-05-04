<template>
  <div class="inbound-analytic">
    <Breadcrumb title="Inbound Logistic Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Loading overlay -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-teal-500 animate-spin"></i>
        <p class="mt-3 text-gray-500 text-sm">Loading analytics data...</p>
      </div>
    </div>

    <template v-else>
      <!-- ═══════════════════════════════════════
           CHARTS ROW
      ═══════════════════════════════════════ -->
      <div class="grid grid-cols-12 gap-6 mb-6">
        <!-- DN Status Donut -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-package text-teal-500"></i>
            DN Status Distribution
          </p>
          <div ref="dnChartRef" class="w-full h-[280px]"></div>
        </div>

        <!-- RC Status Donut -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-document text-blue-500"></i>
            RC Status Distribution
          </p>
          <div ref="rcChartRef" class="w-full h-[280px]"></div>
        </div>

        <!-- PO Status Donut -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-element-11 text-purple-500"></i>
            PO Status Distribution
          </p>
          <div ref="poChartRef" class="w-full h-[280px]"></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════
           PURCHASE ORDER KPI
      ═══════════════════════════════════════ -->
      <p class="section-label"><i class="ki-duotone ki-element-11 text-purple-500"></i> Purchase Orders</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div
          v-for="card in poCards"
          :key="card.label"
          class="kpi-card"
          :class="card.borderClass"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
          :class2="card.label === 'Total Value' ? 'col-span-2 md:col-span-1' : ''"
        >
          <div class="kpi-icon" :class="card.bgClass">
            <i :class="[card.icon, card.colorClass]"></i>
          </div>
          <div class="min-w-0">
            <p class="kpi-label">{{ card.label }}</p>
            <p :class="card.label === 'Total Value' ? 'kpi-value-sm ' + card.colorClass : 'kpi-value'">
              {{ card.value }}
            </p>
          </div>
        </div>
      </div>
      <!-- ═══════════════════════════════════════
           DELIVERY NOTES KPI
      ═══════════════════════════════════════ -->
      <p class="section-label"><i class="ki-duotone ki-package text-teal-500"></i> Delivery Notes</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
        <div
          v-for="card in dnCards"
          :key="card.label"
          class="kpi-card"
          :class="card.borderClass"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
        >
          <div class="kpi-icon" :class="card.bgClass">
            <i :class="[card.icon, card.colorClass]"></i>
          </div>
          <div>
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════
           RECEIVING CONFIRMATION KPI
      ═══════════════════════════════════════ -->
      <p class="section-label"><i class="ki-duotone ki-document text-blue-500"></i> Receiving Confirmation</p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
        <div
          v-for="card in rcCards"
          :key="card.label"
          class="kpi-card"
          :class="card.borderClass"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
        >
          <div class="kpi-icon" :class="card.bgClass">
            <i :class="[card.icon, card.colorClass]"></i>
          </div>
          <div>
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
          </div>
        </div>
      </div>

      

      

      <!-- ═══════════════════════════════════════
           TREND BAR CHART (DN vs RC Monthly)
      ═══════════════════════════════════════ -->
      <div class="chart-card mb-6">
        <p class="chart-title">
          <i class="ki-duotone ki-chart-line-star text-teal-500"></i>
          Monthly Inbound Volume — DN vs RC vs PO
        </p>
        <div ref="trendChartRef" class="w-full h-[300px]"></div>
      </div>

      <!-- ═══════════════════════════════════════
           DISCREPANCY RATE CARD
      ═══════════════════════════════════════ -->
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-information-2 text-orange-500"></i>
            RC Discrepancy Rate
          </p>
          <div class="flex items-center justify-center py-6 gap-10">
            <div class="text-center">
              <p class="text-5xl font-bold text-orange-500">{{ discrepancyRate }}%</p>
              <p class="text-sm text-gray-500 mt-2">of all RC have discrepancy</p>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span class="text-gray-600">No Discrepancy:</span>
                <span class="font-semibold">{{ rcStats.total - rcStats.hasDiscrepancy }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                <span class="text-gray-600">Has Discrepancy:</span>
                <span class="font-semibold text-orange-600">{{ rcStats.hasDiscrepancy }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
                <span class="text-gray-600">Total RC:</span>
                <span class="font-semibold">{{ rcStats.total }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-dollar text-purple-500"></i>
            PO Value Breakdown
          </p>
          <div ref="poValueChartRef" class="w-full h-[240px]"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ApexCharts from 'apexcharts'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import DeliveryNotesService from '@/services/deliveryNotes.service'
import ReceivingConfirmationService from '@/services/receivingConfirmation.service'
import MockSapService from '@/services/mockSap.service'
import type { DnStats, RcStats, PoStats } from './types/InboundLogistic'
import momentLib from 'moment'

const moment = momentLib

/* ─────────────────────────────────────────────
 * ROUTING
 * ─────────────────────────────────────────── */
const routes = ref<routeTypes[]>([
  { name: 'Analytic Dashboard', to: '#' },
])

/* ─────────────────────────────────────────────
 * RAW DATA
 * ─────────────────────────────────────────── */
const isLoading = ref(true)
const dnRaw = ref<any[]>([])
const rcRaw = ref<any[]>([])
const poRaw = ref<any[]>([])

/* ─────────────────────────────────────────────
 * COMPUTED STATS
 * ─────────────────────────────────────────── */
const dnStats = computed<DnStats>(() => ({
  total: dnRaw.value.length,
  onDelivery: dnRaw.value.filter((i) => i.status === 'On Delivery').length,
  received: dnRaw.value.filter((i) => i.status === 'Received').length,
  partialReceived: dnRaw.value.filter((i) => i.status === 'Partial Received').length,
  completed: dnRaw.value.filter((i) => i.status === 'Completed').length,
}))

const rcStats = computed<RcStats>(() => ({
  total: rcRaw.value.length,
  waitingApproval: rcRaw.value.filter((i) => i.status === 'Waiting Approval').length,
  completed: rcRaw.value.filter((i) => i.status === 'Received' || i.status === 'Completed').length,
  rejected: rcRaw.value.filter((i) => i.status === 'Rejected').length,
  hasDiscrepancy: rcRaw.value.filter((i) => i.hasDiscrepancy).length,
}))

const poStats = computed<PoStats>(() => {
  const total = poRaw.value.length
  const open = poRaw.value.filter((i) => i.status === 'Open').length
  const partiallyDelivered = poRaw.value.filter((i) => i.status === 'Partial').length
  const delivered = poRaw.value.filter((i) => i.status === 'Delivered').length
  const closed = poRaw.value.filter((i) => i.status === 'Closed').length
  const totalValue = poRaw.value.reduce((sum: number, i: any) => sum + (i.totalAmount || 0), 0)
  const totalValueFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(totalValue)
  return { total, open, partiallyDelivered, delivered, closed, totalValue, totalValueFormatted }
})

const discrepancyRate = computed(() => {
  if (rcStats.value.total === 0) return '0.0'
  return ((rcStats.value.hasDiscrepancy / rcStats.value.total) * 100).toFixed(1)
})

/* ─────────────────────────────────────────────
 * KPI CARD DEFINITIONS
 * ─────────────────────────────────────────── */
const dnCards = computed(() => [
  { label: 'Total DN',        value: dnStats.value.total,         icon: 'ki-duotone ki-package',        colorClass: 'text-teal-600',   bgClass: 'bg-teal-50',   borderClass: 'border-gray-200' },
  { label: 'On Delivery',     value: dnStats.value.onDelivery,    icon: 'ki-duotone ki-truck',          colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  { label: 'Received',        value: dnStats.value.received,      icon: 'ki-duotone ki-check-circle',   colorClass: 'text-green-600',  bgClass: 'bg-green-50',  borderClass: 'border-green-200' },
  { label: 'Partial Received',value: dnStats.value.partialReceived,icon: 'ki-duotone ki-information-2', colorClass: 'text-orange-500', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' },
  { label: 'Completed',       value: dnStats.value.completed,     icon: 'ki-duotone ki-shield-tick',    colorClass: 'text-teal-600',   bgClass: 'bg-teal-50',   borderClass: 'border-teal-200' },
])

const rcCards = computed(() => [
  { label: 'Total RC',          value: rcStats.value.total,           icon: 'ki-duotone ki-document',       colorClass: 'text-blue-600',   bgClass: 'bg-blue-50',   borderClass: 'border-gray-200' },
  { label: 'Waiting Approval',  value: rcStats.value.waitingApproval, icon: 'ki-duotone ki-time',           colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  { label: 'Completed',         value: rcStats.value.completed,       icon: 'ki-duotone ki-check-circle',   colorClass: 'text-green-600',  bgClass: 'bg-green-50',  borderClass: 'border-green-200' },
  { label: 'Rejected',          value: rcStats.value.rejected,        icon: 'ki-duotone ki-cross-circle',   colorClass: 'text-red-500',    bgClass: 'bg-red-50',    borderClass: 'border-red-200' },
  { label: 'Discrepancy',       value: rcStats.value.hasDiscrepancy,  icon: 'ki-duotone ki-information-2',  colorClass: 'text-orange-500', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' },
])

const poCards = computed(() => [
  { label: 'Total PO',           value: poStats.value.total,              icon: 'ki-duotone ki-element-11', colorClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-gray-200' },
  { label: 'Open',               value: poStats.value.open,               icon: 'ki-duotone ki-folder-open',colorClass: 'text-cyan-600',   bgClass: 'bg-cyan-50',   borderClass: 'border-cyan-200' },
  { label: 'Partial Delivery',   value: poStats.value.partiallyDelivered, icon: 'ki-duotone ki-delivery',   colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  { label: 'Delivered',          value: poStats.value.delivered,          icon: 'ki-duotone ki-check-circle',colorClass: 'text-green-600', bgClass: 'bg-green-50',  borderClass: 'border-green-200' },
  { label: 'Closed',             value: poStats.value.closed,             icon: 'ki-duotone ki-lock',       colorClass: 'text-gray-500',   bgClass: 'bg-gray-100',  borderClass: 'border-gray-200' },
  { label: 'Total Value',        value: poStats.value.totalValueFormatted,icon: 'ki-duotone ki-dollar',     colorClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
])

/* ─────────────────────────────────────────────
 * MONTHLY TREND HELPERS
 * ─────────────────────────────────────────── */
const getMonthlyBuckets = (data: any[], dateField: string, months = 6) => {
  const buckets: Record<string, number> = {}
  const now = moment()
  for (let i = months - 1; i >= 0; i--) {
    buckets[now.clone().subtract(i, 'months').format('MMM YY')] = 0
  }
  data.forEach((item) => {
    const key = moment(item[dateField]).format('MMM YY')
    if (key in buckets) buckets[key]++
  })
  return buckets
}

/* ─────────────────────────────────────────────
 * CHART REFS
 * ─────────────────────────────────────────── */
const dnChartRef = ref<HTMLElement | null>(null)
const rcChartRef = ref<HTMLElement | null>(null)
const poChartRef = ref<HTMLElement | null>(null)
const trendChartRef = ref<HTMLElement | null>(null)
const poValueChartRef = ref<HTMLElement | null>(null)

let dnChart: ApexCharts | null = null
let rcChart: ApexCharts | null = null
let poChart: ApexCharts | null = null
let trendChart: ApexCharts | null = null
let poValueChart: ApexCharts | null = null

/* ─────────────────────────────────────────────
 * CHART OPTIONS FACTORIES
 * ─────────────────────────────────────────── */
function donutOption(series: number[], labels: string[], colors: string[]) {
  return {
    chart: { type: 'donut', height: 280, fontFamily: 'Inter, sans-serif' },
    series,
    labels,
    colors,
    plotOptions: {
      pie: {
        donut: {
          size: '62%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '13px',
              fontWeight: 600,
              formatter: () => String(series.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
    dataLabels: { formatter: (val: number) => `${val.toFixed(0)}%` },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: { width: 8, height: 8, radius: 8 },
      itemMargin: { horizontal: 8, vertical: 4 },
    },
    tooltip: { y: { formatter: (val: number) => `${val} items` } },
  }
}

function barTrendOption(categories: string[], dnSeries: number[], rcSeries: number[], poSeries: number[]) {
  return {
    chart: { type: 'bar', height: 300, fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
    series: [
      { name: 'Delivery Notes', data: dnSeries },
      { name: 'Receiving Conf.', data: rcSeries },
      { name: 'Purchase Orders', data: poSeries },
    ],
    xaxis: { categories },
    colors: ['#14b8a6', '#3b82f6', '#a855f7'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    legend: { position: 'top', fontSize: '12px' },
    grid: { borderColor: '#f1f5f9' },
    yaxis: { labels: { style: { fontSize: '11px' } } },
    tooltip: { y: { formatter: (val: number) => `${val} docs` } },
  }
}

function horizontalBarOption(
  categories: string[],
  series: number[],
  colors: string[],
  formatter: (val: number) => string,
) {
  return {
    chart: { type: 'bar', height: 240, fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
    series: [{ name: 'Value', data: series }],
    xaxis: { categories, labels: { style: { fontSize: '11px' } } },
    colors,
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 4,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter,
      offsetX: 5,
      style: { fontSize: '10px', colors: ['#374151'] },
    },
    legend: { show: false },
    grid: { borderColor: '#f1f5f9' },
    tooltip: { y: { formatter } },
  }
}

/* ─────────────────────────────────────────────
 * INIT CHARTS (called after data loads)
 * ─────────────────────────────────────────── */
const renderCharts = () => {
  // Rebuild DN donut with actual non-zero labels
  const dnAllLabels = ['On Delivery', 'Received', 'Partial Received', 'Completed', 'Other']
  const dnAllSeries = [
    dnStats.value.onDelivery,
    dnStats.value.received,
    dnStats.value.partialReceived,
    dnStats.value.completed,
    dnRaw.value.filter(
      (i) => !['On Delivery', 'Received', 'Partial Received', 'Completed'].includes(i.status),
    ).length,
  ]
  const dnFiltered = dnAllLabels.reduce<{labels: string[], series: number[]}>((acc, lbl, idx) => {
    if (dnAllSeries[idx] > 0) { acc.labels.push(lbl); acc.series.push(dnAllSeries[idx]) }
    return acc
  }, { labels: [], series: [] })

  if (dnChartRef.value) {
    dnChart = new ApexCharts(
      dnChartRef.value,
      donutOption(
        dnFiltered.series.length ? dnFiltered.series : [1],
        dnFiltered.labels.length ? dnFiltered.labels : ['No Data'],
        ['#f59e0b', '#22c55e', '#f97316', '#14b8a6', '#94a3b8'],
      ),
    )
    dnChart.render()
  }

  // RC donut
  const rcAllLabels = ['Waiting Approval', 'Completed', 'Rejected', 'Draft', 'Other']
  const rcAllSeries = [
    rcStats.value.waitingApproval,
    rcStats.value.completed,
    rcStats.value.rejected,
    rcRaw.value.filter((i) => i.status === 'Draft').length,
    rcRaw.value.filter(
      (i) => !['Waiting Approval', 'Received', 'Completed', 'Rejected', 'Draft'].includes(i.status),
    ).length,
  ]
  const rcFiltered = rcAllLabels.reduce<{labels: string[], series: number[]}>((acc, lbl, idx) => {
    if (rcAllSeries[idx] > 0) { acc.labels.push(lbl); acc.series.push(rcAllSeries[idx]) }
    return acc
  }, { labels: [], series: [] })

  if (rcChartRef.value) {
    rcChart = new ApexCharts(
      rcChartRef.value,
      donutOption(
        rcFiltered.series.length ? rcFiltered.series : [1],
        rcFiltered.labels.length ? rcFiltered.labels : ['No Data'],
        ['#f59e0b', '#22c55e', '#ef4444', '#6b7280', '#94a3b8'],
      ),
    )
    rcChart.render()
  }

  // PO donut
  const poAllLabels = ['Open', 'Partial Delivery', 'Delivered', 'Closed']
  const poAllSeries = [
    poStats.value.open,
    poStats.value.partiallyDelivered,
    poStats.value.delivered,
    poStats.value.closed,
  ]
  const poFiltered = poAllLabels.reduce<{labels: string[], series: number[]}>((acc, lbl, idx) => {
    if (poAllSeries[idx] > 0) { acc.labels.push(lbl); acc.series.push(poAllSeries[idx]) }
    return acc
  }, { labels: [], series: [] })

  if (poChartRef.value) {
    poChart = new ApexCharts(
      poChartRef.value,
      donutOption(
        poFiltered.series.length ? poFiltered.series : [1],
        poFiltered.labels.length ? poFiltered.labels : ['No Data'],
        ['#0ea5e9', '#f59e0b', '#22c55e', '#94a3b8'],
      ),
    )
    poChart.render()
  }

  // Trend bar chart (monthly)
  const dnBuckets = getMonthlyBuckets(dnRaw.value, 'createdUtcDate', 6)
  const rcBuckets = getMonthlyBuckets(rcRaw.value, 'createdUtcDate', 6)
  const poBuckets = getMonthlyBuckets(poRaw.value, 'createdUtcDate', 6)
  const trendCategories = Object.keys(dnBuckets)

  if (trendChartRef.value) {
    trendChart = new ApexCharts(
      trendChartRef.value,
      barTrendOption(
        trendCategories,
        Object.values(dnBuckets),
        Object.values(rcBuckets),
        Object.values(poBuckets),
      ),
    )
    trendChart.render()
  }

  // PO Value horizontal bar
  const poValueByStatus = [
    { label: 'Open', value: poRaw.value.filter((i: any) => i.status === 'Open').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0) },
    { label: 'Partial', value: poRaw.value.filter((i: any) => i.status === 'Partial').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0) },
    { label: 'Delivered', value: poRaw.value.filter((i: any) => i.status === 'Delivered').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0) },
    { label: 'Closed', value: poRaw.value.filter((i: any) => i.status === 'Closed').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0) },
  ]

  const fmt = (val: number) =>
    new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(val)

  if (poValueChartRef.value) {
    poValueChart = new ApexCharts(
      poValueChartRef.value,
      horizontalBarOption(
        poValueByStatus.map((p) => p.label),
        poValueByStatus.map((p) => p.value),
        ['#0ea5e9', '#f59e0b', '#22c55e', '#94a3b8'],
        fmt,
      ),
    )
    poValueChart.render()
  }
}

/* ─────────────────────────────────────────────
 * DATA FETCHING
 * ─────────────────────────────────────────── */
const fetchAllData = async () => {
  isLoading.value = true
  try {
    const [dnRes, rcRes, poRes] = await Promise.all([
      DeliveryNotesService.getList({}),
      ReceivingConfirmationService.getList({}),
      MockSapService.getList({}),
    ])
    dnRaw.value = dnRes ?? []
    rcRaw.value = rcRes ?? []
    poRaw.value = poRes ?? []
  } catch (err) {
    console.error('InboundLogisticAnalytic: failed to fetch data', err)
  } finally {
    isLoading.value = false
  }
}

/* ─────────────────────────────────────────────
 * LIFECYCLE
 * ─────────────────────────────────────────── */
onMounted(async () => {
  await fetchAllData()
  // nextTick is handled by isLoading flag — charts render after v-else is shown
  setTimeout(renderCharts, 50)
})

onBeforeUnmount(() => {
  dnChart?.destroy()
  rcChart?.destroy()
  poChart?.destroy()
  trendChart?.destroy()
  poValueChart?.destroy()
})
</script>

<style scoped lang="scss">
@use './styles/inboundLogistic.scss';
</style>
