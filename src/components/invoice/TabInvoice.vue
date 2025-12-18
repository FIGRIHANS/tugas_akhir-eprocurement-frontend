<template>
  <div class="tabs mb-5 text-gray-500 bg-gray-200">
    <button class="tab pl-[4px]" :class="[activeTab === 'data' ? 'active' : '']" :disabled="!canClickData"
      @click="activeTab = 'data'">
      Invoice Data
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'information' ? 'active' : '']" :disabled="!canClickInformation"
      @click="activeTab = 'information'">
      Invoice Information
    </button>

    <i class="ki-duotone ki-right"></i>

    <button class="tab pl-[4px]" :class="[activeTab === 'ocrAiVerification' ? 'active' : '']"
      @click="activeTab = 'ocrAiVerification'">
      Invoice OCR & AI Verification
    </button>

    <i v-if="withPreview" class="ki-duotone ki-right"></i>

    <button v-if="withPreview" class="tab pl-[4px]" :class="[activeTab === 'preview' ? 'active' : '']"
      :disabled="!canClickPreview" @click="activeTab = 'preview'">
      Invoice Preview
    </button>

    <i v-if="canClickPaymentStatus" class="ki-duotone ki-right"></i>

    <button v-if="canClickPaymentStatus" class="tab pl-[4px]" :class="[activeTab === 'paymentStatus' ? 'active' : '']"
      :disabled="!canClickPaymentStatus" @click="activeTab = 'paymentStatus'">
      Payment Status
    </button>
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
