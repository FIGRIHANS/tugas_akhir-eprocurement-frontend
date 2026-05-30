<template>
  <div class="tax-analytic">
    <Breadcrumb title="Tax Analytic" :routes="routes" />
    <hr class="-mx-[24px] mb-[24px]" />

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
                <div class="text-xs text-gray-500 font-medium mt-0.5">{{ item.count }} invoices</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import TaxService, { type TaxAnalyticsData } from '@/services/tax.service'

/* =======================
 * STORE & ROUTING
 * ======================= */
const invoiceMasterApi = useInvoiceMasterDataStore()
const isLoading = ref(true)

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
      label: 'Expired < 2 Month',
      count: lessTwo,
      percentage: Math.round((lessTwo / totalCount) * 100),
      color: '#ef4444',
    },
    {
      label: 'Expired > 2 Month',
      count: moreTwo,
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

onMounted(async () => {
  await invoiceMasterApi.getCompanyCode()

  try {
    const res = await TaxService.getAnalytics()
    if (res.result && !res.result.isError && res.result.content) {
      analyticsData.value = res.result.content
    }
  } catch (err) {
    console.error('Error fetching tax analytics:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
@use './styles/taxAnalytic.scss';
</style>
