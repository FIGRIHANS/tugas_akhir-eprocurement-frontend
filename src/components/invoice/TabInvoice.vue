<template>
  <div class="card-header py-[8px] px-[20px]">
    <div class="border rounded-lg border-gray-300 p-[4px] flex items-center gap-[4px]">
      <button
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'data' }"
        :disabled="!canClickData"
        @click="activeTab = 'data'"
      >
        Invoice Data
      </button>

      <button
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'information' }"
        :disabled="!canClickInformation"
        @click="activeTab = 'information'"
      >
        Invoice Information
      </button>

      <button
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'ocrAiVerification' }"
        @click="activeTab = 'ocrAiVerification'"
      >
        Invoice OCR & AI Verification
      </button>

      <button
        v-if="withPreview"
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'preview' }"
        :disabled="!canClickPreview"
        @click="activeTab = 'preview'"
      >
        Invoice Preview
      </button>

      <button
        v-if="canClickPaymentStatus"
        class="btn btn-primary"
        :class="{ 'btn-clear info__header': activeTab !== 'paymentStatus' }"
        :disabled="!canClickPaymentStatus"
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
    withPreview?: boolean
    canClickData?: boolean
    canClickInformation?: boolean
    canClickPreview?: boolean
    canClickPaymentStatus?: boolean
  }>(),
  {
    withPreview: true,
    canClickData: true,
    canClickInformation: false,
    canClickPreview: false,
    canClickPaymentStatus: false,
  },
)
</script>
