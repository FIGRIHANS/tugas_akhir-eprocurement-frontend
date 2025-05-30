<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice Type -->
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
          <span v-if="form.status === 0 && !loginApi.isVendor" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0 || loginApi.isVendor" v-model="form.invoiceType" class="input" placeholder="" disabled />
        <select v-else v-model="form.invoiceType" class="select" :class="{ 'border-danger': form.invoiceTypeError }">
          <option v-for="item of listInvoiceTypePo" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- DP Option -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Option
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0" v-model="form.invoiceDp" class="input" placeholder="" disabled />
        <select v-else v-model="form.invoiceDp" class="select" :class="{ 'border-danger': form.invoiceDpError }">
          <option v-for="item of dpTypeList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0" v-model="form.companyCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
          <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- No Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Internal Invoice No.
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="Auto Generated Number" disabled/>
      </div>
      <!-- Invoice Document No. * -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Document No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.invoiceNoVendor" class="input" placeholder=""  :disabled="form.status !== 0" :class="{ 'border-danger': form.invoiceNoVendorError }"/>
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" format="yyyyMMdd" :error="form.invoiceDateError" :disabled="form.status !== 0" class="w-full -ml-[15px]" />
      </div>
      <!-- Tax Document No. * -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Tax Document No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.taxNoInvoice" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.taxNoInvoiceError }"/>
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input v-if="form.status !== 0" v-model="form.currency" class="input" placeholder="" disabled />
        <select v-else v-model="form.currency" class="select" :class="{ 'border-danger': form.currencyError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select>
      </div>
      <!-- Remaining DP Amount -->
      <div v-if="form.invoiceDp === 'WDP'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="form.remainingDpAmount" class="input" placeholder="" disabled/>
      </div>
      <!-- DP Amount Deduction -->
      <div v-if="form.invoiceDp === 'WDP'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
        </label>
        <input v-model="form.dpAmountDeduction" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.dpAmountDeductionError }"/>
      </div>
      <!-- Description -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea
          v-model="form.description"
          class="textarea"
          placeholder=""
          :disabled="form.status !== 0"
          :class="{ 'border-danger': form.descriptionError }"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'

const invoiceMasterApi = useInvoiceMasterDataStore()
const loginApi = useLoginStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const currencyList = computed(() => {
  return invoiceMasterApi.currency
  // if (form?.invoicePoGr.length === 0 || !form?.invoicePoGr) {
  //   return []
  // } else {
  //   const result = []
  //   for (const item of form.invoicePoGr) {
  //     const check = invoiceMasterApi.currency.findIndex((subItem) => subItem.code === item.currency)
  //     if (check !== -1) result.push(item.currency)
  //   }
  //   return result
  // }
})
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)

const checkPo = () => {
  return typeForm.value === 'po'
}

watch(
  () => form,
  () => {
    if (form?.invoiceType) {
      const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form.invoiceType)
      if (getIndex !== -1) form.invoiceTypeName = listInvoiceTypePo.value[getIndex].name
    }

    if (form?.companyCode) {
      const getIndex = companyCodeList.value.findIndex((item) => item.code === form.companyCode)
      if (getIndex !== -1) form.companyName = companyCodeList.value[getIndex].name.split(' - ')[1]
    }
  },
  {
    deep: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getCurrency()
  invoiceMasterApi.getCompanyCode()
  invoiceMasterApi.getDpTypes()
})
</script>
