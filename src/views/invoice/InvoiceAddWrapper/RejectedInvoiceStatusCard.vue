<template>
  <div v-if="form && isRejected" class="rejected-invoice-card mb-[16px]">
    <div class="rejected-invoice-card__box">
      <div class="rejected-invoice-card__header">
        <div class="rejected-invoice-card__left">
          <i class="ki-duotone ki-shield-cross text-danger rejected-invoice-card__icon shrink-0"></i>
          <div class="rejected-invoice-card__text">
            <p class="text-[15px] font-semibold text-gray-900 leading-tight">Invoice Rejected</p>
            <p class="text-[13px] font-medium text-danger leading-tight mt-[2px]">
              Invoice ini ditolak dan dikembalikan ke submitter.
            </p>
          </div>
        </div>
        <span class="badge badge-danger badge-outline shrink-0 rejected-invoice-card__badge">Rejected</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { formTypes } from '../types/invoiceAddWrapper'
import { isRejectedInvoiceStatus } from '@/core/utils/invoiceSubmissionRoute'

const form = inject<formTypes>('form')
const isRejected = computed(() => isRejectedInvoiceStatus(form?.status))
</script>

<style lang="scss" scoped>
.rejected-invoice-card {
  width: fit-content;
  max-width: 100%;

  &__box {
    position: relative;
    border: 1px solid #f8285a;
    border-radius: 12px;
    background-color: #ffeef3;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 960px 14px 16px;
  }

  &__left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__icon {
    font-size: 18px;
    line-height: 1.25;
    margin-top: 0;
  }

  &__text {
    text-align: left;
  }

  &__badge {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
