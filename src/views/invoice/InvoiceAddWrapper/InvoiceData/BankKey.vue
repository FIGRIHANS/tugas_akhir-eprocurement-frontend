<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-bank text-gray-600 text-xl"></i>
      <span class="font-medium">Payment Information</span>
    </div>
    <div v-if="form" class="py-[8px] px-[16px]">
      <div class="py-[8px] px-[16px]">
        <label class="form-label flex items-center gap-2.5">
          <input v-model="form.isNotRegisteredBank" class="checkbox" name="check" type="checkbox" :disabled="form.status !== 0"/>
          Bank Key Not Registered
        </label>
      </div>
      <div v-if="!form.isNotRegisteredBank">
        <!-- Bank Key -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Key
          </label>
          <input v-if="form.status !== 0" v-model="form.bankKeyId" class="input" placeholder="" disabled />
          <select v-else v-model="form.bankKeyId" class="select" :class="{ 'border-danger': form.bankKeyIdError }">
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
          <input v-model="form.bankNameId" class="input" placeholder="" disabled/>
        </div>
        <!-- Beneficiary Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Beneficiary Name
          </label>
          <input v-model="form.beneficiaryName" class="input" placeholder="" disabled/>
        </div>
        <!-- Bank Account Number -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Account Number
          </label>
          <input v-model="form.bankAccountNumber" class="input" placeholder="" disabled/>
        </div>
        <!-- SWIFT Code -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            SWIFT Code
          </label>
          <input v-model="form.swiftCode" class="input" placeholder="" disabled/>
        </div>
        <!-- Bank Address -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Address
          </label>
          <textarea v-model="form.bankAddress" class="textarea" placeholder="" rows="6" disabled></textarea>
        </div>
      </div>
      <div v-else>
        <!-- Account Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Account Name
          </label>
          <input v-model="form.accountName" class="input" placeholder=""/>
        </div>
        <!-- No. NPWP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No. NPWP
          </label>
          <input v-model="form.npwpNumber" class="input" placeholder=""/>
        </div>
        <!-- Bank Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Name
          </label>
          <input v-model="form.bankNameNew" class="input" placeholder=""/>
        </div>
        <!-- No. Rekening -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            No. Rekening
          </label>
          <input v-model="form.bankAccountNumberNew" class="input" placeholder=""/>
        </div>
        <!-- Bank Address -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Address
          </label>
          <textarea v-model="form.bankAddressNew" class="textarea" placeholder="" rows="6"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>
