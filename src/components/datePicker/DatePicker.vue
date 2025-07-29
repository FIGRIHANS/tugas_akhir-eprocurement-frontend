<template>
  <div
    :class="[
      'relative',
      {
        'min-w-[0px] w-full flex items-center flex-wrap lg:flex-nowrap gap-2.5': !labelTop,
      },
    ]"
  >
    <label
      :class="{
        'text-[11px] px-[3px] text-gray-500 bg-white absolute z-50 -top-[6px] left-[7px] leading-[12px]':
          label && labelTop,
        'form-label flex items-center gap-1 w-2/5': label && !labelTop,
      }"
    >
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <VueDatePicker
      v-model="date"
      :enable-time="false"
      :format="format"
      :preview-format="format"
      :min-date="minDate"
      class="w-full"
    >
      <template #dp-input="{ value }">
        <div class="input relative" :class="{ 'border-danger': error }">
          <input
            placeholder="Select"
            :value="value"
            readonly
            class="min-w-[0px]"
            :disabled="disabled"
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
  modelValue: Date | string | null
  error?: boolean
  label?: string
  required?: boolean
  placeholder?: string
  format?: string
  disabled?: boolean
  minDate?: Date | string
  labelTop?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const date = ref<Date | string | null>('')

watch(
  () => props.modelValue,
  () => {
    date.value = props.modelValue
  },
  {
    immediate: true,
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
