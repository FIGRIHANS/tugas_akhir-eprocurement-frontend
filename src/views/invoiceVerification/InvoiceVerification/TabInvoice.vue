<template>
  <div class="tabs mb-5 text-gray-500">
    <button class="tab pl-[4px]" :class="activeTab === 'pending' ? 'active' : ''" @click="setTab('pending')">
      Pending Verification
    </button>
    <button class="tab pl-[4px]" :class="activeTab === 'verification' ? 'active' : ''" @click="setTab('verification')">
      Verification History
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  activeTab: string
}>()

const emits = defineEmits(['changeTab'])

const setTab = (value: string) => {
  emits('changeTab', value)
}
</script>
