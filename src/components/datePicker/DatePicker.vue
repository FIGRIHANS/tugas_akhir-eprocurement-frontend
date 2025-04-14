<template>
  <div class="min-w-[0px] w-full">
    <VueDatePicker v-model="date" class="w-full">
      <template #dp-input="{ value }">
        <div class="input relative">
          <div class="absolute top-0 left-0 -mt-2 ml-2 bg-white px-1 text-gray-500">
            {{ label ?? 'Date' }}
          </div>
          <input
            :placeholder="placeholder ?? 'Select'"
            :value="value"
            readonly
            class="min-w-[0px]"
            :class="{ 'border-danger': error }"
          />
          <button class="btn btn-icon">
            <i class="ki-filled ki-calendar"></i>
          </button>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  error?: boolean
  label?: string
  placeholder?: string
}>()

const emits = defineEmits(['update:modelValue'])

const date = ref<string>('')

watch(
  () => props.modelValue,
  () => {
    date.value = props.modelValue
  },
)

watch(
  () => date.value,
  () => {
    emits('update:modelValue', date.value)
  },
)
</script>

<style lang="scss" scoped>
@use './styles/datepicker.scss';
</style>
