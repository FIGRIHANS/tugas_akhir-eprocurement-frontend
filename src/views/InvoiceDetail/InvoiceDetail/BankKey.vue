<template>
  <div v-if="form" class="card">
    <div class="card-header py-[17px] flex items-center justify-between gap-[8px]">
      <h3 class="card-title text-base font-semibold">Payment Information</h3>
    </div>
    <div v-if="isNonPo" class="tabs">
      <button
        class="tab flex-1 justify-center"
        :class="{ active: tabActive === 'payment' }"
        @click="tabActive = 'payment'"
      >
        Payment Information
      </button>
      <button
        class="tab flex-1 justify-center"
        :class="{ active: tabActive === 'alternative' }"
        @click="tabActive = 'alternative'"
      >
        Alternative Payment
      </button>
    </div>
    <div class="card-body">
      <div v-show="tabActive === 'payment'" class="flex flex-col gap-[20px]">
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Key</p>
          <p class="font-normal text-sm">{{ form.bankKey }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Name</p>
          <p class="font-normal text-sm">{{ form?.bankName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Beneficiary Name</p>
          <p class="font-normal text-sm">{{ form?.beneficiaryName }}</p>
        </div>
        <div class="flex items-center justify-between gap-[10px]">
          <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
          <p class="font-normal text-sm">{{ form?.bankAccountNo }}</p>
        </div>
        <div
          v-if="route.query.invoiceType !== 'no_po'"
          class="flex items-center justify-between gap-[10px]"
        >
          <p class="font-normal text-sm text-gray-600">Bank Country</p>
          <p class="font-normal text-sm">{{ form?.bankCountryCode }}</p>
        </div>
      </div>
      <div v-show="tabActive === 'alternative'" class="grid grid-cols-2">
        <div class="flex flex-col gap-[20px] col-span-1">
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Type</p>
            <div>
              <p class="font-normal text-sm">
                <i
                  class="ki-solid ki-check-circle text-green-400"
                  v-if="form.alternativePayee[0]?.isAlternativePayee ?? false"
                ></i>
                Alternative Payee
              </p>
              <p class="font-normal text-sm">
                <i
                  class="ki-solid ki-check-circle text-green-400"
                  v-if="form.alternativePayee[0]?.isOneTimeVendor ?? false"
                ></i>
                One Time Vendor
              </p>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Name</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.name || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Name 2</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.name2 || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Street</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.street || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">City</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.city || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Country</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.country || '-' }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-[20px] col-span-1">
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Bank Account Number</p>
            <p class="font-normal text-sm">
              {{ form.alternativePayee[0]?.bankAccountNumber || '-' }}
            </p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Bank Key</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.bankKey || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Bank Country</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.bankCountry || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">No. NPWP</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.npwp || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">No. KTP</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.ktp || '-' }}</p>
          </div>
          <div class="flex flex-col items-start gap-[10px]">
            <p class="font-normal text-sm text-gray-600">Email</p>
            <p class="font-normal text-sm">{{ form.alternativePayee[0]?.email || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import { useRoute } from 'vue-router'

const route = useRoute()
const form = inject<formTypes>('form')
const tabActive = ref<string>('payment')
const isNonPo = ref<boolean>(false)

onMounted(() => {
  if (route.query.invoiceType === 'no_po') {
    isNonPo.value = true
  }
})
</script>
