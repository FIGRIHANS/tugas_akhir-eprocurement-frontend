<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px]" :class="activeTab === 'data' ? 'active' : ''" @click="setTab('data')">
      Invoice Data
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px]" :class="activeTab === 'information' ? 'active' : ''" @click="setTab('information')">
      Invoice Information
    </button>
    <i v-if="withPreview" class="ki-duotone ki-right"></i>
    <button v-if="withPreview" class="tab pl-[4px]" :class="activeTab === 'preview' ? 'active' : ''" @click="setTab('preview')">
      Invoice Preview
    </button>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */

withDefaults(
  defineProps<{
    activeTab: string
    withPreview?: boolean
  }>(),
  {
    withPreview: true
  }
)

const emits = defineEmits(['changeTab'])

const setTab = (value: string) => {
  emits('changeTab', value)
}
</script>
