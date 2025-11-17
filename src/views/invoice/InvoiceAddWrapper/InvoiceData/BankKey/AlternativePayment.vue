<template>
  <div v-if="form">
    <div class="flex align-items-center p-[16px]">
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.isAlternativePayee" class="checkbox" name="check" type="checkbox" />
        Alternative Payee
      </label>
      <label class="form-label flex items-center gap-2.5">
        <input v-model="form.isOneTimeVendor" class="checkbox" name="check" type="checkbox" />
        One Time Vendor
      </label>
    </div>
    <div class="flex">
      <div class="flex-1">
        <!-- Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Name <span v-if="isAlt" class="text-danger">*</span> </label>
          <input v-model="form.nameAlternative" class="input" placeholder="" />
        </div>
        <!-- Name 2 -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Name 2 </label>
          <input v-model="form.nameOtherAlternative" class="input" placeholder="" />
        </div>
        <!-- Street -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Street <span v-if="isAlt" class="text-danger">*</span> </label>
          <input v-model="form.streetAltiernative" class="input" placeholder="" />
        </div>
        <!-- Country -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Country </label>
          <v-select
            v-model="form.countryAlternative"
            class="customSelect w-full"
            label="countryName"
            placeholder="Select"
            :reduce="(option: any) => option.countryCode"
            :options="listCountry"
          ></v-select>
        </div>
        <!-- City -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> City </label>
          <input v-model="form.cityAlternative" class="input" placeholder="" />
        </div>
        <!-- Bank Account Number -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Bank Account Number <span v-if="isAlt" class="text-danger">*</span> </label>
          <input v-model="form.bankAccountNumberAlternative" class="input" placeholder="" />
        </div>
      </div>
      <div class="flex-1">
        <!-- Bank Country -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Bank Country </label>
          <v-select
            v-model="form.bankCountryAlternative"
            class="customSelect w-full"
            label="countryName"
            placeholder="Select"
            :reduce="(option: any) => option.countryCode"
            :options="listCountry"
          ></v-select>
        </div>
        <!-- Bank Key -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Bank Key <span v-if="isAlt" class="text-danger">*</span> </label>
          <v-select
            v-model="form.bankKeyAlternative"
            class="customSelect w-full"
            placeholder="Select"
            :get-option-label="(option: any) => `${option.bankKey} - ${option.bankNameAccount}`"
            :reduce="(option: any) => option.bankKey"
            :options="listBankAlternative"
          ></v-select>
        </div>
        <!-- No. NPWP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> No. NPWP </label>
          <input v-model="form.npwpNumberAlternative" class="input" placeholder="" />
        </div>
        <!-- No. KTP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> No. KTP </label>
          <input v-model="form.ktpNumberAlternative" class="input" placeholder="" />
        </div>
        <!-- Email -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Email <span v-if="isAlt" class="text-danger">*</span> </label>
          <input v-model="form.emailAlternative" class="input" placeholder="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, watch } from 'vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const form = inject<formTypes>('form')
const vendorMasterApi = useVendorMasterDataStore()
const invoiceMasterApi = useInvoiceMasterDataStore()

const listCountry = computed(() => vendorMasterApi.countryList)
const isAlt = computed(() => !!form?.isAlternativePayee)
const listBankAlternative = computed(() => invoiceMasterApi.bankAlternative)

onMounted(() => {
  vendorMasterApi.getVendorCountries()
})

watch(
  () => form.bankCountryAlternative,
  () => {
    invoiceMasterApi.getBankAlternative(form.bankCountryAlternative)
  }
)

// Ensure only one of the two options can be selected at a time
watch(
  () => form?.isAlternativePayee,
  (val) => {
    if (!form) return
    if (val) form.isOneTimeVendor = false
  },
)

watch(
  () => form?.isOneTimeVendor,
  (val) => {
    if (!form) return
    if (val) form.isAlternativePayee = false
  },
)
</script>
