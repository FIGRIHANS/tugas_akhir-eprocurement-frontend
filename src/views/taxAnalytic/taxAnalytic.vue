<template>
  <div class="tax-analytic">
    <Breadcrumb title="Tax Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex flex-col">
        <label class="text-xs font-medium text-gray-500 mb-1">Period Year</label>
        <select v-model="selectedYear" class="form-select form-select-sm w-32">
          <option :value="null">All Years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-medium text-gray-500 mb-1">Period Month</label>
        <select v-model="selectedMonth" class="form-select form-select-sm w-32" :disabled="!selectedYear">
          <option :value="null">All Months</option>
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <i class="ki-duotone ki-loading text-4xl text-teal-500 animate-spin"></i>
        <p class="mt-3 text-gray-500 text-sm">Loading tax analytics...</p>
      </div>
    </div>

    <template v-else>
      <!-- Tax Overview KPI -->
      <p class="section-label">
        <i class="ki-duotone ki-calculator text-teal-500 mr-1"></i>
        Tax Overview
      </p>
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="card in metricCards"
          :key="card.label"
          class="kpi-card"
          :class="card.borderClass"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
        >
          <div class="kpi-icon" :class="card.bgClass">
            <i :class="[card.icon, card.colorClass]"></i>
          </div>
          <div class="min-w-0">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
            <p class="text-xs text-gray-500 font-medium truncate mt-0.5" :title="card.amount">
              Val: {{ card.amount }}
            </p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <p class="section-label">
        <i class="ki-duotone ki-chart-line-star text-purple-500 mr-1"></i>
        Tax & VAT Analytics Charts
      </p>
      <div class="grid grid-cols-12 gap-6 mb-6">
        <!-- Tax Dashboard Chart (Vertical Columns) -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-calculator text-teal-500 mr-1"></i>
            Tax Invoice (FPM) Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 180px">
              <div class="trend-bars">
                <div v-for="item in fpmDistributionData" :key="item.label" class="trend-bar">
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / maxFpmCount) * 100 + '%',
                      'background-color': item.color,
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels">
              <div v-for="item in fpmDistributionData" :key="item.label" class="chart-bottom-label">
                <div class="font-semibold text-gray-900 text-xs truncate max-w-full" :title="item.label">
                  {{ item.label }}
                </div>
                <div class="text-xs text-gray-700 font-medium mt-0.5">{{ item.amount }}</div>
                <div class="text-xs text-gray-500 font-medium">{{ item.count }} inv</div>
              </div>
            </div>
          </div>
        </div>

        <!-- VAT Approved Chart (Vertical Columns) -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-calendar text-blue-500 mr-1"></i>
            VAT Expiration Aging (PPN)
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 180px">
              <div class="trend-bars" style="justify-content: space-around; padding-inline: 3rem;">
                <div v-for="item in vatDistributionData" :key="item.label" class="trend-bar" style="max-width: 45px;">
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / maxVatCount) * 100 + '%',
                      'background-color': item.color,
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels" style="justify-content: space-around; padding-inline: 1.5rem;">
              <div v-for="item in vatDistributionData" :key="item.label" class="chart-bottom-label" style="max-width: 140px;">
                <div class="font-semibold text-gray-900 text-xs">{{ item.label }}</div>
                <div class="text-xs text-gray-700 font-medium mt-0.5">{{ item.amount }}</div>
                <div class="text-xs text-gray-500 font-medium">{{ item.count }} invoices</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- WHT Analytics Section -->
      <!-- ============================================================ -->
      <p class="section-label">
        <i class="ki-duotone ki-bill text-indigo-500 mr-1"></i>
        WHT Analytics — PPh 21 & BPU Unifikasi
      </p>

      <!-- WHT KPI Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="card in whtMetricCards"
          :key="card.label"
          class="kpi-card cursor-pointer hover:shadow-md transition-shadow"
          :class="card.borderClass"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
          @click="card.route ? router.push(card.route) : null"
        >
          <div class="kpi-icon" :class="card.bgClass">
            <i :class="[card.icon, card.colorClass]"></i>
          </div>
          <div class="min-w-0">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
            <p class="text-xs text-gray-500 font-medium truncate mt-0.5" :title="card.amount">
              {{ card.sub }}: {{ card.amount }}
            </p>
          </div>
        </div>
      </div>

      <!-- WHT Chart: PPh21 vs BPU status distribution -->
      <div class="grid grid-cols-12 gap-6 mb-8">
        <!-- PPh 21 Chart -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-user text-indigo-500 mr-1"></i>
            PPh 21 Status Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 180px">
              <div class="trend-bars" style="justify-content: space-around; padding-inline: 3rem;">
                <div
                  v-for="item in whtPph21ChartData"
                  :key="item.label"
                  class="trend-bar"
                  style="max-width: 55px;"
                >
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / (maxWhtPph21Count || 1)) * 100 + '%',
                      'background-color': item.color,
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels" style="justify-content: space-around; padding-inline: 1.5rem;">
              <div
                v-for="item in whtPph21ChartData"
                :key="item.label"
                class="chart-bottom-label"
                style="max-width: 120px;"
              >
                <div class="font-semibold text-xs" :style="{ color: item.color }">{{ item.label }}</div>
                <div class="text-xs text-gray-700 font-medium mt-0.5">{{ item.amount }}</div>
                <div class="text-xs text-gray-500">{{ item.count }} records</div>
              </div>
            </div>
          </div>
        </div>

        <!-- BPU Unifikasi Chart -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-briefcase text-violet-500 mr-1"></i>
            BPU Unifikasi Status Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 180px">
              <div class="trend-bars" style="justify-content: space-around; padding-inline: 3rem;">
                <div
                  v-for="item in whtBpuChartData"
                  :key="item.label"
                  class="trend-bar"
                  style="max-width: 55px;"
                >
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / (maxWhtBpuCount || 1)) * 100 + '%',
                      'background-color': item.color,
                      position: 'absolute',
                      'inset-block-end': '0',
                      'inset-inline-start': '0',
                      'inset-inline-end': '0',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="chart-bottom-labels" style="justify-content: space-around; padding-inline: 1.5rem;">
              <div
                v-for="item in whtBpuChartData"
                :key="item.label"
                class="chart-bottom-label"
                style="max-width: 120px;"
              >
                <div class="font-semibold text-xs" :style="{ color: item.color }">{{ item.label }}</div>
                <div class="text-xs text-gray-700 font-medium mt-0.5">{{ item.amount }}</div>
                <div class="text-xs text-gray-500">{{ item.count }} records</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import TaxService, { type TaxAnalyticsData } from '@/services/tax.service'

