<template>
  <div class="tabs mb-5 text-gray-500">
    <button class="tab pl-[4px]" :class="activeTab === 'pending' ? 'active' : ''" @click="setTab('pending')">
      Pending Approval
    </button>
    <button class="tab pl-[4px]" :class="activeTab === 'approval' ? 'active' : ''" @click="setTab('approval')">
      Approval History
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
