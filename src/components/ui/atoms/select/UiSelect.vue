<template>
  <div class="relative">
    <label v-if="label" class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]">
      {{ label }}
    </label>

    <select class="select" name="select" :readonly="readonly" :disabled="disabled">
      <option selected disabled hidden>
        {{ placeholder }}
      </option>
      <option value="1">
        Option 1
      </option>
      <option value="2">
        Option 2
      </option>
      <option value="3">
        Option 3
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import type { ISelectProps } from './types/select'

withDefaults(defineProps<ISelectProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
})
</script>
