<template>
  <div v-if="form && isRejected" class="rejected-invoice-card mb-[16px]">
    <div class="rejected-invoice-card__box">
      <div class="rejected-invoice-card__header">
        <div class="rejected-invoice-card__left">
          <i class="ki-duotone ki-shield-cross text-danger rejected-invoice-card__icon shrink-0"></i>
          <div class="rejected-invoice-card__text">
            <p class="text-[15px] font-semibold text-gray-900 leading-tight">Invoice Rejected</p>
            <p
              class="text-[13px] font-medium text-danger leading-snug mt-[2px] rejected-invoice-card__message"
            >
              {{ rejectionMessage }}
            </p>
            <button
              v-if="canJumpToTarget"
              type="button"
              class="rejected-invoice-card__location-link"
              @click="jumpToTarget"
            >
              Buka Lokasi
            </button>
          </div>
        </div>
        <span class="badge badge-danger badge-outline shrink-0 rejected-invoice-card__badge"
          >Rejected</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import { isRejectedInvoiceStatus } from '@/core/utils/invoiceSubmissionRoute'

const form = inject<formTypes>('form')
const openRejectedInvoiceTarget = inject<(() => Promise<void>) | undefined>(
  'openRejectedInvoiceTarget',
)

const isRejected = computed(() => isRejectedInvoiceStatus(form?.status))
const rejectReason = computed(() => form?.statusNotes?.trim().replace(/\s+/g, ' ') || '')
const canJumpToTarget = computed(() => Boolean(form?.rejectTarget?.page))

const rejectionMessage = computed(() => {
  const base = 'Invoice ini ditolak dan dikembalikan ke submitter.'
  return rejectReason.value ? `${base} Karena ${rejectReason.value}` : base
})

const jumpToTarget = async () => {
  await openRejectedInvoiceTarget?.()
}
</script>

<style lang="scss" scoped>
.rejected-invoice-card {
  width: 100%;
  max-width: 100%;

  &__box {
    border: 1px solid #f8285a;
    border-radius: 12px;
    background-color: #ffeef3;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    flex: 1;
  }

  &__icon {
    font-size: 32px;
    line-height: 1;
  }

  &__text {
    text-align: left;
    min-width: 0;
    flex: 1;
  }

  &__message {
    margin: 0;
  }

  &__location-link {
    display: inline-block;
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #f8285a;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &__location-link:hover {
    opacity: 0.85;
  }

  &__badge {
    flex-shrink: 0;
  }
}
</style>
