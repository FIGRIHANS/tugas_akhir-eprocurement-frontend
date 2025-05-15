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
    </label>
    <label
      v-else-if="label && row"
      class="form-label w-2/5"
      :class="{ 'flex items-center gap-1': required }"
    >
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <input
      v-model="model"
      class="input"
      :class="{ 'border-danger': error }"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :type="type"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineModel } from 'vue'
import type { IInputProps } from './types/input'

withDefaults(defineProps<IInputProps>(), {
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
