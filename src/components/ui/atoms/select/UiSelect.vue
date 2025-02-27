<template>
  <div
    :class="[
      'relative',
      {
        'flex flex-col gap-2': labelStyle === 'column',
        'flex flex-row gap-6 items-center': labelStyle === 'row',
        'items-start': labelStyle === 'row' && rowAlign === 'start',
      },
    ]"
  >
    <label
      v-if="label && labelStyle === 'default'"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
    >
      {{ label }}
    </label>
    <label v-else-if="label && labelStyle != 'default'" class="text-gray-800 w-2/5">
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
  labelStyle: 'default',
})

const model = defineModel({ default: '' })
</script>
