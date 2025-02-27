<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px]" :class="activeTab === 'data' ? 'active' : ''" @click="setTab('data')">
      Invoice Data
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px]" :class="activeTab === 'information' ? 'active' : ''" @click="setTab('information')">
      Invoice Information
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px]" :class="activeTab === 'preview' ? 'active' : ''" @click="setTab('preview')">
      Invoice Preview
    </button>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */

defineProps<{
  activeTab: string
}>()

const emits = defineEmits(['changeTab'])

const setTab = (value: string) => {
  emits('changeTab', value)
}
</script>
