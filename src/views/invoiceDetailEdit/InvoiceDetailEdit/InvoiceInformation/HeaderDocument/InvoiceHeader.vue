<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice Type -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
        </label>
        <input :value="getInvoiceTypeName()" class="input" placeholder="" disabled />
      </div>

      <!-- Vendor No -->
      <div v-if="checkIsNonPo() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Vendor No.
          <!-- <span class="text-red-500 ml-[4px]">*</span> -->
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
      </div>

      <!-- DP Option -->
      <div
        v-if="form.invoiceTypeCode === 901"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> DP Option </label>
        <input :value="getDpName()" class="input" placeholder="" disabled />
      </div>

      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Company Code </label>
        <!-- always active textbox for company code -->
        <input v-model="form.companyCode" class="input" placeholder="" disabled />
      </div>

      <!-- CAS No. / Invoice No. -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          {{ checkNonPoCas() ? 'CAS No.' : 'Invoice No.' }}
        </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled />
      </div>

      <!-- CAS No. -->
      <div
        v-if="checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> CAS No. </label>
        <input v-model="form.cashJournalCode" class="input" placeholder="" disabled />
      </div>

      <!-- Invoice Date -->
      <div v-if="!checkNonPoCas()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker
          v-model="form.invoiceDate"
          format="yyyy/MM/dd"
          :disabled="
            checkIsAccountingTax() || route.query.isSendSap === 'true'
          "
          :error="form.invoiceDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <!-- Posting Date -->
      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span v-if="!checkVerifikator1() && !checkNonPoCas()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="checkVerifikator1() || route.query.isSendSap === 'true'"
          v-model="form.postingDate"
          class="input"
          placeholder=""
          disabled
        />
        <DatePicker
          v-else
          v-model="form.postingDate"
          format="yyyy/MM/dd"
          :error="form.postingDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <!-- Cash Journal - only for Petty Cash (active) -->
      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Cash Journal
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <v-select
          v-model="form.cashJournalCode"
          class="customSelect w-full -ml-[15px]"
          placeholder="Select"
          label="description"
          :reduce="option => option.cashJournalNo"
          :options="listCashJournal.map(item => ({
            ...item,
            description: `${item.cashJournalNo} - ${item.cashJournalName}`
          }))"
          @input="updateCashJournalName"
          appendToBody
        />
        <!-- <input v-model="form.notes" class="input" placeholder="" /> -->
      </div>

      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Petty Cash Period
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <div class="w-full -ml-[15px]">
          <DatePicker v-model="form.pettyCashPeriod" :range="true" format="yyyy/MM/dd" class="w-full" teleport :disabled="route.query.isSendSap === 'true'" />
        </div>
      </div>

      <!-- Invoicing Party -->
      <div
        v-if="!checkNonPoCas() && !checkNonPoLba() && !checkNonPoPettyCash()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Invoicing Party </label>
        <input
          v-model="form.invoicingParty"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.invoicingPartyError }"
          :disabled="checkVerifikator1() || route.query.isSendSap === 'true'"
        />
      </div>

      <!-- Estimated Payment Date -->
      <div
        v-if="!checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Estimated Payment Date
          <span v-if="!checkVerifikator1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="checkVerifikator1()"
          v-model="form.estimatedPaymentDate"
          class="input"
          placeholder=""
          disabled
        />
        <DatePicker
          v-else
          v-model="form.estimatedPaymentDate"
          format="yyyy/MM/dd"
          :disabled="checkIsAccountingTax() || route.query.isSendSap === 'true'"
          :error="form.estimatedPaymentDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <!-- Due Date CAS -->
      <div
        v-if="checkNonPoCas()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Due Date CAS
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="checkApproval3()" v-model="form.dueDateCas" class="input" placeholder="" disabled />
        <DatePicker v-else v-model="form.dueDateCas" format="yyyy/MM/dd" :error="form.dueDateCasError" class="w-full -ml-[15px]" teleport />
      </div>

      <!-- Remaning CAS Receipt Date -->
      <div
        v-if="checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Remaning CAS Receipt Date </label>
        <input v-model="form.estimatedPaymentDate" class="input" placeholder="" disabled />
        <DatePicker
          v-model="form.estimatedPaymentDate"
          format="yyyy/MM/dd"
          :error="form.estimatedPaymentDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <!-- Tax Document No.  -->
      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Tax Document No.
          <span v-if="checkNonPoCas()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.taxNo" class="input" placeholder="" :class="{ 'border-danger': form.taxNoError }" :disabled="checkVerifikator1() || route.query.isSendSap === 'true'" />
      </div>

      <!-- Invoice Vendor No. -->
      <div v-if="!checkNonPoCas() && !checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.documentNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.documentNoError }"
          :disabled="
            checkIsAccountingTax() || route.query.isSendSap === 'true'
          "
        />
      </div>

      <!-- Payment Method -->
      <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Payment Method
          <span v-if="!checkIsAccountingTax() && !checkVerifikator1()" class="text-red-500 ml-[4px]"
            >*</span
          >
        </label>
        <select
          v-model="form.paymentMethodCode"
          class="select"
          placeholder=""
          :class="{ 'border-danger': form.paymentMethodError }"
          :disabled="
            checkIsAccountingTax() || checkVerifikator1() || route.query.isSendSap === 'true'
          "
        >
          <option v-for="item of paymentMethodList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <!-- Assignment -->
      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Assignment </label>
        <input
          v-model="form.assigment"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.assigmentError }"
          :disabled="checkVerifikator1() || route.query.isSendSap === 'true'"
        />
      </div>

      <!-- Transfer News -->
      <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Transfer News
          <span v-if="!checkIsAccountingTax() && !checkVerifikator1()" class="text-red-500 ml-[4px]"
            >*</span
          >
        </label>
        <input
          v-model="form.transferNews"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.transferNewsError }"
          :disabled="
            checkIsAccountingTax() || checkVerifikator1() || route.query.isSendSap === 'true'
          "
        />
      </div>

      <!-- Credit Card Billing ID -->
      <div
        v-if="form.invoiceTypeCode === 903"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Credit Card Billing ID
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.creditCardBillingId"
          class="input"
          placeholder=""
          :disabled="userData?.profile.profileId !== 3190"
          :class="{ 'border-danger': form.creditCardBillingError }"
        />
      </div>

      <!-- Currency -->
      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input :value="form.currCode" class="input" placeholder="" disabled />
      </div>

      <!-- NPWP Reporting -->
      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
          <span v-if="!checkApproval1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <select v-model="form.npwpReporting" class="select" placeholder="" :class="{ 'border-danger': form.npwpReportingError }" :disabled="isNpwrDisabled() || checkVerifikator1() || route.query.isSendSap === 'true'">
          <option v-for="item of npwpReportingList" :key="item.npwpLocation" :value="item.npwpLocation">
            {{ item.npwpDescription }}
          </option>
        </select>
      </div>

      <!-- Remaining DP Amount -->
      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="remainingDpAmountVal" class="input" placeholder="" disabled/>
      </div>

      <!-- DP Amount Deduction -->
      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
          <span v-if="!checkVerifikator1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.dpAmountDeduction"
          class="input"
          placeholder=""
          :disabled="checkVerifikator1() || checkInvoiceDp() || route.query.isSendSap === 'true'"
        />
      </div>

      <!-- Department / Requestor -->
      <div v-if="checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Requestor
        </label>
        <input v-model="form.department" class="input" placeholder="" disabled />
      </div>

      <!-- PIC Finance -->
      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          PIC Finance
        </label>
        <input v-model="form.department" class="input" placeholder="" />
      </div>

      <!-- Description -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span v-if="!checkVerifikator1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea"
          placeholder=""
          :class="{ 'border-danger': form.notesError }"
          :disabled="checkVerifikator1()"
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
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { get } from 'lodash'

