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
      <!-- Purchase Orders KPI -->
      <p class="section-label">
        <i class="ki-duotone ki-element-11 text-purple-500 mr-1"></i>
        Purchase Orders
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div
          v-for="card in poCards"
          :key="card.label"
          class="kpi-card"
          :class="[card.borderClass, card.label === 'Total Value' ? 'col-span-2 md:col-span-1' : '']"
          :style="{ borderWidth: '1px', borderStyle: 'solid' }"
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

      <!-- Delivery Notes KPI -->
      <p class="section-label">
        <i class="ki-duotone ki-package text-teal-500 mr-1"></i>
        Delivery Notes
      </p>
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
          <div class="min-w-0">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <!-- Receiving Confirmation KPI -->
      <p class="section-label">
        <i class="ki-duotone ki-document text-blue-500 mr-1"></i>
        Receiving Confirmation
      </p>
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
          <div class="min-w-0">
            <p class="kpi-label">{{ card.label }}</p>
            <p class="kpi-value">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <!-- Status Distributions (Vertical Columns) -->
      <p class="section-label">
        <i class="ki-duotone ki-chart-line-star text-teal-500 mr-1"></i>
        Status Distributions
      </p>
      <div class="grid grid-cols-12 gap-6 mb-6">
        <!-- DN Status Distribution -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-package text-teal-500 mr-1"></i>
            DN Status Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 160px">
              <div class="trend-bars">
                <div v-for="item in dnStatusData" :key="item.label" class="trend-bar">
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / maxDnStatusCount) * 100 + '%',
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
              <div v-for="item in dnStatusData" :key="item.label" class="chart-bottom-label">
                <div class="font-semibold text-gray-900 text-xs truncate max-w-full" :title="item.label">
                  {{ item.label }}
                </div>
                <div class="text-xs text-gray-500 font-medium mt-0.5">{{ item.count }} docs</div>
                <div class="text-xs text-gray-400 font-medium">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RC Status Distribution -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-document text-blue-500 mr-1"></i>
            RC Status Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 160px">
              <div class="trend-bars">
                <div v-for="item in rcStatusData" :key="item.label" class="trend-bar">
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / maxRcStatusCount) * 100 + '%',
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
              <div v-for="item in rcStatusData" :key="item.label" class="chart-bottom-label">
                <div class="font-semibold text-gray-900 text-xs truncate max-w-full" :title="item.label">
                  {{ item.label }}
                </div>
                <div class="text-xs text-gray-500 font-medium mt-0.5">{{ item.count }} docs</div>
                <div class="text-xs text-gray-400 font-medium">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- PO Status Distribution -->
        <div class="col-span-12 md:col-span-4 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-element-11 text-purple-500 mr-1"></i>
            PO Status Distribution
          </p>
          <div class="chart-with-labels mt-4">
            <div class="mini-trend-chart" style="block-size: 160px">
              <div class="trend-bars">
                <div v-for="item in poStatusData" :key="item.label" class="trend-bar">
                  <div
                    class="trend-bar-base"
                    :style="{
                      'block-size': (item.count / maxPoStatusCount) * 100 + '%',
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
              <div v-for="item in poStatusData" :key="item.label" class="chart-bottom-label">
                <div class="font-semibold text-gray-900 text-xs truncate max-w-full" :title="item.label">
                  {{ item.label }}
                </div>
                <div class="text-xs text-gray-500 font-medium mt-0.5">{{ item.count }} docs</div>
                <div class="text-xs text-gray-400 font-medium">{{ item.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Inbound Volume Line Chart -->
      <div class="chart-card mb-6">
        <div class="flex justify-between items-center mb-4">
          <p class="chart-title mb-0">
            <i class="ki-duotone ki-chart-line-star text-teal-500 mr-1"></i>
            Monthly Inbound Volume — DN vs RC vs PO
          </p>
          <div class="flex gap-4 text-xs font-semibold">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-0.5 inline-block" style="background-color: #14b8a6; height: 3px;"></span>
              <span class="text-gray-600">Delivery Notes</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-0.5 inline-block" style="background-color: #0ea5e9; height: 3px;"></span>
              <span class="text-gray-600">Receiving Conf.</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-0.5 inline-block" style="background-color: #f59e0b; height: 3px;"></span>
              <span class="text-gray-600">Purchase Orders</span>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="writing-vertical text-gray-400 mr-2 text-xs flex justify-center items-center">Volume</div>
          <div class="line-chart-wrapper flex-grow" style="block-size: 240px">
            <svg class="line-chart" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="dnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.0" />
                </linearGradient>
                <linearGradient id="rcGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.0" />
                </linearGradient>
                <linearGradient id="poGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <!-- Grid Lines -->
              <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" stroke-width="1" />
              <line x1="0" y1="35" x2="300" y2="35" stroke="#f1f5f9" stroke-width="1" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" stroke-width="1" />
              <line x1="0" y1="85" x2="300" y2="85" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="2" />

              <!-- Areas -->
              <path :d="dnAreaPath" fill="url(#dnGradient)" class="area-path" />
              <path :d="rcAreaPath" fill="url(#rcGradient)" class="area-path" />
              <path :d="poAreaPath" fill="url(#poGradient)" class="area-path" />

              <!-- Lines -->
              <path :d="dnLinePath" fill="none" stroke="#14b8a6" stroke-width="2" class="line-path" />
              <path :d="rcLinePath" fill="none" stroke="#0ea5e9" stroke-width="2" class="line-path" />
              <path :d="poLinePath" fill="none" stroke="#f59e0b" stroke-width="2" class="line-path" />
            </svg>
            <div class="chart-labels flex justify-between px-2 text-xs text-gray-500 mt-2">
              <div v-for="(lbl, idx) in monthlyCategories" :key="idx" class="chart-label">
                {{ lbl }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discrepancy & PO Breakdown -->
      <div class="grid grid-cols-12 gap-6">
        <!-- RC Discrepancy Card -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-information-2 text-orange-500 mr-1"></i>
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

        <!-- PO Value Breakdown Progress bars -->
        <div class="col-span-12 md:col-span-6 chart-card">
          <p class="chart-title">
            <i class="ki-duotone ki-dollar text-purple-500 mr-1"></i>
            PO Value Breakdown
          </p>
          <div class="space-y-4 py-2">
            <div v-for="item in poValueDistribution" :key="item.label" class="space-y-1.5">
              <div class="flex justify-between items-center text-sm">
                <span class="font-medium text-gray-700">{{ item.label }}</span>
                <div class="text-right flex items-center gap-2 text-xs">
                  <span class="font-semibold text-gray-900">{{ item.amount }}</span>
                  <span class="text-gray-300">|</span>
                  <span class="font-bold text-xs" :style="{ color: item.color }">{{ item.percentage }}%</span>
                </div>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :style="{
                    width: item.percentage + '%',
                    backgroundColor: item.color
                  }"
                ></div>
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
 * RAW DATA STATE
 * ─────────────────────────────────────────── */
const isLoading = ref(true)
const dnRaw = ref<any[]>([])
const rcRaw = ref<any[]>([])
const poRaw = ref<any[]>([])

/* ─────────────────────────────────────────────
 * COMPUTED KPI STATS
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
 * KPI CARDS CONFIGURATION
 * ─────────────────────────────────────────── */
const dnCards = computed(() => [
  { label: 'Total DN',        value: dnStats.value.total,         icon: 'ki-duotone ki-package',        colorClass: 'text-teal-600',   bgClass: 'bg-teal-50',   borderClass: 'border-gray-200' },
  { label: 'On Delivery',     value: dnStats.value.onDelivery,    icon: 'ki-duotone ki-truck',          colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-gray-200' },
  { label: 'Received',        value: dnStats.value.received,      icon: 'ki-duotone ki-check-circle',   colorClass: 'text-green-600',  bgClass: 'bg-green-50',  borderClass: 'border-gray-200' },
  { label: 'Partial Received',value: dnStats.value.partialReceived,icon: 'ki-duotone ki-information-2', colorClass: 'text-orange-500', bgClass: 'bg-orange-50', borderClass: 'border-gray-200' },
  { label: 'Completed',       value: dnStats.value.completed,     icon: 'ki-duotone ki-shield-tick',    colorClass: 'text-teal-600',   bgClass: 'bg-teal-50',   borderClass: 'border-gray-200' },
])

const rcCards = computed(() => [
  { label: 'Total RC',          value: rcStats.value.total,           icon: 'ki-duotone ki-document',       colorClass: 'text-blue-600',   bgClass: 'bg-blue-50',   borderClass: 'border-gray-200' },
  { label: 'Waiting Approval',  value: rcStats.value.waitingApproval, icon: 'ki-duotone ki-time',           colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-gray-200' },
  { label: 'Completed',         value: rcStats.value.completed,       icon: 'ki-duotone ki-check-circle',   colorClass: 'text-green-600',  bgClass: 'bg-green-50',  borderClass: 'border-gray-200' },
  { label: 'Rejected',          value: rcStats.value.rejected,        icon: 'ki-duotone ki-cross-circle',   colorClass: 'text-red-500',    bgClass: 'bg-red-50',    borderClass: 'border-gray-200' },
  { label: 'Discrepancy',       value: rcStats.value.hasDiscrepancy,  icon: 'ki-duotone ki-information-2',  colorClass: 'text-orange-500', bgClass: 'bg-orange-50', borderClass: 'border-gray-200' },
])

const poCards = computed(() => [
  { label: 'Total PO',           value: poStats.value.total,              icon: 'ki-duotone ki-element-11', colorClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-gray-200' },
  { label: 'Open',               value: poStats.value.open,               icon: 'ki-duotone ki-folder-open',colorClass: 'text-cyan-600',   bgClass: 'bg-cyan-50',   borderClass: 'border-gray-200' },
  { label: 'Partial Delivery',   value: poStats.value.partiallyDelivered, icon: 'ki-duotone ki-delivery',   colorClass: 'text-amber-500',  bgClass: 'bg-amber-50',  borderClass: 'border-gray-200' },
  { label: 'Delivered',          value: poStats.value.delivered,          icon: 'ki-duotone ki-check-circle',colorClass: 'text-green-600', bgClass: 'bg-green-50',  borderClass: 'border-gray-200' },
  { label: 'Closed',             value: poStats.value.closed,             icon: 'ki-duotone ki-lock',       colorClass: 'text-gray-500',   bgClass: 'bg-gray-100',  borderClass: 'border-gray-200' },
  { label: 'Total Value',        value: poStats.value.totalValueFormatted,icon: 'ki-duotone ki-dollar',     colorClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-gray-200' },
])

/* ─────────────────────────────────────────────
 * STATS COMPUTATION FOR CUSTOM PLOTTING
 * ─────────────────────────────────────────── */
const dnStatusData = computed(() => {
  const stats = dnStats.value
  const total = stats.total || 1
  return [
    { label: 'On Delivery', count: stats.onDelivery, percentage: Math.round((stats.onDelivery / total) * 100), color: '#f59e0b' },
    { label: 'Received', count: stats.received, percentage: Math.round((stats.received / total) * 100), color: '#22c55e' },
    { label: 'Partial Received', count: stats.partialReceived, percentage: Math.round((stats.partialReceived / total) * 100), color: '#f97316' },
    { label: 'Completed', count: stats.completed, percentage: Math.round((stats.completed / total) * 100), color: '#14b8a6' },
  ]
})

const rcStatusData = computed(() => {
  const stats = rcStats.value
  const total = stats.total || 1
  const draft = rcRaw.value.filter((i) => i.status === 'Draft').length
  return [
    { label: 'Waiting Approval', count: stats.waitingApproval, percentage: Math.round((stats.waitingApproval / total) * 100), color: '#f59e0b' },
    { label: 'Completed', count: stats.completed, percentage: Math.round((stats.completed / total) * 100), color: '#22c55e' },
    { label: 'Rejected', count: stats.rejected, percentage: Math.round((stats.rejected / total) * 100), color: '#ef4444' },
    { label: 'Draft', count: draft, percentage: Math.round((draft / total) * 100), color: '#6b7280' },
  ]
})

const poStatusData = computed(() => {
  const stats = poStats.value
  const total = stats.total || 1
  return [
    { label: 'Open', count: stats.open, percentage: Math.round((stats.open / total) * 100), color: '#0ea5e9' },
    { label: 'Partial Delivery', count: stats.partiallyDelivered, percentage: Math.round((stats.partiallyDelivered / total) * 100), color: '#f59e0b' },
    { label: 'Delivered', count: stats.delivered, percentage: Math.round((stats.delivered / total) * 100), color: '#22c55e' },
    { label: 'Closed', count: stats.closed, percentage: Math.round((stats.closed / total) * 100), color: '#94a3b8' },
  ]
})

const maxDnStatusCount = computed(() => {
  return Math.max(...dnStatusData.value.map(i => i.count), 1)
})
const maxRcStatusCount = computed(() => {
  return Math.max(...rcStatusData.value.map(i => i.count), 1)
})
const maxPoStatusCount = computed(() => {
  return Math.max(...poStatusData.value.map(i => i.count), 1)
})

/* ─────────────────────────────────────────────
 * SVG MULTI-LINE BEZIER PLOTTING
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

const monthlyCategories = computed(() => {
  const buckets = getMonthlyBuckets(dnRaw.value, 'createdUtcDate', 6)
  return Object.keys(buckets)
})

const maxMonthlyValue = computed(() => {
  const dnBuckets = getMonthlyBuckets(dnRaw.value, 'createdUtcDate', 6)
  const rcBuckets = getMonthlyBuckets(rcRaw.value, 'createdUtcDate', 6)
  const poBuckets = getMonthlyBuckets(poRaw.value, 'createdUtcDate', 6)
  return Math.max(
    ...Object.values(dnBuckets),
    ...Object.values(rcBuckets),
    ...Object.values(poBuckets),
    1
  )
})

function buildPoints(values: number[], maxValue: number) {
  const n = values.length
  return values.map((v, i) => {
    const x = (i / (n - 1)) * 280 + 10
    let y = 90 - (v / maxValue) * 80
    return { x, y }
  })
}

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

const dnPoints = computed(() => {
  const buckets = getMonthlyBuckets(dnRaw.value, 'createdUtcDate', 6)
  return buildPoints(Object.values(buckets), maxMonthlyValue.value)
})
const dnLinePath = computed(() => {
  const pts = dnPoints.value
  if (!pts.length) return ''
  return `M ${pts[0].x},${pts[0].y} ${catmullRom2bezier(pts)}`
})
const dnAreaPath = computed(() => {
  const pts = dnPoints.value
  if (!pts.length) return ''
  return `${dnLinePath.value} L ${pts[pts.length - 1].x},95 L ${pts[0].x},95 Z`
})

const rcPoints = computed(() => {
  const buckets = getMonthlyBuckets(rcRaw.value, 'createdUtcDate', 6)
  return buildPoints(Object.values(buckets), maxMonthlyValue.value)
})
const rcLinePath = computed(() => {
  const pts = rcPoints.value
  if (!pts.length) return ''
  return `M ${pts[0].x},${pts[0].y} ${catmullRom2bezier(pts)}`
})
const rcAreaPath = computed(() => {
  const pts = rcPoints.value
  if (!pts.length) return ''
  return `${rcLinePath.value} L ${pts[pts.length - 1].x},95 L ${pts[0].x},95 Z`
})

const poPoints = computed(() => {
  const buckets = getMonthlyBuckets(poRaw.value, 'createdUtcDate', 6)
  return buildPoints(Object.values(buckets), maxMonthlyValue.value)
})
const poLinePath = computed(() => {
  const pts = poPoints.value
  if (!pts.length) return ''
  return `M ${pts[0].x},${pts[0].y} ${catmullRom2bezier(pts)}`
})
const poAreaPath = computed(() => {
  const pts = poPoints.value
  if (!pts.length) return ''
  return `${poLinePath.value} L ${pts[pts.length - 1].x},95 L ${pts[0].x},95 Z`
})

/* ─────────────────────────────────────────────
 * PO VALUE BREAKDOWN
 * ─────────────────────────────────────────── */
const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

const poValueDistribution = computed(() => {
  const openVal = poRaw.value.filter((i: any) => i.status === 'Open').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const partialVal = poRaw.value.filter((i: any) => i.status === 'Partial').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const deliveredVal = poRaw.value.filter((i: any) => i.status === 'Delivered').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const closedVal = poRaw.value.filter((i: any) => i.status === 'Closed').reduce((s: number, i: any) => s + (i.totalAmount || 0), 0)
  const total = openVal + partialVal + deliveredVal + closedVal || 1

  return [
    { label: 'Open', amount: formatCompactCurrency(openVal), percentage: Math.round((openVal / total) * 100), color: '#0ea5e9' },
    { label: 'Partial Delivery', amount: formatCompactCurrency(partialVal), percentage: Math.round((partialVal / total) * 100), color: '#f59e0b' },
    { label: 'Delivered', amount: formatCompactCurrency(deliveredVal), percentage: Math.round((deliveredVal / total) * 100), color: '#22c55e' },
    { label: 'Closed', amount: formatCompactCurrency(closedVal), percentage: Math.round((closedVal / total) * 100), color: '#94a3b8' },
  ]
})

/* ─────────────────────────────────────────────
 * DATA FETCHING & LIFECYCLE
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

onMounted(async () => {
  await fetchAllData()
})
</script>

<style scoped lang="scss">
@use './styles/inboundLogistic.scss';
</style>
