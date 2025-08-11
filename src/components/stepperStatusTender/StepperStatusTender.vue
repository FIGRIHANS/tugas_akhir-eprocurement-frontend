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
          class="w-[120px] h-[5px]"
          :class="steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-300'"
        ></div>
      </div>
      <div
        :class="{
          '-ml-[120px]': index !== steps.length - 1,
          '-ml-[20px]': index === steps.length - 1,
        }"
      >
        <p class="text-[13px] font-medium mb-[8px]">{{ step.label }}</p>
        <p
          class="text-xs mb-[8px]"
          :class="{
            'h-[16px]': !step.time
          }"
        >
          {{ step.time ? moment(step.time).format('DD MMM YYYY') : '' }}
        </p>
        <p
          class="text-xs font-bold text-primary"
          :class="{
            'h-[16px]': !step.name
          }"
        >
          {{ step.name || '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import moment from 'moment'

interface listStepTypes {
  label: string
  time: string
  name: string
  icon: string
  active: boolean
}

const props = withDefaults(
  defineProps<{
    activeName: string
    role?: 'admin' | 'vendor'
  }>(),
  {
    role: 'admin',
  },
)

const steps = ref<listStepTypes[]>([
  {
    label: 'Create Tender Request',
    time: '2025-10-22',
    name: 'Joko Anwar',
    icon: 'ki-duotone ki-document',
    active: true,
  },
  {
    label: 'Published',
    time: '',
    name: '',
    icon: 'ki-duotone ki-file-up',
    active: false,
  },
  {
    label: 'Vendor Submission',
    time: '',
    name: '',
    icon: 'ki-duotone ki-paper-plane',
    active: false,
  },
  {
    label: 'Vendor Negotiation',
    time: '',
    name: '',
    icon: 'ki-duotone ki-book-open',
    active: false,
  },
  {
    label: 'Vendor Awarding',
    time: '',
    name: '',
    icon: 'ki-duotone ki-ranking',
    active: false,
  },
  {
    label: 'Tender Close',
    time: '',
    name: '',
    icon: 'ki-duotone ki-file-deleted',
    active: false,
  },
])

watch(
  () => props.activeName,

  (newActiveName) => {
    if (!steps.value || steps.value.length === 0) {
      return
    }

    steps.value.forEach((step) => {
      step.active = false
    })

    const getIndex = steps.value.findIndex(
      (item) =>
        item.label.toLowerCase().replace(/ /g, '') ===
        newActiveName.toLowerCase().replace(/ /g, ''),
    )

    if (getIndex !== -1) {
      for (let index = 0; index <= getIndex; index++) {
        steps.value[index].active = true
      }
    }
  },
  {
    immediate: true,
  },
)
</script>
