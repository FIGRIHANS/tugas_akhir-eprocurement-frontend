<script setup lang="ts">
import { computed } from 'vue'
import type { IModalProps } from './types/modal'

const props = withDefaults(defineProps<IModalProps>(), {
  size: 'md',
})
const open = defineModel()

const handleClose = (event: Event) => {
  if (event.target === event.currentTarget) {
    open.value = !open.value
  }
}

const classes = computed(() => [
  'modal-content',
  'modal-center-y',
  {
    'max-w-[400px]': props.size === 'sm',
    'md:max-w-[600px]': props.size === 'md',
    'lg:max-w-[800px]': props.size === 'lg',
    'w-full': props.size === 'full',
  },
])
</script>
<template>
  <div v-if="open">
    <div class="modal block open z-50" data-modal="true" @click="handleClose">
      <div :class="classes">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button
            class="btn btn-xs btn-icon btn-light"
            data-modal-dismiss="true"
            @click="open = !open"
          >
            <i class="ki-outline ki-cross"> </i>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="modal-backdrop transition-all duration-300 z-10"></div>
  </div>
</template>
