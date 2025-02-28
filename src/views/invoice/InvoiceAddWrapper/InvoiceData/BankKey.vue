<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-bank text-gray-600 text-xl"></i>
      <span class="font-medium">Payment Information</span>
    </div>
    <div v-if="form" class="py-[8px] px-[16px]">
      <!-- Bank Key -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bank Key
        </label>
        <select v-model="form.bankKeyId" class="select" :class="{ 'border-danger': form.bankKeyIdError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Bank Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bank Name
        </label>
        <select v-model="form.bankNameId" class="select" :class="{ 'border-danger': form.bankNameIdError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Beneficiary Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Beneficiary Name
        </label>
        <input v-model="form.beneficiaryName" class="input" placeholder="" :class="{ 'border-danger': form.beneficiaryNameError }"/>
      </div>
      <!-- Bank Account Number -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bank Account Number
        </label>
        <input v-model="form.bankAccountNumber" class="input" placeholder="" :class="{ 'border-danger': form.bankAccountNumberError }"/>
      </div>
      <!-- SWIFT Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          SWIFT Code
        </label>
        <input v-model="form.swiftCode" class="input" placeholder="" :class="{ 'border-danger': form.swiftCodeError }"/>
      </div>
      <!-- Bank Address -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bank Address
        </label>
        <textarea v-model="form.bankAddress" class="textarea" placeholder="" rows="6" :class="{ 'border-danger': form.bankAddressError }"></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>
