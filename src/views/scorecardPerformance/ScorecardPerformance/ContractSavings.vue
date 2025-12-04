<template>
  <div class="card sales-card large-card">
    <div class="sales-header">
      <h4>Contract Savings</h4>
    </div>

    <div class="sales-main sales-main-horizontal">
      <div class="sales-main-row sales-main-row-tight">
        <h3 class="text-left" style="display:inline-block; margin-right:0.25rem;">$ {{ formatNumber(3706) }}</h3>
        <span class="percentage positive" style="display:inline-block; vertical-align:middle;">+4.3%</span>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 8px;">
      <span>Total Discounted Sales This Month</span>
      <div style="background-color: #F5F6F8; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #64748B; margin-left: 4px; white-space: nowrap;">(Use mouse wheel to zoom)</div>
    </div>

    <div class="discount-chart">
      <div class="chart-labels-y">
        <span>$ 400K</span>
        <span>$ 300K</span>
        <span>$ 200K</span>
        <span>$ 100K</span>
      </div>

      <div class="chart-controls">
        <button
          @click="zoomOutDiscount"
          class="zoom-btn"
          title="Zoom Out (or use mouse wheel)"
        >
          <span class="zoom-icon">-</span>
        </button>

        <div class="zoom-level">{{ currentDiscountZoomLevel }}</div>

        <button
          @click="zoomInDiscount"
          class="zoom-btn"
          title="Zoom In (or use mouse wheel)"
        >
          <span class="zoom-icon">+</span>
        </button>
      </div>

      <div class="chart-area" @wheel="handleWheelDiscount" ref="discountChartArea">
        <svg width="100%" height="320" viewBox="0 0 400 320">
          <defs>
            <linearGradient id="discountGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1" />
            </linearGradient>
          </defs>

          <!-- Grid lines -->
          <line v-for="y in [40, 80, 120, 160, 200, 240, 280]"
                :key="y"
                :x1="0"
                :y1="y"
                :x2="400"
                :y2="y"
                stroke="#e5e7eb"
                stroke-width="1"
                stroke-dasharray="4,4" />

          <!-- Chart line -->
          <path
            :d="currentDiscountChartPath"
            stroke="#3b82f6"
            stroke-width="3"
            fill="none"
          />
          <!-- Chart area -->
          <path
            :d="currentDiscountChartAreaPath"
            fill="url(#discountGradient)"
          />

          <!-- Data points -->
          <template v-for="(point, index) in visibleDiscountDataPoints" :key="index">
            <circle
              :cx="point.x"
              :cy="point.y"
              r="4"
              fill="#3b82f6"
              stroke="white"
              stroke-width="2"
              @click="showDiscountTooltip($event, point.label, point.value)"
              class="chart-point"
            />
          </template>

          <!-- Y Labels -->
          <text x="10" y="260" font-size="10" fill="#64748b">$ 0</text>
          <text x="390" y="50" font-size="10" fill="#64748b" text-anchor="end">$ 400K</text>
        </svg>

        <!-- Tooltip -->
        <div
          v-if="discountTooltip.show"
          class="chart-tooltip discount-tooltip"
          :style="{ 'inset-inline-start': discountTooltip.x + 'px', 'inset-block-start': discountTooltip.y + 'px' }"
        >
          <div class="tooltip-content">
            <div class="tooltip-date">{{ discountTooltip.date }}</div>
            <div class="tooltip-value">{{ discountTooltip.value }}</div>
          </div>
        </div>
      </div>

      <div class="chart-labels-x discount-chart-labels">
        <span v-for="(label, index) in visibleDiscountXLabels" :key="index">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Tooltip, type ChartDataPoint } from '../types/ScorecardPerform'

// Props
defineProps<{ formatNumber: (num: number) => string }>()

// Refs and state
const discountChartArea = ref<HTMLElement | null>(null)
const discountTooltip = ref<Tooltip>({ show: false, x: 0, y: 0, date: '', value: '' })

// Zoom levels
const zoomLevels = ['Week', 'Month', 'Quarter', 'Year']
const currentDiscountZoomLevel = ref<string>('Week')

