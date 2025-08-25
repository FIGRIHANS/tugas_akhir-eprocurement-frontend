<template>
  <div
    :class="[
      'relative',
      {
        'flex items-center flex-wrap lg:flex-nowrap gap-2.5': row,
      },
    ]"
  >
    <label
      v-if="label && !row"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
    >
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <div v-else-if="label && row" class="form-label w-2/5">
      <label class="" :class="{ 'flex items-center gap-1': required }">
        {{ label }}
        <span v-if="required" class="text-danger"> * </span>
      </label>
    </div>
    <div class="flex flex-col w-full gap-1">
      <textarea
        v-model="model"
        class="input h-[150px] px-3 py-4"
        :class="{ 'border-danger': error }"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :maxlength="maxLength"
      ></textarea>
      <span v-if="hintText" class="form-hint !text-danger">{{ hintText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineModel } from 'vue'
// import type { IInputProps } from './types/input'

interface ITextAreaProps {
  label?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  row?: boolean
  required?: boolean
  error?: boolean
  maxLength?: number | string
  hintText?: string
}

withDefaults(defineProps<ITextAreaProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  row: false,
  required: false,
  error: false,
  type: 'text',
})

const model = defineModel()
</script>
