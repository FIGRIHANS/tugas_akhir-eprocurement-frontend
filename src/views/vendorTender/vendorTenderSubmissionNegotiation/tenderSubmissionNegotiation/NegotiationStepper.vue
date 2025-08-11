<template>
  <div class="flex items-center justify-center pb-[24px] ml-[50px]">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="text-center"
    >
      <div class="flex items-center mb-[8px]">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full border-2"
          :class="step.active ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-500 border-gray-300'"
        >
          <i :class="step.icon"></i>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-[95px] h-[5px]"
          :class="steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-300'"
        >
        </div>
      </div>
      <div :class="{
        '-ml-[100px]': index !== steps.length -1,
        '-ml-[20px]': index === steps.length -1
      }">
        <p class="text-[13px] font-medium mb-[8px]">{{ step.label }}</p>
        <p class="text-xs mb-[8px]">{{ moment(step.time).format('DD MMM YYYY') }}</p>
        <p class="text-xs font-bold text-primary">{{ step.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'

interface Step {
  label: string
  time: string
  name: string
  icon: string
  active: boolean
}

const steps = ref<Step[]>([
  {
    label: 'Vendor Submission',
    time: '2024-10-24',
    name: '',
    icon: 'ki-duotone ki-paper-plane',
    active: true
  },
  {
    label: 'Vendor Negotiation',
    time: '2024-10-25',
    name: '',
    icon: 'ki-duotone ki-book-open',
    active: true
  },
  {
    label: 'Vendor Awarding',
    time: '2024-10-27',
    name: '',
    icon: 'ki-duotone ki-ranking',
    active: false
  }
])
</script>
