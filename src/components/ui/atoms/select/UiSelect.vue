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

    <select v-model="model" class="select" :readonly="readonly" :disabled="disabled">
      <option selected disabled hidden :value="typeof model === 'number' ? 0 : ''">
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option[valueKey]" :value="option[valueKey]">
        {{ option[textKey] }}
      </option>
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
  valueKey: 'value',
  textKey: 'text',
})

const model = defineModel<string | number>({ default: '' })
</script>
