<template>
  <div class="card sales-card full-width-card">
    <div class="sales-header">
      <h4>Tender Negotiation Saving</h4>
    </div>

    <div class="sales-main sales-main-horizontal">
      <div class="sales-main-row sales-main-row-tight">
        <h3 class="text-left" style="display:inline-block; margin-right:0.25rem;">$ {{ formatNumber(14094) }}</h3>
        <span class="percentage positive" style="display:inline-block; vertical-align:middle;">+3.1%</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>Another $ {{ formatNumber(434900) }} to Goal</span>
        <div style="background-color: #F5F6F8; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #64748B; margin-left: 4px; white-space: nowrap;">(Use mouse wheel to zoom)</div>
      </div>
    </div>

    <div class="sales-chart">
      <div class="chart-labels-y">
        <span>$ 3.0M</span>
        <span>$ 2.5M</span>
        <span>$ 2.0M</span>
        <span>$ 1.5M</span>
        <span>$ 1.0M</span>
        <span>$ 0.5M</span>
      </div>

      <div class="chart-controls">
        <button @click="zoomOut" class="zoom-btn" title="Zoom Out (or use mouse wheel)">
          <span class="zoom-icon">-</span>
        </button>
        <div class="zoom-level">{{ currentZoomLevel }}</div>
        <button @click="zoomIn" class="zoom-btn" title="Zoom In (or use mouse wheel)">
          <span class="zoom-icon">+</span>
        </button>
      </div>

      <div class="chart-area" @wheel="handleWheel" ref="salesChartArea">
        <svg width="100%" height="320" viewBox="0 0 400 320">
          <defs>
            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.1" />
            </linearGradient>
          </defs>

          <!-- Grid lines -->
          <line v-for="y in [40,80,120,160,200,240,280]" :key="y"
                :x1="0" :y1="y" :x2="400" :y2="y"
                stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4"/>

          <!-- Line path -->
          <path :d="currentChartPath" stroke="#10b981" stroke-width="3" fill="none"/>

          <!-- Area fill -->
          <path :d="currentChartAreaPath" fill="url(#salesGradient)" />

          <!-- Data points -->
          <circle v-for="(point, index) in visibleDataPoints"
                  :key="index"
                  :cx="point.x"
                  :cy="point.y"
                  r="4"
                  fill="#10b981"
                  stroke="white"
                  stroke-width="2"
                  @click="showTooltip($event, point.label, point.value)"
                  class="chart-point"/>

          <!-- Axis labels -->
          <text x="10" y="260" font-size="10" fill="#64748b">$ 0</text>
          <text x="390" y="30" font-size="10" fill="#64748b" text-anchor="end">$ 3.0M</text>
        </svg>

        <!-- Tooltip -->
        <div v-if="tooltip.show"
             class="chart-tooltip"
             :style="{ 'inset-inline-start': tooltip.x + 'px', 'inset-block-start': tooltip.y + 'px' }">
          <div class="tooltip-content">
            <div class="tooltip-date">{{ tooltip.date }}</div>
            <div class="tooltip-value">{{ tooltip.value }}</div>
          </div>
        </div>
      </div>

      <div class="chart-labels-x tender-chart-labels">
        <span v-for="(label, index) in visibleXLabels" :key="index">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Tooltip, type ChartDataPoint } from '../types/ScorecardPerform'

defineProps<{ formatNumber: (num: number) => string }>()

// State
const salesChartArea = ref<HTMLElement | null>(null)
const tooltip = ref<Tooltip>({ show: false, x: 0, y: 0, date: '', value: '' })

// Zoom
const zoomLevels = ['Week', 'Month', 'Quarter', 'Year']
const currentZoomLevel = ref<string>('Week')

// Data
const weeklyChartData = ref<ChartDataPoint[]>([
  { x: 40, y: 145, label: 'Week 1', value: '$ 1.5M' },
  { x: 120, y: 120, label: 'Week 2', value: '$ 1.8M' },
  { x: 200, y: 130, label: 'Week 3', value: '$ 1.7M' },
  { x: 280, y: 110, label: 'Week 4', value: '$ 1.9M' },
  { x: 380, y: 85, label: 'Week 5', value: '$ 2.1M' }
])
const monthlyChartData = ref<ChartDataPoint[]>([
  { x: 20, y: 160, label: 'Jan', value: '$ 1.4M' },
  { x: 60, y: 140, label: 'Feb', value: '$ 1.6M' },
  { x: 100, y: 155, label: 'Mar', value: '$ 1.5M' },
  { x: 140, y: 130, label: 'Apr', value: '$ 1.7M' },
  { x: 180, y: 100, label: 'May', value: '$ 2.0M' },
  { x: 220, y: 115, label: 'Jun', value: '$ 1.9M' },
  { x: 260, y: 95, label: 'Jul', value: '$ 2.1M' },
  { x: 300, y: 80, label: 'Aug', value: '$ 2.2M' },
  { x: 340, y: 90, label: 'Sep', value: '$ 2.1M' },
  { x: 380, y: 60, label: 'Oct', value: '$ 2.4M' }
])
const quarterlyChartData = ref<ChartDataPoint[]>([
  { x: 60, y: 150, label: 'Q1', value: '$ 1.5M' },
  { x: 160, y: 110, label: 'Q2', value: '$ 1.9M' },
  { x: 260, y: 90, label: 'Q3', value: '$ 2.1M' },
  { x: 360, y: 70, label: 'Q4', value: '$ 2.3M' }
])
const yearlyChartData = ref<ChartDataPoint[]>([
  { x: 60, y: 130, label: '2022', value: '$ 1.7M' },
  { x: 160, y: 95, label: '2023', value: '$ 2.0M' },
  { x: 260, y: 110, label: '2024', value: '$ 1.9M' },
  { x: 360, y: 70, label: '2025', value: '$ 2.3M' }
])

// Computed
const visibleDataPoints = computed(() => {
  switch (currentZoomLevel.value) {
    case 'Month': return monthlyChartData.value
    case 'Quarter': return quarterlyChartData.value
    case 'Year': return yearlyChartData.value
    default: return weeklyChartData.value
  }
})
const visibleXLabels = computed(() => visibleDataPoints.value.map(p => p.label))

const currentChartPath = computed(() => {
  const points = visibleDataPoints.value
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
const currentChartAreaPath = computed(() => {
  const points = visibleDataPoints.value
  if (!points.length) return ''
  const last = points[points.length - 1]
  return `${currentChartPath.value} L ${last.x} 320 L ${points[0].x} 320 Z`
})

// Methods
const zoomIn = () => {
  const idx = zoomLevels.indexOf(currentZoomLevel.value)
  if (idx > 0) currentZoomLevel.value = zoomLevels[idx - 1]
}
const zoomOut = () => {
  const idx = zoomLevels.indexOf(currentZoomLevel.value)
  if (idx < zoomLevels.length - 1) currentZoomLevel.value = zoomLevels[idx + 1]
}
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}
const showTooltip = (e: MouseEvent, date: string, value: string) => {
  const rect = salesChartArea.value?.getBoundingClientRect()
  const offsetX = rect ? e.clientX - rect.left : 100
  const offsetY = rect ? e.clientY - rect.top - 40 : 50
  tooltip.value = { show: true, x: Math.max(8, offsetX), y: Math.max(8, offsetY), date, value }
  setTimeout(() => { tooltip.value.show = false }, 3000)
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
