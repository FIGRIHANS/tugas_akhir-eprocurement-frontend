<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button
      class="tab pl-[4px]"
      :class="[
        activeTab === 'data' ? 'active' : '',
        canClickData ? 'cursor-pointer' : 'cursor-default'
      ]"
      :disabled="!canClickData"
      @click="canClickData && handleTabClick('data')"
    >
      Invoice Data
    </button>
    <i class="ki-duotone ki-right"></i>
    <button
      class="tab pl-[4px]"
      :class="[
        activeTab === 'information' ? 'active' : '',
        canClickInformation ? 'cursor-pointer' : 'cursor-default opacity-50'
      ]"
      :disabled="!canClickInformation"
      @click="canClickInformation && handleTabClick('information')"
    >
      Invoice Information
    </button>
    <i v-if="withPreview" class="ki-duotone ki-right"></i>
    <button
      v-if="withPreview"
      class="tab pl-[4px]"
      :class="[
        activeTab === 'preview' ? 'active' : '',
        canClickPreview ? 'cursor-pointer' : 'cursor-default opacity-50'
      ]"
      :disabled="!canClickPreview"
      @click="canClickPreview && handleTabClick('preview')"
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

const emit = defineEmits<{
  (e: 'change-tab', tab: string): void
}>()

const handleTabClick = (tab: string) => {
  emit('change-tab', tab)
}
</script>
