<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
        </label>
        <input :value="getInvoiceTypeName()" class="input" placeholder="" disabled />
      </div>

      <div v-if="checkIsNonPo() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Vendor No.
          <!-- <span class="text-red-500 ml-[4px]">*</span> -->
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
      </div>

      <div
        v-if="form.invoiceTypeCode === 901"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> DP Option </label>
        <input :value="getDpName()" class="input" placeholder="" disabled />
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Company Code </label>
        <input v-model="form.companyName" class="input" placeholder="" disabled />
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

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          {{ checkNonPoCas() ? 'Due Date CAS' : 'Invoice Date' }}
          <span v-if="!disabledInvoiceDate()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="disabledInvoiceDate()"
          :value="form.invoiceDate ? moment(form.invoiceDate).format('YYYY/MM/DD') : ''"
          class="input"
          placeholder=""
          disabled
        />
        <DatePicker
          v-else
          v-model="form.invoiceDate"
          format="yyyy/MM/dd"
          :error="form.invoiceDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span v-if="!disabledPostingDate() && !checkNonPoCc()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="disabledPostingDate()"
          :value="form.postingDate ? moment(form.postingDate).format('YYYY/MM/DD') : ''"
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

      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Cash Journal
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <v-select
          v-model="form.cashJournalCode"
          class="customSelect w-full -ml-[15px]"
          placeholder="Select"
          :get-option-label="(option: any) => `${option.cashJournalNo} - ${option.cashJournalName}`"
          :reduce="(option: any) => option.cashJournalNo"
          :options="listCashJournal"
          :class="{ 'error-select': form.cashJournalCodeError }"
          appendToBody
        ></v-select>
      </div>

      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Petty Cash Period
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="route.query.isSendSap === 'true'"
          :value="form.pettyCashPeriod ? moment(form.pettyCashPeriod).format('YYYY/MM/DD') : ''"
          class="input"
          placeholder=""
          disabled
        />
        <DatePicker
          v-else
          v-model="form.pettyCashPeriod"
          format="yyyy/MM/dd"
          :range="true"
          :error="form.postingDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <div
        v-if="!checkNonPoCas() && !checkNonPoLba() && !checkNonPoPettyCash() && !checkNonPoCc()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Invoicing Party </label>
        <input
          v-model="form.invoicingParty"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.invoicingPartyError }"
          :disabled="disabledInvoicingParty()"
        />
      </div>

      <div
        v-if="!checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Estimated Payment Date
          <span v-if="!disabledEstimatedPaymentDate() && !checkNonPoCc()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="disabledEstimatedPaymentDate()"
          :value="form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYY/MM/DD') : ''"
          class="input"
          placeholder=""
          disabled
        />
        <DatePicker
          v-else
          v-model="form.estimatedPaymentDate"
          format="yyyy/MM/dd"
          :error="form.estimatedPaymentDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <div
        v-if="checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Remaning CAS Receipt Date </label>
        <input v-if="checkApprovalNonPoProc()" :value="form.estimatedPaymentDate ? moment(form.estimatedPaymentDate).format('YYYY/MM/DD') : ''" class="input" placeholder="" disabled />
        <DatePicker
          v-else
          v-model="form.estimatedPaymentDate"
          format="yyyy/MM/dd"
          :error="form.estimatedPaymentDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>

      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Tax Document No.
          <span v-if="(!disabledTaxDocumentNo() && !checkNonPoCc()) || checkNonPoCas()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.taxNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.taxNoError }"
          :disabled="disabledTaxDocumentNo()"
        />
      </div>

      <div v-if="!checkNonPoCas() && !checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Vendor No.
          <span v-if="!disabledInvoiceVendorNo()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.documentNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.documentNoError }"
          :disabled="disabledInvoiceVendorNo()"
        />
      </div>

      <div v-if="checkNonPoCc()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Proposal Amount
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.proposalAmount"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.proposalAmountError }"
          :disabled="checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin()"
        />
      </div>

      <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Payment Method
          <span v-if="!disabledPaymentMethod()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <select
          v-model="form.paymentMethodCode"
          class="select"
          placeholder=""
          :class="{ 'border-danger': form.paymentMethodError }"
          :disabled="disabledPaymentMethod()"
        >
          <option v-for="item of paymentMethodList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Assignment </label>
        <input
          v-model="form.assigment"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.assigmentError }"
          :disabled="disabledAssignment()"
        />
      </div>

      <div v-if="!checkNonPoLba() && !checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Transfer News
          <span v-if="!disabledTransferNews() && !checkNonPoCc()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.transferNews"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.transferNewsError }"
          :disabled="disabledTransferNews()"
        />
      </div>

      <div
        v-if="form.invoiceTypeCode === 903 || checkNonPoCc()"
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
          :disabled="userData?.profile.profileId !== 3190 || checkApprovalNonPoProc()"
          :class="{ 'border-danger': form.creditCardBillingError }"
        />
      </div>

      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Currency
        </label>
        <input :value="form.currCode" class="input" placeholder="" disabled />
      </div>

      <div v-if="!checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          NPWP Reporting
          <span v-if="!disabledNpwpReporting() && !checkApproval1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <select
          v-model="form.npwpReporting"
          class="select"
          placeholder=""
          :class="{ 'border-danger': form.npwpReportingError }"
          :disabled="disabledNpwpReporting()"
        >
          <option v-for="item of npwpReportingList" :key="item.npwpLocation" :value="item.npwpLocation">
            {{ item.npwpDescription }}
          </option>
        </select>
      </div>

      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Remaining DP Amount
        </label>
        <input v-model="remainingDpAmountVal" class="input" placeholder="" disabled/>
      </div>

      <div v-if="form.invoiceDPCode === 9013" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          DP Amount Deduction
          <span v-if="!disabledDpAmountDeduction()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.dpAmountDeduction"
          class="input"
          placeholder=""
          :disabled="disabledDpAmountDeduction()"
        />
      </div>

      <div v-if="checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Requestor
        </label>
        <input v-model="form.department" class="input" placeholder="" disabled />
      </div>

      <div v-if="checkNonPoPettyCash()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          PIC Finance
        </label>
        <input v-model="form.picFinance" class="input" placeholder="" />
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span v-if="!disabledDescription()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea"
          placeholder=""
          :class="{ 'border-danger': form.notesError }"
          :disabled="disabledDescription()"
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
import moment from 'moment'

