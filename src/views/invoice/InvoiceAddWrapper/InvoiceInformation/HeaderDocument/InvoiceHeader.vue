<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice No -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Invoice No
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled/>
      </div>
      <!-- No Supplier Invoice -->
      <div v-if="checkNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          No Supplier Invoice
        </label>
        <input v-model="form.supplierInvoiceNumber" class="input" placeholder="" disabled/>
      </div>
      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Company Code
        </label>
        <input v-if="form.status !== 0" v-model="form.companyCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Company Code Description -->
      <div v-if="checkNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Company Code Description
        </label>
        <input v-model="form.companyCodeDescription" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.companyCodeDescriptionError }"/>
      </div>
      <!-- No Supplier Invoice -->
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          No Supplier Invoice
        </label>
        <input v-model="form.supplierInvoiceNumber" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.supplierInvoiceNumberError }"/>
      </div>
      <!-- Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Invoice Date
        </label>
        <DatePicker v-model="form.invoiceDate" :error="form.invoiceDateError" :disabled="form.status !== 0" />
      </div>
      <!-- No Tax Invoice -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          No Tax Invoice
        </label>
        <input v-model="form.taxNumber" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.taxNumberError }"/>
      </div>
      <!-- Tax Invoice Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Tax Invoice Date
        </label>
        <DatePicker v-model="form.taxDate" :error="form.taxDateError" :disabled="form.status !== 0" />
      </div>
      <!-- Tax Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Tax Code
        </label>
        <input v-if="form.status !== 0" v-model="form.taxCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.taxCode" class="select" :class="{ 'border-danger': form.taxCodeError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- WHT Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          WHT Code
        </label>
        <input v-if="form.status !== 0" v-model="form.whtCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.whtCode" class="select" :class="{ 'border-danger': form.whtCodeError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <!-- Estimated Schedule Payment  -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Estimated Schedule Payment
        </label>
        <DatePicker v-model="form.paymentDate" :error="form.paymentDateError" :disabled="form.status !== 0" />
      </div>
      <!-- Department -->
      <div v-if="checkNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label max-w-32">
          Department
        </label>
        <input v-if="form.status !== 0" v-model="form.department" class="input" placeholder="" disabled />
        <select v-else v-model="form.department" class="select" :class="{ 'border-danger': form.departmentError }">
          <option value="1">
            Option 1
          </option>
          <option value="2">
            Option 2
          </option>
          <option value="3">
            Option 3
          </option>
        </select>
      </div>
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <div class="w-[128px]"></div>
        <div class="flex items-center gap-[8px] flex-1">
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.invoiceDp" class="checkbox" name="checkInvoiceDp" type="checkbox" :disabled="form.withDp || form.status !== 0"/>
            Invoice DP
          </label>
          <label class="form-label flex items-center gap-2.5">
            <input v-model="form.withDp" class="checkbox" name="checkWithDp" type="checkbox" :disabled="form.invoiceDp || form.status !== 0"/>
            With Dp
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import type { formTypes } from '../../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

const checkNonPo = () => {
  return typeForm.value === 'nonpo'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
