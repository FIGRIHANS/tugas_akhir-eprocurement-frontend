<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form">
      <!-- Invoice Type -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Invoice Type </label>
        <!-- Invoice Type always enabled textbox -->
        <input
          v-model="invoiceTypeDisplay"
          class="input"
          placeholder=""
          :disabled="route.query.isSendSap === 'true'"
        />
      </div>
      <!-- Vendor No -->
      <div
        v-if="showVendorNo"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Vendor No.
          <span v-if="vendorRequired" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.vendorId"
          class="input"
          placeholder=""
          :disabled="vendorReadonly || route.query.isSendSap === 'true'"
        />
      </div>

      <!-- Reference - only for Petty Cash (readonly) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Reference </label>
        <input
          v-model="form.reference"
          class="input"
          placeholder="Auto Generated Number"
          disabled
        />
      </div>

      <!-- Cash Journal - only for Petty Cash (active) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Cash Journal </label>
        <input v-model="form.cashJournalCode" class="input" placeholder="" />
      </div>

      <!-- Petty Cash Period - range picker limited to selected month (only for Petty Cash) -->
      <div v-if="isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Petty Cash Period </label>
        <div class="w-full -ml-[15px]">
          <DatePicker
            v-model="form.pettyCashPeriod"
            :range="true"
            :months-to-show="2"
            :min-date="pettyCashMinDate"
            :max-date="pettyCashMaxDate"
            format="yyyy/MM/dd"
            class="w-full"
            teleport
            :disabled="route.query.isSendSap === 'true'"
          />
        </div>
      </div>

      <!-- DP Option -->
      <div
        v-if="form.invoiceTypeCode === 901"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> DP Option </label>
        <input :value="getDpName()" class="input" placeholder="" disabled />
      </div>
      <!-- Submitted Document No. (readonly) for Reimbursement, Credit Card, LBA -->
      <div
        v-if="isReimbursement || isCreditCard || isLBA"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Submitted Document No. </label>
        <input
          v-model="form.invoiceNo"
          class="input"
          placeholder="Auto Generated Number"
          disabled
        />
      </div>

      <!-- Invoice Vendor No. (active only on Non PO / Reimbursement) -->
      <div
        v-if="showInvoiceVendorNo"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Invoice Vendor No.
          <span v-if="invoiceVendorNoRequired" class="text-red-500 ml-[4px]">*</span>
        </label>
        <!-- use existing documentNo field in edit form -->
        <input
          v-model="form.documentNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.documentNoError }"
          :disabled="!invoiceVendorNoEditable || route.query.isSendSap === 'true'"
        />
      </div>

      <!-- Company Code -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Company Code </label>
        <!-- always active textbox for company code -->
        <input
          v-model="form.companyName"
          class="input"
          placeholder=""
          :disabled="route.query.isSendSap === 'true'"
        />
      </div>
      <!-- Invoice No. -->
      <div
        v-if="showInvoiceNo"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Invoice No. </label>
        <input
          v-model="form.invoiceNo"
          class="input"
          placeholder=""
          :disabled="!invoiceNoEditable || route.query.isSendSap === 'true'"
        />
      </div>
      <!-- CAS No. -->
      <div
        v-if="checkNonPoCas() || checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> CAS No. </label>
        <input v-model="form.invoiceNo" class="input" placeholder="" disabled />
      </div>
      <!-- Invoice Date -->
      <div
        v-if="showInvoiceDate && !checkNonPoCas()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Invoice Date
          <span v-if="invoiceDateRequired" class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker
          v-model="form.invoiceDate"
          format="yyyy/MM/dd"
          :disabled="
            !invoiceDateEditable || checkIsAccountingTax() || route.query.isSendSap === 'true'
          "
          :error="form.invoiceDateError"
          class="w-full -ml-[15px]"
          teleport
        />
      </div>
      <!-- Posting Date -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Posting Date
          <span v-if="!checkVerifikator1()" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-if="checkVerifikator1()"
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
          :disabled="route.query.isSendSap === 'true'"
        />
      </div>
      <!-- Invoicing Party -->
      <div
        v-if="!checkNonPoCas() && !checkNonPoLba()"
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
        <input v-model="form.estimatedPaymentDate" class="input" placeholder="" disabled />
        <DatePicker
          v-model="form.estimatedPaymentDate"
          format="yyyy/MM/dd"
          :disabled="checkApproval3()"
          :error="form.estimatedPaymentDateError"
          class="w-full -ml-[15px]"
          teleport
        />
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
      <div
        v-if="showTaxDocumentNo"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Tax Document No. </label>
        <input
          v-model="form.taxNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.taxNoError }"
          :disabled="!taxNoEditable || checkVerifikator1() || route.query.isSendSap === 'true'"
        />
      </div>
      <!-- Invoice Vendor No. -->
      <div
        v-if="showInvoiceVendorNo && !checkNonPoCas() && !checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Invoice Vendor No.
          <span v-if="invoiceVendorNoRequired" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input
          v-model="form.documentNo"
          class="input"
          placeholder=""
          :class="{ 'border-danger': form.documentNoError }"
          :disabled="
            !invoiceVendorNoEditable || checkIsAccountingTax() || route.query.isSendSap === 'true'
          "
        />
      </div>
      <!-- Payment Method -->
      <div
        v-if="!checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
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
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
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
      <div
        v-if="!checkNonPoLba()"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
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
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Currency </label>
        <input :value="form.currCode" class="input" placeholder="" disabled />
      </div>
      <!-- NPWP Reporting -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> NPWP Reporting </label>
        <select
          v-model="form.npwpReporting"
          class="select"
          placeholder=""
          :class="{ 'border-danger': form.npwpReportingError }"
          :disabled="isNpwrDisabled() || checkVerifikator1() || route.query.isSendSap === 'true'"
        >
          <option
            v-for="item of npwpReportingList"
            :key="item.npwpLocation"
            :value="item.npwpLocation"
          >
            {{ item.npwpDescription }}
          </option>
        </select>
      </div>
      <!-- Remaining DP Amount -->
      <div
        v-if="form.invoiceDPCode === 9013"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Remaining DP Amount </label>
        <input v-model="remainingDpAmountVal" class="input" placeholder="" disabled />
      </div>
      <!-- DP Amount Deduction -->
      <div
        v-if="form.invoiceDPCode === 9013"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
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
      <div
        v-if="showRequestor"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Requestor </label>
        <input
          v-model="form.department"
          class="input"
          placeholder=""
          :disabled="!requestorEditable || route.query.isSendSap === 'true'"
        />
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
          :disabled="!descriptionEditable || checkVerifikator1()"
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

