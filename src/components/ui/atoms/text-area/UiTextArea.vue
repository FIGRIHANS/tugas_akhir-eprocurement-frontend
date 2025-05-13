<template>
  <div class="relative w-full">
    <label
      class="absolute -top-[10px] left-3 text-gray-500 text-sm bg-white px-1"
    >
      {{ label }}
    </label>
    <textarea
      v-model="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ 'border-danger': error }"
      class="w-full h-32 p-3 pt-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
