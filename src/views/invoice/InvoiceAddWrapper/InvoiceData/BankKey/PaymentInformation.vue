<template>
  <div v-if="form">
    <!-- Bank Key -->
    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Key
        <span class="text-red-500 ml-[4px]">*</span>
      </label>
      <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.bankKeyId" class="input" placeholder="" disabled />
      <select v-else v-model="form.bankKeyId" class="select" :class="{ 'border-danger': form.bankKeyIdError }">
        <option v-for="item of bankList" :key="item.bankId" :value="item.bankKey">
          {{ item.bankKey + ' - ' + item.accountNumber }}
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
    <!-- Bank Country -->
    <!-- <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
      <label class="form-label max-w-32">
        Bank Country
      </label>
      <input v-model="form.bankCountryCode" class="input" placeholder="" disabled/>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import type { PaymentTypes } from '@/stores/master-data/types/invoiceMasterData'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const bankList = ref<PaymentTypes[]>([])

const vendorList = computed(() => invoiceMasterApi.vendorList)

const checkBank = () => {
  if (form) {
    const getIndex = vendorList.value.findIndex((item) => item.sapCode === form?.vendorId)
    if (getIndex !== -1) {
      bankList.value = vendorList.value[getIndex].payment
      if (bankList.value.length === 1) {
        form.bankKeyId = bankList.value[0].bankKey
        form.bankNameId = bankList.value[0].bankName
        form.beneficiaryName = bankList.value[0].beneficiaryName
        form.bankAccountNumber = bankList.value[0].accountNumber
        form.bankCountryCode = bankList.value[0].bankCountryCode
      } else {
        form.bankKeyId = ''
        form.bankNameId = ''
        form.beneficiaryName = ''
        form.bankAccountNumber = ''
        form.bankCountryCode = ''
      }
    }
  }
}

watch(
  () => [form?.vendorId, vendorList.value],
  () => {
    checkBank()
  }
)

watch(
  () => form?.bankKeyId,
  () => {
    if (form) {
      const getIndex = bankList.value.findIndex((item) => item.bankKey === form.bankKeyId)
      if (getIndex !== -1) {
        form.bankNameId = bankList.value[getIndex].bankName
        form.beneficiaryName = bankList.value[getIndex].beneficiaryName
        form.bankAccountNumber = bankList.value[getIndex].accountNumber
        form.bankCountryCode = bankList.value[getIndex].bankCountryCode
      }
    }
  }
)

onMounted(() => {
  checkBank()
})
</script>