/* =======================
 * STORE & ROUTING
 * ======================= */
const router = useRouter()
const invoiceMasterApi = useInvoiceMasterDataStore()
const isLoading = ref(true)

const selectedMonth = ref<number | null>(null)
const selectedYear = ref<number | null>(null)

const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
})

const routes = ref<routeTypes[]>([
  { name: 'Analytic Dashboard', to: '#' },
])

/* =======================
 * DATA STATE
 * ======================= */
const analyticsData = ref<TaxAnalyticsData | null>(null)

/* =======================
 * FORMATTER (IDR matching real DB values)
 * ======================= */
const formatMetricCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(2)}M`
  } else if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(2)}Jt`
  } else {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }
}

const metricCards = computed(() => {
  const data = analyticsData.value
  return [
    {
      label: 'FPM Approved',
      value: data ? data.fpmApprovedCount : 0,
      amount: data ? formatMetricCurrency(data.fpmApprovedAmount) : 'Rp 0',
      icon: 'ki-duotone ki-check-circle',
      colorClass: 'text-teal-600',
      bgClass: 'bg-teal-50',
      borderClass: 'border-gray-200'
    },
    {
      label: 'FPM Credited',
      value: data ? data.fpmCreditedCount : 0,
      amount: data ? formatMetricCurrency(data.fpmCreditedAmount) : 'Rp 0',
      icon: 'ki-duotone ki-shield-tick',
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50',
      borderClass: 'border-gray-200'
    },
    {
      label: 'FPM Uncredited',
      value: data ? data.fpmUncreditedCount : 0,
      amount: data ? formatMetricCurrency(data.fpmUncreditedAmount) : 'Rp 0',
      icon: 'ki-duotone ki-information-2',
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-50',
      borderClass: 'border-gray-200'
    },
    {
      label: 'Invoice Defect',
      value: data ? data.taxInvoiceDefectCount : 0,
      amount: data ? formatMetricCurrency(data.taxInvoiceDefectAmount) : 'Rp 0',
      icon: 'ki-duotone ki-cross-circle',
      colorClass: 'text-red-500',
      bgClass: 'bg-red-50',
      borderClass: 'border-gray-200'
    }
  ]
})

