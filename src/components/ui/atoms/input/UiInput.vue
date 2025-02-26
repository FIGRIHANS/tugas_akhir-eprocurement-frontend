<template>
  <div class="relative">
    <label v-if="label" class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]">
      {{ label }}
    </label>
    <input class="input" :placeholder="placeholder" :readonly="readonly" :disabled="disabled" type="text" value=""/>
  </div>
</template>

<script lang="ts" setup>
import type { IInputProps } from './types/input'

withDefaults(defineProps<IInputProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
})
</script>
