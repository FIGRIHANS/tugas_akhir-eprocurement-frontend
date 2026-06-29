<template>
  <nav
    v-if="visibleTabs.length > 0"
    class="invoice-tab-map my-[16px] flex flex-wrap items-center gap-x-3 gap-y-1 bg-gray-200 px-[20px] py-[12px]"
    aria-label="Invoice workflow tabs"
  >
    <template v-for="(tab, index) in visibleTabs" :key="tab.key">
      <i
        v-if="index > 0"
        class="ki-outline ki-right invoice-tab-map__chevron shrink-0"
        aria-hidden="true"
      ></i>

      <button
        type="button"
        class="invoice-tab-map__item"
        :class="{
          'invoice-tab-map__item--active': activeTab === tab.key,
          'invoice-tab-map__item--disabled': tab.disabled,
        }"
        :disabled="tab.disabled"
        :aria-current="activeTab === tab.key ? 'step' : undefined"
        @click="selectTab(tab)"
      >
        {{ tab.label }}
      </button>
    </template>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface TabItem {
  key: string
  label: string
  disabled: boolean
}

const activeTab = defineModel<string>('activeTab')

const props = withDefaults(
  defineProps<{
    withPreview?: boolean
    hideWorkflowTabs?: boolean
    showOcrAiVerification?: boolean
    canClickData?: boolean
    canClickOcrAiVerification?: boolean
    canClickInformation?: boolean
    canClickPreview?: boolean
    canClickPaymentStatus?: boolean
  }>(),
  {
    withPreview: true,
    hideWorkflowTabs: false,
    showOcrAiVerification: false,
    canClickData: true,
    canClickOcrAiVerification: false,
    canClickInformation: false,
    canClickPreview: false,
    canClickPaymentStatus: false,
  },
)

const visibleTabs = computed<TabItem[]>(() => {
  const tabs: TabItem[] = []

  if (!props.hideWorkflowTabs) {
    tabs.push({
      key: 'data',
      label: 'Invoice Data',
      disabled: !props.canClickData,
    })
    if (props.showOcrAiVerification) {
      tabs.push({
        key: 'ocrAiVerification',
        label: 'Invoice OCR & AI Verification',
        disabled: !props.canClickOcrAiVerification,
      })
    }
    tabs.push({
      key: 'information',
      label: 'Invoice Information',
      disabled: !props.canClickInformation,
    })
    if (props.withPreview) {
      tabs.push({
        key: 'preview',
        label: 'Invoice Preview',
        disabled: !props.canClickPreview,
      })
    }
  }

  if (props.canClickPaymentStatus) {
    tabs.push({
      key: 'paymentStatus',
      label: 'Payment Status',
      disabled: false,
    })
  }

  return tabs
})

const selectTab = (tab: TabItem) => {
  if (tab.disabled) return
  activeTab.value = tab.key
}
</script>

<style lang="scss" scoped>
.invoice-tab-map {
  &__chevron {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1;
  }

  &__item {
    position: relative;
    padding: 4px 2px 8px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.25;
    color: #94a3b8;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s ease;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      border-radius: 1px;
      background-color: transparent;
      transition: background-color 0.15s ease;
    }

    &:not(&--disabled):not(&--active):hover {
      color: #64748b;
    }

    &--active {
      color: var(--tw-primary, #1b84ff);

      &::after {
        background-color: var(--tw-primary, #1b84ff);
      }
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }
}
</style>
