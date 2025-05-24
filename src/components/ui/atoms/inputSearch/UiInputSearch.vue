<template>
  <div>
    <div class="input">
      <i class="ki-outline ki-magnifier"></i>
      <input v-model="search" :placeholder="placeholder" @keypress="(event) => emits('keypress', event)"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emits = defineEmits(['update:modelValue', 'keypress'])

const search = ref<string>('')

watch(
  () => props.modelValue,
  () => {
    search.value = props.modelValue
  },
  {
    immediate: true
  }
)

watch(
  () => search.value,
  () => {
    emits('update:modelValue', search.value)
  }
)
</script>
