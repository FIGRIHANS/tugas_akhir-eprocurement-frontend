<template>
  <div v-if="form" class="card">
    <div class="card-header">
      <h3 class="card-title">Tender Organization</h3>
    </div>
    <div class="card-body">
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Plant</p>
        <p>CHP2</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">Company Code</p>
        <p>1000</p>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600 form-label h-fit self-center">Method</p>
        <select v-model="form.tenderMethod" class="select" name="select">
          <option v-for="option in methodOptions" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="flex align-items-center justify-between gap-[8px] text-sm mb-[20px]">
        <p class="text-gray-600">PIC Tender</p>
        <p>Joko</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import type { FormTypes } from '../../types/tenderCreate'

const form = inject<FormTypes>('form')

const methodOptions = ref([
  { label: 'Normal Tender', value: 'normal_tender' },
  { label: 'Auction', value: 'auction' },
  { label: 'Direct RFQ', value: 'direct_rfq' },
])
</script>
