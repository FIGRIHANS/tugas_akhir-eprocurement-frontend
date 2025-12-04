<template>
  <div
    class="circular-progress-container"
    :style="{ 'inline-size': `${componentSize}px`, 'block-size': `${componentSize}px` }"
  >
    <svg :width="componentSize" :height="componentSize" viewBox="0 0 120 120">
      <defs>
        <!-- Blue gradient -->
        <linearGradient id="blueGradient" gradientUnits="userSpaceOnUse" x1="10" y1="60" x2="110" y2="60">
          <stop offset="0%" stop-color="#3095de" />
          <stop offset="100%" stop-color="#0078d4" />
        </linearGradient>

        <!-- Yellow gradient -->
        <linearGradient id="yellowGradient" gradientUnits="userSpaceOnUse" x1="60" y1="10" x2="60" y2="110">
          <stop offset="0%" stop-color="#fdb913" />
          <stop offset="100%" stop-color="#f7931e" />
        </linearGradient>

        <!-- Purple gradient -->
        <linearGradient id="purpleGradient" gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="110" y2="110">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>

        <!-- Cap gradients -->
        <radialGradient id="blueCapGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3095de" />
          <stop offset="100%" stop-color="#0078d4" />
        </radialGradient>

        <radialGradient id="yellowCapGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fdb913" />
          <stop offset="100%" stop-color="#f7931e" />
        </radialGradient>
      </defs>

      <!-- Background circle -->
      <circle cx="60" cy="60" r="54" stroke="#e2e8f0" stroke-width="12" fill="none" />

      <!-- Blue arc -->
      <path :d="blueArcPath" stroke="url(#blueGradient)" stroke-width="12" fill="none" stroke-linecap="round" class="segment-path blue-segment" />

      <!-- Yellow arc -->
      <path :d="yellowArcPath" stroke="url(#yellowGradient)" stroke-width="12" fill="none" stroke-linecap="round" class="segment-path yellow-segment" />

      <!-- Caps -->
      <circle cx="60" cy="6" r="6" fill="url(#blueCapGradient)" class="segment-cap" />
      <circle :cx="blueYellowPoint.x" :cy="blueYellowPoint.y" r="6" fill="url(#yellowCapGradient)" class="segment-cap" />
      <circle :cx="endPoint.x" :cy="endPoint.y" r="6" fill="url(#yellowCapGradient)" class="segment-cap" />

      <!-- Text -->
      <text x="60" y="65" text-anchor="middle" fill="url(#purpleGradient)" font-size="24" font-weight="700" class="percentage-text">
        80%
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 80
  }
})

const radius = 54
const center = 60

// Calculate point on circle
const pointOnCircle = (angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: center + (radius * Math.cos(angleInRadians)),
    y: center + (radius * Math.sin(angleInRadians))
  }
}

// Generate arc path
const generateArcPath = (startAngle: number, endAngle: number) => {
  const start = pointOnCircle(startAngle)
  const end = pointOnCircle(endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

const componentSize = computed(() => props.size)

// Transition point between blue and yellow
const blueYellowPoint = computed(() => {
  const angle = (55 / 100) * 360
  return pointOnCircle(angle)
})

// End point of yellow arc
const endPoint = computed(() => {
  const angle = ((55 + 25) / 100) * 360
  return pointOnCircle(angle)
})

// Blue arc (0–55%)
const blueArcPath = computed(() => {
  const startAngle = 0
  const endAngle = (55 / 100) * 360
  return generateArcPath(startAngle, endAngle)
})

// Yellow arc (55–80%)
const yellowArcPath = computed(() => {
  const startAngle = (55 / 100) * 360
  const endAngle = (80 / 100) * 360
  return generateArcPath(startAngle, endAngle)
})
</script>

<style scoped lang="scss">
.circular-progress-container {
  position: relative;
}

.segment-path {
  transition: stroke-width 0.2s ease;
}

.blue-segment {
  filter: drop-shadow(0 0 1px rgba(0, 120, 212, 0.3));
}

.yellow-segment {
  filter: drop-shadow(0 0 1px rgba(247, 147, 30, 0.3));
}

.segment-cap {
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
}

.percentage-text {
  font-family: Arial, sans-serif;
  text-shadow: 0 0 2px rgba(124, 58, 237, 0.3);
}
</style>
