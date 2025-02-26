<template>
  <div
    :class="[
      'relative',
      {
        'grid grid-cols-2 gap-6 items-center': labelStyle === 'row',
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
    <label v-else-if="label && labelStyle !== 'default'" class="text-gray-800">
      {{ label }}
    </label>
    <input
      v-model="model"
      class="input"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      type="text"
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
  labelStyle: 'default',
})

const model = defineModel()
</script>
