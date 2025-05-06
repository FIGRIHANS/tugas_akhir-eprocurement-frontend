<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">{{ form.invoiceNo || '-' }}</p>
    <div class="flex flex-wrap items-center gap-[20px]">
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Company Code</p>
        <p class="text-sm font-medium">{{ form.companyCode || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">No Invoice Vendor</p>
        <p class="text-sm font-medium">{{ form.invoiceNoVendor || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Invoice Date</p>
        <p class="text-sm font-medium whitespace-nowrap">{{ form.invoiceDate ? moment(form.invoiceDate).format('DD/MM/YYYY') : '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">No Tax Invoice</p>
        <p class="text-sm font-medium">{{ form.taxNumber || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Currency</p>
        <p class="text-sm font-medium">{{ form.currency || '-' }}</p>
      </div>
      <div v-if="form.withDp" class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Remaining DP Amount</p>
        <p class="text-sm font-medium">{{ form.remainingDpAmount || '-' }}</p>
      </div>
      <div v-if="form.withDp" class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">DP Amount Deduction</p>
        <p class="text-sm font-medium">{{ form.dpAmountDeduction || '-' }}</p>
      </div>
      <div class="w-[calc(50%-10px)]">
        <p class="text-xs font-normal text-gray-700">Description</p>
        <p class="text-sm font-medium">{{ form.description || '-' }}</p>
      </div>
      <div v-if="checkPo() && !checkPoPib()" class="w-[calc(50%-10px)] flex items-center gap-[8px]">
        <label class="form-label flex items-center gap-2.5 w-fit">
          <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" disabled/>
          <span class="text-gray-500">Invoice DP</span>
        </label>
        <label class="form-label flex items-center gap-2.5 w-fit">
          <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" disabled/>
          <span class="text-gray-500">With Dp</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceAddWrapper'
import moment from 'moment'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
