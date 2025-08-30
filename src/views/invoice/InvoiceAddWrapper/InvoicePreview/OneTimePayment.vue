<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <p class="text-lg font-semibold m-[0px]">One Time Payment</p>
    <div class="flex">
      <div class="flex-1 flex flex-col gap-[20px]">
        <div>
          <p class="text-xs font-normal text-gray-700">Type</p>
          <div class="flex flex-col gap-2 mt-4">
            <p class="text-sm font-medium flex align-items-center gap-[8px]">
              <i
                v-if="data.isAlternativePayee"
                class="ki-solid ki-check-circle text-success text-base"
              ></i>
              <span class="h-fit">Alternative Payee</span>
            </p>
            <p class="text-sm font-medium flex align-items-center gap-[8px]">
              <i
                v-if="data.isOneTimeVendor"
                class="ki-solid ki-check-circle text-success text-base"
              ></i>
              <span class="h-fit">One Time Vendor</span>
            </p>
          </div>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Name</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ data.name || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Name 2</p>
          <p class="text-sm font-medium">{{ data.name2 || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Street</p>
          <p class="text-sm font-medium">{{ data.street || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">City</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ data.city || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Country</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ data.country || '-' }}</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-[20px]">
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Account Number</p>
          <p class="text-sm font-medium">{{ data.bankAccountNumber || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Key</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ data.bankKey || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Bank Country</p>
          <p class="text-sm font-medium">{{ data.bankCountry || '-' }}</p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">No. NPWP</p>
          <p class="text-sm font-medium whitespace-nowrap">
            {{ data.npwp || '-' }}
          </p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">No. KTP</p>
          <p class="text-sm font-medium whitespace-nowrap">
            {{ data.ktp || '-' }}
          </p>
        </div>
        <div>
          <p class="text-xs font-normal text-gray-700">Email</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ data.email || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
const data = form.alternativePayee[0]
</script>