// Data
const weeklyDiscountChartData = ref<ChartDataPoint[]>([
  { x: 40, y: 130, label: 'Week 1', value: '$ 270K' },
  { x: 120, y: 100, label: 'Week 2', value: '$ 300K' },
  { x: 200, y: 140, label: 'Week 3', value: '$ 260K' },
  { x: 280, y: 120, label: 'Week 4', value: '$ 280K' },
  { x: 380, y: 90, label: 'Week 5', value: '$ 320K' }
])

const monthlyDiscountChartData = ref<ChartDataPoint[]>([
  { x: 20, y: 130, label: 'Jan', value: '$ 270K' },
  { x: 60, y: 110, label: 'Feb', value: '$ 290K' },
  { x: 100, y: 140, label: 'Mar', value: '$ 260K' },
  { x: 140, y: 120, label: 'Apr', value: '$ 280K' },
  { x: 180, y: 90, label: '$ 320K', value: '$ 320K' },
  { x: 220, y: 100, label: 'Jun', value: '$ 310K' },
  { x: 260, y: 110, label: 'Jul', value: '$ 290K' },
  { x: 300, y: 105, label: 'Aug', value: '$ 300K' },
  { x: 340, y: 130, label: 'Sep', value: '$ 270K' },
  { x: 380, y: 95, label: 'Oct', value: '$ 315K' }
])

const quarterlyDiscountChartData = ref<ChartDataPoint[]>([
  { x: 60, y: 130, label: 'Q1', value: '$ 270K' },
  { x: 160, y: 90, label: 'Q2', value: '$ 320K' },
  { x: 260, y: 110, label: 'Q3', value: '$ 290K' },
  { x: 360, y: 95, label: 'Q4', value: '$ 310K' }
])

const yearlyDiscountChartData = ref<ChartDataPoint[]>([
  { x: 60, y: 120, label: '2022', value: '$ 280K' },
  { x: 160, y: 90, label: '2023', value: '$ 320K' },
  { x: 260, y: 130, label: '2024', value: '$ 265K' },
  { x: 360, y: 100, label: '2025', value: '$ 305K' }
])

// Computed
const visibleDiscountDataPoints = computed(() => {
  switch (currentDiscountZoomLevel.value) {
    case 'Week': return weeklyDiscountChartData.value
    case 'Month': return monthlyDiscountChartData.value
    case 'Quarter': return quarterlyDiscountChartData.value
    case 'Year': return yearlyDiscountChartData.value
    default: return weeklyDiscountChartData.value
  }
})

const visibleDiscountXLabels = computed(() => visibleDiscountDataPoints.value.map(p => p.label))

const currentDiscountChartPath = computed(() => {
  const points = visibleDiscountDataPoints.value
  if (!points.length) return ''

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i+1].x) / 2
    const yc = (points[i].y + points[i+1].y) / 2
    path += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`
  }
  const last = points[points.length - 1]
  path += ` T ${last.x} ${last.y}`
  return path
})

const currentDiscountChartAreaPath = computed(() => {
  const points = visibleDiscountDataPoints.value
  if (!points.length) return ''
  const last = points[points.length - 1]
  return `${currentDiscountChartPath.value} L ${last.x} 290 L ${points[0].x} 290 Z`
})

// Zoom
const zoomInDiscount = () => {
  const idx = zoomLevels.indexOf(currentDiscountZoomLevel.value)
  if (idx > 0) currentDiscountZoomLevel.value = zoomLevels[idx - 1]
}

const zoomOutDiscount = () => {
  const idx = zoomLevels.indexOf(currentDiscountZoomLevel.value)
  if (idx < zoomLevels.length - 1) currentDiscountZoomLevel.value = zoomLevels[idx + 1]
}

// Wheel zoom
const handleWheelDiscount = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomInDiscount()
  } else {
    zoomOutDiscount()
  }
}

// Tooltip
const showDiscountTooltip = (e: MouseEvent, date: string, value: string) => {
  const rect = discountChartArea.value?.getBoundingClientRect()
  const offsetX = rect ? e.clientX - rect.left : 100
  const offsetY = rect ? e.clientY - rect.top - 40 : 50

  discountTooltip.value = { show: true, x: Math.max(8, offsetX), y: Math.max(8, offsetY), date, value }
  setTimeout(() => discountTooltip.value.show = false, 3000)
}
</script>

<style lang="scss" scoped>
@import '../styles/ScorecardPerform.scss';
.sales-main-horizontal .sales-main-row {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}
.sales-main-row-tight {
  gap: 0 !important;
}
</style>
