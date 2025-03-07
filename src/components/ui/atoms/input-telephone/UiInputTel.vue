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
    <div class="input-group w-full" :class="{ 'border-danger': error }">
      <select
        v-model="countryCode"
        class="select rounded-r-none w-1/4"
        :readonly="readonly"
        :disabled="disabled"
      >
        <option selected disabled hidden value="">kode</option>
        <option v-for="option in options" :key="option[valueKey]" :value="option[valueKey]">
          {{ option[textKey] }}
        </option>
      </select>
      <input
        v-model="noTel"
        class="input border-l-0 rounded-l-none"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        type="number"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineModel, ref, watch } from 'vue'
import type { IInputTelProps } from './types/input-tel'

withDefaults(defineProps<IInputTelProps>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  row: false,
  required: false,
  error: false,
  valueKey: 'value',
  textKey: 'text',
})

const countryCode = ref('')
const noTel = ref('')

const model = defineModel()

watch([countryCode, noTel], () => {
  model.value = countryCode.value + noTel.value
})
</script>
