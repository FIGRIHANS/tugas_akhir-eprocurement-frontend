<template>
  <div class="flex items-center justify-center pb-[24px] ml-[50px]">
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
          class="w-[100px] h-[5px]"
          :class="steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>

      <div
        :class="{
          '-ml-[100px]': index !== steps.length - 1,
          '-ml-[20px]': index === steps.length - 1,
        }"
      >
        <p class="text-[13px] font-medium mb-[8px]">{{ step.label }}</p>
        <p class="text-xs mb-[8px]">{{ moment(step.time).format('DD MMM YYYY') }}</p>
        <p class="text-xs font-bold text-primary">{{ step.name || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import moment from 'moment'
import type { listStepTypes } from './types/stepperStatus'

const props = defineProps<{
  activeName: string
}>()

const steps = ref<listStepTypes[]>([
  {
    label: 'Create Contract Request',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-document',
  },
  { label: 'Published', time: '2025-10-22', name: '', icon: 'ki-duotone ki-file-up' },
  {
    label: 'Vendor Feedback',
    time: '2025-10-22',
    name: '',
    icon: 'ki-duotone ki-book-open',
  },
  {
    label: 'Contract Finalization',
    time: '2025-10-22',
    name: '',
    icon: 'ki-duotone ki-shield-search',
  },
  {
    label: 'Contract Settlement',
    time: '2025-10-22',
    name: '',
    icon: 'ki-duotone ki-ranking',
  },
  {
    label: 'Contract Close',
    time: '2025-10-22',
    name: '',
    icon: 'ki-duotone ki-file-deleted',
  },
])

watch(
  () => props.activeName,
  () => {
    for (const item of steps.value) {
      const splitName = item.label.split(' ')
      const getName = splitName.length > 1 ? splitName[1] : splitName[0]
      if (getName.toLowerCase() === props.activeName.toLowerCase()) {
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
    immediate: true
  }
)
</script>
