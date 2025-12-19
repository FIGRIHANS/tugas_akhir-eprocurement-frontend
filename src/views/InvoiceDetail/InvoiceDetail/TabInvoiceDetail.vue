<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button
      class="tab pl-[4px]"
      :class="[activeTab === 'data' ? 'active' : '']"
      @click="activeTab = 'data'"
    >
      Invoice Data
    </button>

    <i v-if="showPaymentStatus" class="ki-duotone ki-right"></i>

    <button
      v-if="showPaymentStatus"
      class="tab pl-[4px]"
      :class="[activeTab === 'paymentStatus' ? 'active' : '']"
      @click="activeTab = 'paymentStatus'"
    >
      Payment Status
    </button>
  </div>
</template>

<script lang="ts" setup>
const activeTab = defineModel<string>('activeTab')

withDefaults(
  defineProps<{
    showPaymentStatus?: boolean
  }>(),
  {
    showPaymentStatus: false,
  },
)
</script>
