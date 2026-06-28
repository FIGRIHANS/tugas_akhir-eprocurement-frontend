<template>
  <img
    class="evox-logo"
    :style="logoStyle"
    :src="evoxLogo"
    alt="EVOX"
    role="img"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import evoxLogo from '@/assets/svg/EvoxLogo.png'

const props = withDefaults(
  defineProps<{
    height?: string
    width?: string
  }>(),
  {
    height: '32px',
    width: 'auto',
  },
)

const logoStyle = computed(() => ({
  height: props.height,
  width: props.width,
}))
</script>

<style scoped>
.evox-logo {
  display: inline-block;
  vertical-align: middle;
  object-fit: contain;
}
</style>
