<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'data' ? 'active' : ''">
      Invoice Data
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'information' ? 'active' : ''">
      Invoice Information
    </button>
    <i v-if="withPreview" class="ki-duotone ki-right"></i>
    <button v-if="withPreview" class="tab pl-[4px] cursor-default" :class="activeTab === 'preview' ? 'active' : ''">
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
</script>
