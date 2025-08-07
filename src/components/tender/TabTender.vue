<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'purchase' ? 'active' : ''">
      Purchase Requisition List
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'vendor' ? 'active' : ''">
      Vendor List
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'admin' ? 'active' : ''">
      Administrative Document
    </button>
    <i class="ki-duotone ki-right"></i>
    <button class="tab pl-[4px] cursor-default" :class="activeTab === 'timeline' ? 'active' : ''">
      Tender Timeline
    </button>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */

defineProps<{
  activeTab: string
}>()
</script>
