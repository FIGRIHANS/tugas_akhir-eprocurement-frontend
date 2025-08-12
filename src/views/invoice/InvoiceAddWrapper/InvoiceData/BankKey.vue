<template>
  <div class="card flex-1">
    <div class="card-header justify-start gap-[8px] px-[16px] py-[22px]">
      <i class="ki-duotone ki-bill text-gray-600 text-xl"></i>
      <span class="font-medium">Payment Information</span>
    </div>
    <div v-if="form" class="card-body py-[8px] px-[50px]">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { PaymentTypes } from '@/stores/master-data/types/invoiceMasterData'

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
