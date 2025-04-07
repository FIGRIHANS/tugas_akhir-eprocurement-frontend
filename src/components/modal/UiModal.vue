<script setup lang="ts">
import { computed } from 'vue'
import type { IModalProps } from './types/modal'

const props = withDefaults(defineProps<IModalProps>(), {
  title: 'Modal',
  size: 'md',
})
const emit = defineEmits(['close'])

const handleClose = (e: Event) => {
  if (e.target === e.currentTarget) {
    emit('close')
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
  <div
    class="modal modal-backdrop open block z-10"
    v-if="open"
    data-modal="true"
    @click="handleClose"
  >
    <div :class="classes">
      <div class="modal-header">
        <h3 class="modal-title">{{ title ?? 'Modal' }}</h3>
        <button
          class="btn btn-xs btn-icon btn-light"
          data-modal-dismiss="true"
          @click="$emit('close')"
        >
          <i class="ki-outline ki-cross"> </i>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
