<template>
  <div class="flex items-center justify-center pb-[24px]">
    <div v-for="(step, index) in steps" :key="index" class="text-center">
      <div class="flex items-center mb-[8px]">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full border-2"
          :class="
            step.active
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-gray-200 text-gray-500 border-gray-300'
          "
        >
          <i :class="step.icon"></i>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-[160px] h-[5px]"
          :class="steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>
      <span
        :class="{
          '-ml-[140px]': index !== steps.length - 1,
          '-ml-[30px]': index === steps.length - 1,
        }"
      >
        {{ step.label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { listStepTypes } from './types/stepperStatus'

const props = defineProps<{
  activeName: string
}>()

const steps = ref<listStepTypes[]>([
  { label: 'Invoice Submission', icon: 'ki-duotone ki-document', active: true },
  { label: 'Invoice Verification', icon: 'ki-duotone ki-shield-tick', active: false },
  { label: 'Invoice Approval', icon: 'ki-duotone ki-double-check-circle', active: false },
  { label: 'Invoice Posting', icon: 'ki-duotone ki-paper-plane', active: false },
  { label: 'Payment Status', icon: 'ki-duotone ki-dollar', active: false },
])

watch(
  () => props.activeName,
  (newActiveName) => {
    const targetName = newActiveName ? newActiveName.toLowerCase() : ''

    const targetIndex = steps.value.findIndex((step) => {
      const splitName = step.label.split(' ')
      const key = (splitName[1] || splitName[0]).toLowerCase()
      return key === targetName
    })

    steps.value.forEach((step, index) => {
      if (targetIndex === -1) {
        // Default ke step pertama kalau tidak ada yang cocok
        step.active = index === 0
      } else {
        step.active = index <= targetIndex
      }
    })
  },
  {
    immediate: true,
  },
)
</script>
