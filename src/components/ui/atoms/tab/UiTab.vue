<template>
  <div class="tabs mb-5">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      :class="[itemClasees(item, index), itemClass]"
      @click="onItemClick(item)"
    >
      <template v-if="numbering">
        <div class="tab__numbering">
          {{ index + 1 }}
        </div>
      </template>

      {{ item.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ITabProps, ITabItem } from './types/tab'

const props = withDefaults(defineProps<ITabProps>(), {
  itemClass: '',
  numbering: false,
})

const position = computed(() => {
  return props.items.findIndex((item) => item.value === props.modelValue)
})

const itemClasees = (item: ITabItem, tabIndex: number) => {
  return [
    'tab',
    item.itemClass,
    {
      active: item.value === props.modelValue,
      disabled: item.disabled,
      visited: isVisited(tabIndex),
    },
  ]
}

const isVisited = (tabIndex: number) => {
  return props.step && tabIndex < position.value
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
