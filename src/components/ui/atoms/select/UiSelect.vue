<template>
  <div
    :class="[
      'relative',
      {
        'flex items-baseline flex-wrap lg:flex-nowrap gap-2.5': row,
      },
    ]"
  >
    <label
      v-if="label && !row"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
    >
      {{ label }}
    </label>
    <label v-else-if="label && row" class="form-label max-w-32">
      {{ label }}
    </label>

    <select v-model="model" class="select" :readonly="readonly" :disabled="disabled">
      <option selected disabled hidden value="">
        {{ placeholder }}
      </option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineModel } from 'vue'
import type { ISelectProps } from './types/select'

withDefaults(defineProps<ISelectProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  row: false,
})

const model = defineModel({ default: '' })
</script>