const invoiceMasterApi = useInvoiceMasterDataStore()
const invoiceLoginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const route = useRoute()
const typeForm = ref<string>('')

// display value for invoice type textbox (editable always)
const invoiceTypeDisplay = ref<string>('')

const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)
// const currencyList = computed(() => invoiceMasterApi.currency)
const paymentMethodList = computed(() => invoiceMasterApi.paymentMethodList)
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
  return userData.value.profile.profileId === 3003 || userData.value.profile.profileId === 3202
}

const checkVerifikator1 = () => {
  return userData.value.profile.profileId === 3190
}

const checkInvoiceDp = () => {
  return form.value.invoiceTypeCode === 9012
}

const checkApproval3 = () => {
  return userData.value.profile.profileId === 3003
}

const checkNonPoCas = () => {
  return form.value.invoiceTypeCode === 3
}

const checkNonPoLba = () => {
  return form.value.invoiceTypeCode === 3
}

// const checkNonPoCc = () => {
//   return form.value.invoiceTypeCode === 2
// }

// const checkNonPoPettyCash = () => {
//   return form.value.invoiceTypeCode === 5
// }

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
  // initialize invoice type display text
  invoiceTypeDisplay.value = getInvoiceTypeName() || form?.value.invoiceTypeName || ''
})

// Helpers: determine invoice type from route.query.invoiceType or form.invoiceTypeName
const invoiceType = computed(() => {
  // prefer explicit query param: possible values - 'reimbursement','credit_card','cas','lba','petty_cash','no_po'
  if (route.query.invoiceType) return route.query.invoiceType?.toString().toLowerCase()
  // fallback based on codes/names
  const name = form?.value.invoiceTypeName?.toString().toLowerCase() || ''
  if (name.includes('reimbursement')) return 'reimbursement'
  if (name.includes('credit')) return 'credit_card'
  if (name.includes('cas')) return 'cas'
  if (name.includes('lba')) return 'lba'
  if (name.includes('petty')) return 'petty_cash'
  return 'other'
})

// boolean flags per rules
const isReimbursement = computed(
  () => invoiceType.value === 'reimbursement' || invoiceType.value === 'no_po',
)
const isCreditCard = computed(
  () => invoiceType.value === 'credit_card' || form?.value.invoiceTypeCode === 903,
)
const isCAS = computed(
  () =>
    invoiceType.value === 'cas' ||
    form?.value.invoiceTypeName?.toString().toLowerCase().includes('cas'),
)
const isLBA = computed(
  () =>
    invoiceType.value === 'lba' ||
    form?.value.invoiceTypeName?.toString().toLowerCase().includes('lba'),
)
const isPettyCash = computed(
  () =>
    invoiceType.value === 'petty_cash' ||
    form?.value.invoiceTypeName?.toString().toLowerCase().includes('petty'),
)

// Visibility / editable rules derived from user request
const showVendorNo = computed(() => {
  // Vendor No hidden on Petty Cash; shown otherwise for non-po and others
  return !isPettyCash.value
})
const vendorReadonly = computed(() => {
  // readonly on Reimbursement, Credit Card, CAS, and LBA
  return isReimbursement.value || isCreditCard.value || isCAS.value || isLBA.value
})
const vendorRequired = computed(() => isReimbursement.value || isCreditCard.value)

const showInvoiceNo = computed(
  () => isReimbursement.value || invoiceType.value === 'no_po' || isCreditCard.value,
)
const invoiceNoEditable = computed(() => isReimbursement.value || invoiceType.value === 'no_po')

const showInvoiceDate = computed(() => isReimbursement.value || invoiceType.value === 'no_po')
const invoiceDateEditable = computed(() => isReimbursement.value || invoiceType.value === 'no_po')
const invoiceDateRequired = computed(() => invoiceDateEditable.value)

const showTaxDocumentNo = computed(() => isReimbursement.value || isCAS.value || isLBA.value)
const taxNoEditable = computed(() => isReimbursement.value || isCAS.value || isLBA.value)

const showInvoiceVendorNo = computed(() => isReimbursement.value || invoiceType.value === 'no_po')
const invoiceVendorNoEditable = computed(
  () => isReimbursement.value || invoiceType.value === 'no_po',
)
const invoiceVendorNoRequired = computed(() => invoiceVendorNoEditable.value)

const showRequestor = computed(() => !isPettyCash.value)
const requestorEditable = computed(() => !isPettyCash.value)

const descriptionEditable = computed(() => true)

// Petty Cash period limits: show two months (current + next)
const now = new Date()
const pettyCashMinDate = computed(() => new Date(now.getFullYear(), now.getMonth(), 1))
const pettyCashMaxDate = computed(() => new Date(now.getFullYear(), now.getMonth() + 2, 0))

// Submitted Document No mapping uses form.documentNoSubmitted or reuse documentNo (if not present)
// keep original behavior for paymentMethod name mapping
</script>
