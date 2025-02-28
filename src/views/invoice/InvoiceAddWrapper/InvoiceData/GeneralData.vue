<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div v-if="form" class="py-[8px] px-[16px]">
      <!-- Select Company -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Select Company
        </label>
        <select v-model="form.companyId" class="select" :class="{ 'border-danger': form.companyIdError }">
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
      <!-- Select Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Select Vendor
        </label>
        <select v-model="form.vendorId" class="select" :class="{ 'border-danger': form.vendorIdError }">
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
      <!-- Bill To Company -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bill To Company
        </label>
        <input v-model="form.billToCompany" class="input" placeholder="" :class="{ 'border-danger': form.billToCompanyError }"/>
      </div>
      <!-- Bill To Vendor -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Bill To Vendor
        </label>
        <input v-model="form.billToVendor" class="input" placeholder="" :class="{ 'border-danger': form.billToVendorError }"/>
      </div>
      <!-- Vendor Tax ID -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Tax ID
        </label>
        <input v-model="form.vendorTaxId" class="input" placeholder="" :class="{ 'border-danger': form.vendorTaxIdError }"/>
      </div>
      <!-- Address -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Address
        </label>
        <textarea v-model="form.address" class="textarea" placeholder="" rows="6" :class="{ 'border-danger': form.addressError }"></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>
