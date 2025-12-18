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
  () => {
    for (const item of steps.value) {
      const splitName = item.label.split(' ')
      if (splitName[1].toLowerCase() === props.activeName.toLowerCase()) {
        const getIndex = steps.value.findIndex((subItem) => subItem.label === item.label)
        if (getIndex !== -1) {
          for (let index = 0; index <= getIndex; index++) {
            steps.value[index].active = true
          }
        }
      }
    }
  },
  {
    immediate: true,
  },
)
</script>