/* =======================
 * COMPUTED DISTRIBUTION DATA
 * ======================= */
const fpmDistributionData = computed(() => {
  const data = analyticsData.value
  const approved = data ? data.fpmApprovedCount : 0
  const credited = data ? data.fpmCreditedCount : 0
  const uncredited = data ? data.fpmUncreditedCount : 0
  const defect = data ? data.taxInvoiceDefectCount : 0
  const totalCount = approved + credited + uncredited + defect || 1

  return [
    {
      label: 'FPM Approved',
      count: approved,
      amount: data ? formatMetricCurrency(data.fpmApprovedAmount) : 'Rp 0',
      percentage: Math.round((approved / totalCount) * 100),
      color: '#14b8a6',
    },
    {
      label: 'FPM Credited',
      count: credited,
      amount: data ? formatMetricCurrency(data.fpmCreditedAmount) : 'Rp 0',
      percentage: Math.round((credited / totalCount) * 100),
      color: '#22c55e',
    },
    {
      label: 'FPM Uncredited',
      count: uncredited,
      amount: data ? formatMetricCurrency(data.fpmUncreditedAmount) : 'Rp 0',
      percentage: Math.round((uncredited / totalCount) * 100),
      color: '#f59e0b',
    },
    {
      label: 'Invoice Defect',
      count: defect,
      amount: data ? formatMetricCurrency(data.taxInvoiceDefectAmount) : 'Rp 0',
      percentage: Math.round((defect / totalCount) * 100),
      color: '#ef4444',
    },
  ]
})

const vatDistributionData = computed(() => {
  const data = analyticsData.value
  const lessTwo = data ? data.expiredLessTwoMonthCount : 0
  const moreTwo = data ? data.expiredMoreTwoMonthCount : 0
  const totalCount = lessTwo + moreTwo || 1

  return [
    {
      label: 'Expired 31-90 Days',
      count: lessTwo,
      amount: data ? formatMetricCurrency(data.expiredLessTwoMonthAmount) : 'Rp 0',
      percentage: Math.round((lessTwo / totalCount) * 100),
      color: '#ef4444',
    },
    {
      label: 'Expired <= 30 Days',
      count: moreTwo,
      amount: data ? formatMetricCurrency(data.expiredMoreTwoMonthAmount) : 'Rp 0',
      percentage: Math.round((moreTwo / totalCount) * 100),
      color: '#3b82f6',
    },
  ]
})

const maxFpmCount = computed(() => {
  const data = analyticsData.value
  if (!data) return 1
  return Math.max(
    data.fpmApprovedCount,
    data.fpmCreditedCount,
    data.fpmUncreditedCount,
    data.taxInvoiceDefectCount,
    1
  )
})

const maxVatCount = computed(() => {
  const data = analyticsData.value
  if (!data) return 1
  return Math.max(
    data.expiredLessTwoMonthCount,
    data.expiredMoreTwoMonthCount,
    1
  )
})

/* =======================
 * WHT COMPUTED DATA
 * ======================= */