const invoiceMasterApi = useInvoiceMasterDataStore()
const invoiceLoginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)
const paymentMethodList = computed(() => invoiceMasterApi.paymentMethodList)
const listCashJournal = computed(() => invoiceMasterApi.cashJournalList)
const userData = computed(() => invoiceLoginApi.userData)
const npwpReportingList = computed(() => invoiceMasterApi.npwpReportingList)

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
  return userData.value?.profile.profileId === 3003 || userData.value?.profile.profileId === 3202
}

const checkVerifikator1 = () => {
  return userData.value?.profile.profileId === 3190
}

const checkInvoiceDp = () => {
  return form.value.invoiceTypeCode === 9012
}

const checkApprovalNonPoProc = () => {
  return checkIsNonPo() && userData.value?.profile.profileId === 3191
}

const checkApprovalNonPoCcAdmin = () => {
  return checkIsNonPo() && userData.value?.profile.profileId === 3190
}

const checkApproval1 = () => {
  return userData.value?.profile.profileId === 3002
}

// const checkApproval3 = () => {
//   return userData.value?.profile.profileId === 3003
// }

const checkNonPoCas = () => {
  return form.value.invoiceTypeCode === 3
}

const checkNonPoLba = () => {
  return form.value.invoiceTypeCode === 4
}

const checkNonPoCc = () => {
  return form.value.invoiceTypeCode === 2
}

const checkNonPoPettyCash = () => {
  return form.value.invoiceTypeCode === 5
}

const disabledInvoiceDate = () => {
  return (!checkIsNonPo() && checkIsAccountingTax()) || checkApprovalNonPoProc() || route.query.isSendSap === 'true'
}

const disabledPostingDate = () => {
  return checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledInvoicingParty = () => {
  return checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledEstimatedPaymentDate = () => {
  return checkVerifikator1() || checkIsAccountingTax() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledTaxDocumentNo = () => {
  return checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledInvoiceVendorNo = () => {
  return checkIsAccountingTax() || checkApprovalNonPoProc() || route.query.isSendSap === 'true'
}

const disabledPaymentMethod = () => {
  return checkIsAccountingTax() || checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledAssignment = () => {
  return checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledTransferNews = () => {
  return checkIsAccountingTax() || checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledNpwpReporting = () => {
  return isNpwrDisabled() || checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin() || route.query.isSendSap === 'true'
}

const disabledDpAmountDeduction = () => {
  return checkVerifikator1() || checkInvoiceDp() || checkApprovalNonPoProc() || route.query.isSendSap === 'true'
}

const disabledDescription = () => {
  return checkVerifikator1() || checkApprovalNonPoProc() || checkApprovalNonPoCcAdmin()
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

watch(
  () => form?.value.cashJournalCode,
  (code) => {
    if (!form?.value) return
    const c = String(code || '')
    const idx = listCashJournal.value.findIndex((item) => item.cashJournalNo === c)
    if (idx !== -1) form.value.cashJournalName = `${listCashJournal.value[idx].cashJournalNo} - ${listCashJournal.value[idx].cashJournalName}`
    else form.value.cashJournalName = ''
  },
)

const isNpwrDisabled = () => {
  if (userData.value && userData.value.profile.profileId === 3002) {
    return true
  } else {
    return false
  }
}

watch(
  () => form,
  () => {
    if (form?.value.paymentMethodCode) {
      const getIndex = paymentMethodList.value.findIndex(
        (item) => item.code === form.value.paymentMethodCode,
      )
      if (getIndex !== -1) form.value.paymentMethodName = paymentMethodList.value[getIndex].name
    }
    if (form?.value.cashJournalCode) {
      const getIndex = listCashJournal.value.findIndex(
        (item) => item.cashJournalNo === form.value.cashJournalCode,
      )
      if (getIndex !== -1) form.value.cashJournalName = listCashJournal.value[getIndex].cashJournalName
    }
    if (form?.value.npwpReporting) {
      const getIndex = npwpReportingList.value.findIndex(
        (item) => item.npwpLocation === form.value.npwpReporting,
      )
      if (getIndex !== -1) form.value.npwpReportingName = npwpReportingList.value[getIndex].npwpDescription
    }
  },
  {
    deep: true,
  },
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  if (form?.value?.companyCode && form?.value?.invoiceTypeCode === 5) {
    invoiceMasterApi.getCashJournal(form.value.companyCode || '')
  }
})

watch(
  () => [form?.value?.companyCode, form?.value?.invoiceTypeCode],
  () => {
    if (form?.value?.companyCode && form?.value?.invoiceTypeCode === 5) {
      invoiceMasterApi.getCashJournal(form.value.companyCode || '')
    }
  },
)
</script>
