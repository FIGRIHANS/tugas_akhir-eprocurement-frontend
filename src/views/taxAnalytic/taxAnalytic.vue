<template>
  <div class="invoice-analytic">
    <BreadcrumbView
      :routes="[
        { name: 'Supply Chain Analytic', to: '#' },
        { name: 'Tax Analytic', to: '/invoice-analytic' },
      ]"
      title="Tax Analytic"
    />

    <div class="analytics-metrics-container">
      <div class="grid grid-cols-12 gap-6">
        <!-- METRIC CARDS -->
        <div
          v-for="item in metricCards"
          :key="item.title"
          class="col-span-3 bg-white border rounded-lg p-4"
        >
          <h3 class="text-lg font-semibold">{{ item.title }}</h3>

          <div class="mt-6 text-center">
            <div class="text-4xl font-bold">
              {{ formatMetricCurrency(item.amount) }}
            </div>
            <div class="text-gray-600 text-xl">Invoice SUM</div>

            <div class="my-4 border-t"></div>

            <div class="text-2xl font-semibold">{{ item.transaction }}</div>
            <div class="text-gray-600">Total Transaction</div>
          </div>
        </div>

        <!-- AP AGING PIE -->
        <!-- <div class="col-span-6 bg-white border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4">AP Aging Distribution</h3>
            <div ref="apPieRef" class="w-full h-[320px]"></div>
          </div> -->

        <!-- TAX DASHBOARD PIE -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">Tax Dashboard</h3>
          <div ref="taxPieRef" class="w-full h-[320px]"></div>
        </div>

        <!-- VAT IN APPROVED PIE -->
        <div class="col-span-6 bg-white border rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">VAT In Approved</h3>
          <div ref="vatPieRef" class="w-full h-[320px]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ApexCharts from 'apexcharts'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

/* =======================
 * STORE
 * ======================= */
const invoiceMasterApi = useInvoiceMasterDataStore()

/* =======================
 * TYPES
 * ======================= */
type AgingPeriod = {
  period: string
  amount: number
  count: number
}

/* =======================
 * DATA
 * ======================= */
const apAgingData = ref<AgingPeriod[]>([
  { period: 'Current', amount: 9500000, count: 150 },
  { period: '1-30', amount: 6500000, count: 100 },
  { period: '31-60', amount: 2500000, count: 40 },
  { period: '> 60', amount: 7000000, count: 90 },
])

const taxDashboardData = {
  series: [200, 600, 200, 20],
  labels: ['FPM Approved', 'FPM Credited', 'FPM UnCredited', 'Tax Invoice Defect'],
}

const vatApprovedData = {
  series: [150, 50],
  labels: ['Expired < 2 Month', 'Expired > 2 Month'],
}

const metricCards = computed(() => [
  {
    title: 'Approved',
    amount: taxDashboardData.series[0] * 125000,
    transaction: taxDashboardData.series[0],
  },
  {
    title: 'Credited',
    amount: taxDashboardData.series[1] * 105000,
    transaction: taxDashboardData.series[1],
  },
  {
    title: 'Uncredited',
    amount: taxDashboardData.series[2] * 95000,
    transaction: taxDashboardData.series[2],
  },
  {
    title: 'Defect',
    amount: taxDashboardData.series[3] * 70000,
    transaction: taxDashboardData.series[3],
  },
])

/* =======================
 * COMPUTED
 * ======================= */
const totalOutstanding = computed(() => apAgingData.value.reduce((s, i) => s + i.amount, 0))

const overduePercentage = computed(() => {
  const overdue = apAgingData.value
    .filter((i) => i.period !== 'Current')
    .reduce((s, i) => s + i.amount, 0)

  return Math.round((overdue / totalOutstanding.value) * 100)
})

const apSeries = computed(() => apAgingData.value.map((i) => i.amount))
const apLabels = computed(() => apAgingData.value.map((i) => i.period))

/* =======================
 * FORMATTER
 * ======================= */
const formatMetricCurrency = (value: number) =>
  value >= 1_000_000
    ? `$ ${(value / 1_000_000).toFixed(2)}M`
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)

/* =======================
 * CHART REFS
 * ======================= */
const apPieRef = ref<HTMLElement | null>(null)
const taxPieRef = ref<HTMLElement | null>(null)
const vatPieRef = ref<HTMLElement | null>(null)

let apPie: ApexCharts | null = null
let taxPie: ApexCharts | null = null
let vatPie: ApexCharts | null = null

/* =======================
 * INIT CHARTS
 * ======================= */
onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()

  apPie = new ApexCharts(apPieRef.value!, donutOption(apSeries.value, apLabels.value))
  taxPie = new ApexCharts(
    taxPieRef.value!,
    donutOption(taxDashboardData.series, taxDashboardData.labels),
  )
  vatPie = new ApexCharts(
    vatPieRef.value!,
    donutOption(vatApprovedData.series, vatApprovedData.labels),
  )

  apPie.render()
  taxPie.render()
  vatPie.render()
})

onBeforeUnmount(() => {
  apPie?.destroy()
  taxPie?.destroy()
  vatPie?.destroy()
})

/* =======================
 * DONUT OPTION
 * ======================= */
function donutOption(series: number[], labels: string[]) {
  return {
    chart: {
      type: 'donut',
      height: 320,
      fontFamily: 'Inter, sans-serif',
    },
    series,
    labels,
    colors: ['#7CB342', '#5C9BD5', '#F4B400', '#E53935'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => series.reduce((a, b) => a + b, 0),
            },
          },
        },
      },
    },
    dataLabels: {
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },

    legend: {
      position: 'right',
      horizontalAlign: 'left',
      fontSize: '13px',
      markers: {
        width: 10,
        height: 10,
        radius: 10,
      },
      itemMargin: {
        vertical: 10,
      },
    },
  }
}
</script>

<style scoped lang="scss">
@import './styles/taxAnalytic.scss';
</style>
