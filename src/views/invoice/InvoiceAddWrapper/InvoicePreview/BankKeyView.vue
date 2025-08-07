<template>
  <div v-if="form" class="flex flex-col gap-[20px]">
    <p class="text-lg font-semibold m-[0px]">Payment Information</p>
    <div v-if="!form.isNotRegisteredBank" class="flex flex-col gap-[20px]">
      <div>
        <p class="text-xs font-normal text-gray-700">Bank Key</p>
        <p class="text-sm font-medium">{{ getBankKey() || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Bank Name</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.bankNameId || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Beneficiary Name</p>
        <p class="text-sm font-medium">{{ form.beneficiaryName || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Bank Account Number</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.bankAccountNumber || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')

const vendorList = computed(() => invoiceMasterApi.vendorList)

const getBankKey = () => {
  const getIndex = vendorList.value.findIndex((item) => item.sapCode === form?.vendorId)
  if (getIndex !== -1) {
    const bankList = vendorList.value[getIndex].payment
    const getIndexBank = bankList.findIndex((item) => item.bankKey === form?.bankKeyId)
    if (getIndexBank !== -1) return bankList[getIndexBank].bankKey
  }
}
</script>
