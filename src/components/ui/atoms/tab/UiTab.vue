<template>
  <div class="tabs mb-5">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      :class="[itemClasees(item), itemClass]"
      @click="onItemClick(item)"
    >
      <span v-if="numbering" class="tab__numbering">
        {{ index + 1 }}
      </span>

      {{ item.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { ITabProps, ITabItem } from './types/tab'

const props = withDefaults(defineProps<ITabProps>(), {
  itemClass: '',
  numbering: false,
})

const itemClasees = (item: ITabItem) => {
  return [
    'tab',
    item.itemClass,
    {
      active: item.value === props.modelValue,
      disabled: item.disabled,
    },
  ]
}

const onItemClick = (item: ITabItem) => {
  if (item.disabled) return
  emits('update:modelValue', item.value)
}

const emits = defineEmits(['update:modelValue', 'update:items'])
</script>

<style lang="scss" scoped>
@use './styles/tab.scss';
</style>
