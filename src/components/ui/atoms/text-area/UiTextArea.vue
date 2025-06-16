<template>
  <div class="relative w-full">
    <label
      class="absolute -top-[10px] left-3 text-gray-500 text-sm bg-white px-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      v-model="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{
        'border-danger': error,
        'border-gray-300': !error
      }"
      class="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  required?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const textValue = ref<string>('')

watch(
  () => props.modelValue,
  () => {
    textValue.value = props.modelValue
  },
  {
    immediate: true
  }
)

watch(
  () => textValue.value,
  () => {
    emits('update:modelValue', textValue.value)
  }
)
</script>
