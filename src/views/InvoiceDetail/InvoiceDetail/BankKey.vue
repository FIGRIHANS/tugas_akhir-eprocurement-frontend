<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Payment Information</h3>
      <input v-if="form.status === 2" v-model="form.bankKeyCheck" class="checkbox" type="checkbox"/>
    </div>
    <div class="card-body">
      <label class="form-label flex items-center gap-2.5 mb-[20px]">
        <input v-model="form.isNotRegisteredBank" class="checkbox" name="check" type="checkbox" disabled/>
        Bank Key Not Registered
      </label>
      <div v-if="!form.isNotRegisteredBank" class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Key</p>
          <p class="font-normal text-sm">{{ form.bankKeyId }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Name</p>
          <p class="font-normal text-sm">{{ form.bankNameId }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Beneficiary Name</p>
          <p class="font-normal text-sm">{{ form.beneficiaryName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
          <p class="font-normal text-sm">{{ form.bankAccountNumber }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">SWIFT Code</p>
          <p class="font-normal text-sm">{{ form.swiftCode }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Address</p>
          <p class="font-normal text-sm">{{ form.bankAddress }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Account Name</p>
          <p class="font-normal text-sm">{{ form.accountName || '-' }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">No. NPWP</p>
          <p class="font-normal text-sm">{{ form.npwpNumber || '-' }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Name</p>
          <p class="font-normal text-sm">{{ form.bankNameNew || '-' }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">No. Rekening</p>
          <p class="font-normal text-sm">{{ form.bankAccountNumberNew || '-' }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Address</p>
          <p class="font-normal text-sm">{{ form.bankAddressNew || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')
</script>
