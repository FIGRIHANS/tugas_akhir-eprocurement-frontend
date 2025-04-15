<template>
  <div class="relative">
    <label
      v-if="label"
      class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]"
    >
      {{ label }}
    </label>

    <select class="select" name="select" :readonly="readonly" :disabled="disabled" v-model="model">
      <option value="">
        {{ placeholder }}
      </option>
      <slot></slot>
    </select>
  </div>
</template>

<script lang="ts" setup>
import type { ISelectProps } from './types/select'

const model = defineModel()
withDefaults(defineProps<ISelectProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
})
</script>