const whtMetricCards = computed(() => {
  const d = analyticsData.value
  return [
    {
      label: 'PPh 21 Done',
      value: d ? d.whtPph21DoneCount : 0,
      sub: 'Total PPh',
      amount: d ? formatMetricCurrency(d.whtPph21DoneAmount) : 'Rp 0',
      icon: 'ki-duotone ki-check-circle',
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-gray-200',
      route: '/wht-pasal-21'
    },
    {
      label: 'BPU Done',
      value: d ? d.whtBpuDoneCount : 0,
      sub: 'Total PPh',
      amount: d ? formatMetricCurrency(d.whtBpuDoneAmount) : 'Rp 0',
      icon: 'ki-duotone ki-shield-tick',
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-50',
      borderClass: 'border-gray-200',
      route: '/wht-unifikasi'
    },
    {
      label: 'Draft Pending',
      value: d ? (d.whtPph21DraftCount + d.whtBpuDraftCount) : 0,
      sub: 'Total PPh',
      amount: d ? formatMetricCurrency(d.whtPph21DraftAmount + d.whtBpuDraftAmount) : 'Rp 0',
      icon: 'ki-duotone ki-time',
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-50',
      borderClass: 'border-gray-200',
      route: '/wht-reconciliation'
    },
    {
      label: 'WHT Error',
      value: d ? (d.whtPph21ErrorCount + d.whtBpuErrorCount) : 0,
      sub: 'Total PPh',
      amount: d ? formatMetricCurrency(d.whtPph21ErrorAmount + d.whtBpuErrorAmount) : 'Rp 0',
      icon: 'ki-duotone ki-cross-circle',
      colorClass: 'text-red-500',
      bgClass: 'bg-red-50',
      borderClass: 'border-gray-200',
      route: '/wht-reconciliation'
    },
  ]
})

const whtPph21ChartData = computed(() => {
  const d = analyticsData.value
  return [
    {
      label: 'Draft',
      count: d ? Number(d.whtPph21DraftCount) : 0,
      amount: d ? formatMetricCurrency(d.whtPph21DraftAmount) : 'Rp 0',
      color: '#f59e0b',
    },
    {
      label: 'Submitted',
      count: d ? Number(d.whtPph21DoneCount) : 0,
      amount: d ? formatMetricCurrency(d.whtPph21DoneAmount) : 'Rp 0',
      color: '#6366f1',
    },
    {
      label: 'Error',
      count: d ? Number(d.whtPph21ErrorCount) : 0,
      amount: d ? formatMetricCurrency(d.whtPph21ErrorAmount) : 'Rp 0',
      color: '#ef4444',
    },
  ]
})

const whtBpuChartData = computed(() => {
  const d = analyticsData.value
  return [
    {
      label: 'Draft',
      count: d ? Number(d.whtBpuDraftCount) : 0,
      amount: d ? formatMetricCurrency(d.whtBpuDraftAmount) : 'Rp 0',
      color: '#f59e0b',
    },
    {
      label: 'Submitted',
      count: d ? Number(d.whtBpuDoneCount) : 0,
      amount: d ? formatMetricCurrency(d.whtBpuDoneAmount) : 'Rp 0',
      color: '#8b5cf6',
    },
    {
      label: 'Error',
      count: d ? Number(d.whtBpuErrorCount) : 0,
      amount: d ? formatMetricCurrency(d.whtBpuErrorAmount) : 'Rp 0',
      color: '#ef4444',
    },
  ]
})

const maxWhtPph21Count = computed(() => {
  const d = analyticsData.value
  if (!d) return 1
  return Math.max(
    Number(d.whtPph21DraftCount),
    Number(d.whtPph21DoneCount),
    Number(d.whtPph21ErrorCount),
    1
  )
})

const maxWhtBpuCount = computed(() => {
  const d = analyticsData.value
  if (!d) return 1
  return Math.max(
    Number(d.whtBpuDraftCount),
    Number(d.whtBpuDoneCount),
    Number(d.whtBpuErrorCount),
    1
  )
})

const fetchAnalyticsData = async () => {
  isLoading.value = true
  try {
    const params: any = {}
    if (selectedMonth.value) params.month = selectedMonth.value
    if (selectedYear.value) params.year = selectedYear.value

    const res = await TaxService.getAnalytics(params)
    if (res.result && !res.result.isError && res.result.content) {
      analyticsData.value = res.result.content
    }
  } catch (err) {
    console.error('Error fetching tax analytics:', err)
  } finally {
    isLoading.value = false
  }
}

watch([selectedMonth, selectedYear], () => {
  // If year is cleared, also clear month
  if (!selectedYear.value && selectedMonth.value) {
    selectedMonth.value = null
  }
  fetchAnalyticsData()
})

onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()
  await fetchAnalyticsData()
})
</script>

<style scoped lang="scss">
@use './styles/taxAnalytic.scss';
</style>
