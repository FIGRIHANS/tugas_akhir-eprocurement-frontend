<template>
  <label class="form-label flex items-center gap-2.5">
    <input v-model="model" class="checkbox" type="checkbox" :disabled="disabled" />
    {{ label }}
  </label>
</template>

<script lang="ts" setup>
import { defineModel } from 'vue'
import type { ICheckboxProps } from './types/checkbox'
defineProps<ICheckboxProps>()

const model = defineModel()
</script>
