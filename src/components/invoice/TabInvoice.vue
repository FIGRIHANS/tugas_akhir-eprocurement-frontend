<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button
      class="tab pl-[4px]"
      :class="[
        activeTab === 'data' ? 'active' : ''
      ]"
      disabled
    >
      Invoice Data
    </button>
    <i class="ki-duotone ki-right"></i>
    <button
      class="tab pl-[4px]"
      :class="[
        activeTab === 'information' ? 'active' : ''
      ]"
      disabled
    >
      Invoice Information
    </button>
    <i v-if="withPreview" class="ki-duotone ki-right"></i>
    <button
      v-if="withPreview"
      class="tab pl-[4px]"
      :class="[
        activeTab === 'preview' ? 'active' : ''
      ]"
      disabled
    >
      Invoice Preview
    </button>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    activeTab: string
    withPreview?: boolean
    canClickData?: boolean
    canClickInformation?: boolean
    canClickPreview?: boolean
  }>(),
  {
    withPreview: true,
    canClickData: true,
    canClickInformation: false,
    canClickPreview: false
  }
)
</script>
