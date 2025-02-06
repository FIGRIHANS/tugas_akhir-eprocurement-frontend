<template>
  <label class="form-label flex items-center gap-2.5">
    <input class="checkbox" name="check" type="checkbox" value="1"/>
    {{ label }}
  </label>
</template>

<script lang="ts" setup>
import type { ICheckboxProps } from './types/checkbox'
defineProps<ICheckboxProps>()
</script>
