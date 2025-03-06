<template>
  <div class="min-w-[0px] w-full flex items-center flex-wrap lg:flex-nowrap gap-2.5">
    <label class="form-label flex items-center gap-1 w-2/5">
      {{ label }}
      <span v-if="required" class="text-danger"> * </span>
    </label>
    <VueDatePicker v-model="date" :format="format" :preview-format="format" class="w-full">
      <template #dp-input="{ value }">
        <div class="input relative" :class="{ 'border-danger': error }">
          <input :placeholder="placeholder" :value="value" readonly class="min-w-[0px]" />
          <button class="btn btn-icon">
            <i class="ki-filled ki-calendar"></i>
          </button>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  error?: boolean
  label?: string
  required?: boolean
  placeholder?: string
  format?: string
}>()

const emits = defineEmits(['update:modelValue'])

const date = ref<string>('')

watch(
  () => props.modelValue,
  () => {
    date.value = props.modelValue
  },
)

watch(
  () => date.value,
  () => {
    emits('update:modelValue', date.value)
  },
)
</script>

<style lang="scss" scoped>
@use './styles/datepicker.scss';
</style>
