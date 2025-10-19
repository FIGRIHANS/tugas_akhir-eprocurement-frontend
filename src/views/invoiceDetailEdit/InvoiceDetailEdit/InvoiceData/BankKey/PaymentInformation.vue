<template>
  <div v-if="form">
    <!-- Bank Key -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Key
        <span class="text-red-500 ml-[4px]">*</span>
      </label>
      <select
        v-model="form.bankKey"
        class="select"
        :class="{ 'border-danger': form.bankKeyIdError }"
        :disabled="route.query.isSendSap === 'true'"
      >
        <option v-for="item of bankList" :key="item.bankId" :value="item.bankKey">
          {{ item.bankKey + ' - ' + item.accountNumber }}
        </option>
      </select>
    </div>
    <!-- Bank Account Number -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32"> Bank Account Number </label>
      <input v-model="form.bankAccountNo" class="input" placeholder="" disabled />
    </div>
    <!-- Bank Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32"> Bank Name </label>
      <input v-model="form.bankName" class="input" placeholder="" disabled />
    </div>
    <!-- Beneficiary Name -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32"> Beneficiary Name </label>
      <input v-model="form.beneficiaryName" class="input" placeholder="" disabled />
    </div>
    <!-- Bank Country -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32"> Bank Country </label>
      <input v-model="form.bankCountryCode" class="input" placeholder="" disabled />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, type Ref } from 'vue'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import type { PaymentTypes } from '@/stores/master-data/types/invoiceMasterData'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useRoute } from 'vue-router'

const route = useRoute()
const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const bankList = ref<PaymentTypes[]>([])

const vendorList = computed(() => invoiceMasterApi.vendorList)

const checkBank = () => {
  if (form) {
    const getIndex = vendorList.value.findIndex(
      (item) => item.sapCode === form.value.vendorId.toString(),
    )
    if (getIndex !== -1) {
      bankList.value = vendorList.value[getIndex].payment
      if (bankList.value.length === 1) {
        form.value.bankKey = bankList.value[0].bankKey
        form.value.bankName = bankList.value[0].bankName
        form.value.beneficiaryName = bankList.value[0].beneficiaryName
        form.value.bankAccountNo = bankList.value[0].accountNumber
        form.value.bankCountryCode = bankList.value[0].bankCountryCode
      } else {
        form.value.bankKey = ''
        form.value.bankName = ''
        form.value.beneficiaryName = ''
        form.value.bankAccountNo = ''
        form.value.bankCountryCode = ''
      }
    }
  }
}

watch(
  () => vendorList.value,
  () => {
    checkBank()
  },
  {
    deep: true,
  },
)

watch(
  () => form?.value,
  () => {
    checkBank()
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => form?.value.bankKey,
  () => {
    if (form) {
      const getIndex = bankList.value.findIndex((item) => item.bankKey === form.value.bankKey)
      if (getIndex !== -1) {
        form.value.bankName = bankList.value[getIndex].bankName
        form.value.beneficiaryName = bankList.value[getIndex].beneficiaryName
        form.value.bankAccountNo = bankList.value[getIndex].accountNumber
        form.value.bankCountryCode = bankList.value[getIndex].bankCountryCode
      }
    }
  },
)
</script>
