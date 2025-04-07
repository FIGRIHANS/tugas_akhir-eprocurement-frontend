<script setup lang="ts">
import { ref } from 'vue'
import type { IModalProps } from './types/modal'

defineProps<IModalProps>()
const emit = defineEmits(['close'])

const modalRef = ref<HTMLElement>()

const handleClose = (e: Event) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>
<template>
  <div
    ref="modalRef"
    class="modal modal-backdrop open block z-10"
    v-show="open"
    data-modal="true"
    @click="handleClose"
  >
    <div class="modal-content modal-center-y max-w-[600px]">
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
