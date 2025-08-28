<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Vendor No. -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Vendor No.
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" format="yyyy/MM/dd" :error="form.invoiceDateError" class="w-full -ml-[15px]" teleport />
      </div>
      <!-- Posting Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.postingDate" format="yyyy/MM/dd" :error="form.postingDateError" class="w-full -ml-[15px]" teleport />
      </div>
      <!-- Invoice No. -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice No.
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled />
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
        </label>
        <input :value="form.companyName" class="input" placeholder="" disabled />
      </div>
      <!-- Estimated Payment Date * -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Estimated Payment Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.estimatedPaymentDate" format="yyyy/MM/dd" :error="form.estimatedPaymentDateError" class="w-full -ml-[15px]" teleport />
      </div>
      <!-- Invoice Vendor No. -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.documentNo" class="input" placeholder="" :class="{ 'border-danger': form.documentNoError }" />
      </div>
      <!-- Payment Method -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Payment Method
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <select v-model="form.paymentMethodCode" class="select" placeholder="" :class="{ 'border-danger': form.paymentMethodError }">
          <option v-for="item of paymentMethodList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- Assignment -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Assignment
        </label>
        <input v-model="form.assigment" class="input" placeholder="" :class="{ 'border-danger': form.assignmentError }" />
      </div>
      <!-- Transfer News -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Transfer News
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.transferNews" class="input" placeholder="" :class="{ 'border-danger': form.transferNewsError }" />
      </div>
      <!-- Currency -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input :value="form.currCode" class="input" placeholder="" disabled />
        <!-- <select v-model="form.currCode" class="select" :class="{ 'border-danger': form.currCodeError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select> -->
      </div>
      <!-- NPWP Reporting -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
        </label>
        <input v-model="form.npwpReporting" class="input" placeholder="" :class="{ 'border-danger': form.npwpReportingError }" :disabled="isNpwrDisabled()" />
      </div>
      <!-- PIC Finance -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          PIC Finance
        </label>
        <input v-model="form.assigment" class="input" placeholder="" :class="{ 'border-danger': form.assignmentError }" />
      </div>
      <!-- Department -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Department
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <select v-model="form.paymentMethodCode" class="select" placeholder="" :class="{ 'border-danger': form.paymentMethodError }">
          <option v-for="item of paymentMethodList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- Description -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea"
          placeholder=""
          :class="{ 'border-danger': form.notesError }"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceDetailEdit'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useLoginStore } from '@/stores/views/login'

const invoiceMasterApi = useInvoiceMasterDataStore()
const invoiceLoginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

const paymentMethodList = computed(() => invoiceMasterApi.paymentMethodList)
const userData = computed(() => invoiceLoginApi.userData)

const isNpwrDisabled = () => {
  if (userData.value) {
    [3002, 3190].includes(userData.value?.profile?.profileId);
    return true
  } else {
    return false
  }
}

watch(
  () => form,
  () => {
    if (form?.value.paymentMethodCode) {
      const getIndex = paymentMethodList.value.findIndex((item) => item.code === form.value.paymentMethodCode)
      if (getIndex !== -1) form.value.paymentMethodName = paymentMethodList.value[getIndex].name
    }
  },
  {
    deep: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
