<template>
  <div class="flex flex-row justify-center">
    <div v-for="(step, index) in listStep" :key="index" class="flex flex-col items-start gap-2">
      <div class="flex flex-row items-center">
        <div
          class="size-10 rounded-full flex items-center justify-center shrink-0"
          :class="index <= activeStep ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'"
        >
          <UiIcon :name="step.icon" variant="duotone" />
        </div>

        <div
          v-if="index !== listStep.length - 1"
          class="w-[240px] h-[5px]"
          :class="index <= activeStep ? 'bg-primary' : 'bg-gray-300'"
        ></div>
      </div>

      <div class="flex flex-col items-center gap-2 -ml-[50px]">
        <span class="font-medium text-center">
          {{ step.name }}
        </span>

        <span v-if="step.date" class="text-sm text-center">{{ step.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiIcon from '../ui/atoms/icon/UiIcon.vue'

const props = defineProps<{
  listStep: {
    icon: string
    name: string
    date?: string
  }[]
  activeStep: number
}>()
</script>
