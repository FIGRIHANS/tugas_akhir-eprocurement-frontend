<template>
  <svg
    :width="viewWidth"
    :height="viewHeight"
    viewBox="0 20 220 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ transform: `scale(${scale})`, transformOrigin: 'center' }"
  >
    <text
      x="0"
      y="48"
      font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      font-size="72"
      font-weight="800"
      fill="#26a69a"
      letter-spacing="-1"
      dominant-baseline="middle"
    >
      EVOX
    </text>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'EvoxLogo',
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },
  computed: {
    viewWidth() {
      return 220
    },
    viewHeight() {
      return 72
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
