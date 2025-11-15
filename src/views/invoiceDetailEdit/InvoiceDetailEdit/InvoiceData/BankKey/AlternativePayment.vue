<template>
  <div v-if="form">
    <div class="flex align-items-center p-[16px]">
      <label class="form-label flex items-center gap-2.5">
        <input
          v-model="form.isAlternativePayee"
          class="checkbox"
          name="check"
          type="checkbox"
          :disabled="route.query.isSendSap === 'true'"
        />
        Alternative Payee
      </label>
      <label class="form-label flex items-center gap-2.5">
        <input
          v-model="form.isOneTimeVendor"
          class="checkbox"
          name="check"
          type="checkbox"
          :disabled="route.query.isSendSap === 'true'"
        />
        One Time Vendor
      </label>
    </div>
    <div class="flex">
      <div class="flex-1">
        <!-- Name -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Name
            <span v-if="form.isAlternativePayee || form.isOneTimeVendor" class="text-red-500 ml-[4px]">*</span>
          </label>
          <input
            v-model="form.nameAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
            :class="{ 'border-danger': form.nameAlternativeError }"
          />
        </div>
        <!-- Name 2 -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> Name 2 </label>
          <input
            v-model="form.nameOtherAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
          />
        </div>
        <!-- Street -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Street
            <span v-if="form.isAlternativePayee || form.isOneTimeVendor" class="text-red-500 ml-[4px]">*</span>
          </label>
          <input
            v-model="form.streetAltiernative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
            :class="{ 'border-danger': form.streetAltiernativeError }"
          />
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
            :disabled="route.query.isSendSap === 'true'"
          ></v-select>
        </div>
        <!-- City -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> City </label>
          <input
            v-model="form.cityAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
          />
        </div>
        <!-- Bank Account Number -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Account Number
            <span v-if="form.isAlternativePayee || form.isOneTimeVendor" class="text-red-500 ml-[4px]">*</span>
          </label>
          <input
            v-model="form.bankAccountNumberAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
            :class="{ 'border-danger': form.bankAccountNumberAlternativeError }"
          />
        </div>
      </div>
      <div class="flex-1">
        <!-- Bank Key -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Bank Key
            <span v-if="form.isAlternativePayee || form.isOneTimeVendor" class="text-red-500 ml-[4px]">*</span>
          </label>
          <v-select
            v-model="form.bankKeyAlternative"
            class="customSelect w-full"
            placeholder="Select"
            :get-option-label="(option: any) => `${option.bankKey} - ${option.bankNameAccount}`"
            :reduce="(option: any) => option.bankKey"
            :options="listBankAlternative"
            :class="{ 'error-select': form.bankKeyAlternativeError }"
          ></v-select>
        </div>
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
            :disabled="route.query.isSendSap === 'true'"
          ></v-select>
        </div>
        <!-- No. NPWP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> No. NPWP </label>
          <input
            v-model="form.npwpNumberAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
          />
        </div>
        <!-- No. KTP -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32"> No. KTP </label>
          <input
            v-model="form.ktpNumberAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
          />
        </div>
        <!-- Email -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
          <label class="form-label max-w-32">
            Email
            <span v-if="form.isAlternativePayee || form.isOneTimeVendor" class="text-red-500 ml-[4px]">*</span>
          </label>
          <input
            v-model="form.emailAlternative"
            class="input"
            placeholder=""
            :disabled="route.query.isSendSap === 'true'"
            :class="{ 'border-danger': form.emailAlternativeError }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useRoute } from 'vue-router'

const route = useRoute()
const form = inject<formTypes>('form')
const vendorMasterApi = useVendorMasterDataStore()
const invoiceMasterApi = useInvoiceMasterDataStore()

const listCountry = computed(() => vendorMasterApi.countryList)
const listBankAlternative = computed(() => invoiceMasterApi.bankAlternative)

watch(
  () => form.bankCountryAlternative,
  () => {
    invoiceMasterApi.getBankAlternative(form.bankCountryAlternative)
  }
)

onMounted(() => {
  vendorMasterApi.getVendorCountries()
})
</script>
