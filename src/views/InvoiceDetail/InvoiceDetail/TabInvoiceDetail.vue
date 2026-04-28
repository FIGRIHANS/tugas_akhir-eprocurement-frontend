<template>
  <div class="card-header py-[8px] px-[20px]">
    <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
      <button
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'data' }"
        @click="activeTab = 'data'"
      >
        Invoice Data
      </button>

      <button
        v-if="showPaymentStatus"
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'paymentStatus' }"
        @click="activeTab = 'paymentStatus'"
      >
        Payment Status
      </button>
    </div>
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
