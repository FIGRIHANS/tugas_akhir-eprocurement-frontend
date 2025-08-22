<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'header' ? 'active' : ''">
      Header Information
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'material' ? 'active' : ''">
      Material & Services
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'document' ? 'active' : ''">
      Document Information
    </button>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */

defineProps<{
  activeTab: string
}>()
</script>