const invoiceMasterApi = useInvoiceMasterDataStore()
const invoiceLoginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)
const paymentMethodList = computed(() => invoiceMasterApi.paymentMethodList)
const userData = computed(() => invoiceLoginApi.userData)
const npwpReportingList = computed(() => invoiceMasterApi.npwpReportingList)
const listCashJournal = computed(() => invoiceMasterApi.cashJournalList)

console.log('listCashJournal', listCashJournal.value)

const remainingDpAmountVal = computed(() => {
  if (form.value.currCode === 'IDR') {
    return useFormatIdr(form.value.remainingDpAmount)
  } else {
    return useFormatUsd(form.value.remainingDpAmount)
  }
})

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

const checkIsAccountingTax = () => {
  return userData.value.profile.profileId === 3003 || userData.value.profile.profileId === 3202
}

const checkVerifikator1 = () => {
  return userData.value.profile.profileId === 3190
}

const checkInvoiceDp = () => {
  return form.value.invoiceTypeCode === 9012
}

const checkApproval1 = () => {
  return userData.value.profile.profileId === 3002
}

const checkApproval3 = () => {
  return userData.value.profile.profileId === 3003
}

const checkNonPoCas = () => {
  return form.value.invoiceTypeCode === 3
}

const checkNonPoLba = () => {
  return form.value.invoiceTypeCode === 4
}

// const checkNonPoCc = () => {
//   return form.value.invoiceTypeCode === 2
// }

const checkNonPoPettyCash = () => {
  return form.value.invoiceTypeCode === 5
}

const getDpName = () => {
  if (route.query.type === 'po-view') return 'Without DP'
  const getIndex = dpTypeList.value.findIndex(
    (item) => item.code === form?.value.invoiceDPCode.toString(),
  )
  if (getIndex !== -1) return dpTypeList.value[getIndex].name
}

const getInvoiceTypeName = () => {
  const listType = checkIsNonPo() ? listInvoiceTypeNonPo.value : listInvoiceTypePo.value
  const getIndex = listType.findIndex(
    (item) => item.code === form?.value.invoiceTypeCode.toString(),
  )
  if (getIndex !== -1) return listType[getIndex].name
}

const isNpwrDisabled = () => {
  if (userData.value && userData.value.profile.profileId === 3002) {
    return true
  } else {
    return false
  }
}

// const checkPo = () => {
//   return typeForm.value === 'po'
// }

watch(
  () => form,
  () => {
    if (form?.value.paymentMethodCode) {
      const getIndex = paymentMethodList.value.findIndex(
        (item) => item.code === form.value.paymentMethodCode,
      )
      if (getIndex !== -1) form.value.paymentMethodName = paymentMethodList.value[getIndex].name
    }
  },
  {
    deep: true,
  },
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getCompanyCode()
  if (form?.value.companyCode && form?.value.invoiceTypeCode === 5) {
    invoiceMasterApi.getCashJournal(form.value.companyCode || '')
  }
})
</script>
