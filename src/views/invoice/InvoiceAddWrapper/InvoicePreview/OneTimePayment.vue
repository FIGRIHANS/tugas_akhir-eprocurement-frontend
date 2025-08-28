<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <p class="text-lg font-semibold m-[0px]">One Time Payment</p>
    <div class="flex">
      <div class="flex-1 flex flex-col gap-[20px]">
        <div>
          <p class="text-xs font-normal text-gray-700">Type</p>
          <p v-if="form.isAlternativePayee" class="text-sm font-medium flex align-items-center gap-[8px]">
            <i class="ki-solid ki-check-circle text-success text-base"></i>
            <span class="h-fit">Alternative Payee</span>
          </p>
          <p v-if="form.isOneTimeVendor" class="text-sm font-medium flex align-items-center gap-[8px]">
            <i class="ki-solid ki-check-circle text-success text-base"></i>
            <span class="h-fit">One Time Vendor</span>
          </p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Name</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.nameAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Name 2</p>
          <p class="text-sm font-medium">{{ form.nameOtherAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Street</p>
          <p class="text-sm font-medium">{{ form.streetAltiernative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">City</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.cityAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Country</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.countryAlternative || '-' }}</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-[20px]">
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Account Number</p>
          <p class="text-sm font-medium">{{ form.bankAccountNumberAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Key</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.bankKeyAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Country</p>
          <p class="text-sm font-medium">{{ form.bankCountryAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">No. NPWP</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.npwpNumberAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">No. KTP</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.ktpNumberAlternative || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Email</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ form.emailAlternative || '-' }}</p>
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