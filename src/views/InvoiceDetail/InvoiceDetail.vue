<template>
  <div>
    <Breadcrumb title="Detail Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <hr class="-mx-[24px] mb-[24px]" />
    <StatusInvoice :statusCode="form.statusCode" class="mb-[24px]" />

    <!-- Tab Navigation for ProfileId 3002 (Verifikator) or ProfileId 3200 with Paid status -->
    <TabInvoiceDetail
      v-if="checkApprovalNonPo1() || checkShowPaymentForProfile3200()"
      v-model:activeTab="activeTabDetail"
      :show-payment-status="
        form.statusCode >= 7 || (form.statusCode === 10 && userData?.profile.profileId === 3200)
      "
    />

    <!-- Content for Invoice Data Tab -->
    <div
      v-if="
        (!checkApprovalNonPo1() && !checkShowPaymentForProfile3200()) || activeTabDetail === 'data'
      "
    >
      <div class="flex gap-[24px]">
        <GeneralData class="flex-1" />
        <BankKey class="flex-1" />
      </div>
      <div class="flex gap-[24px] mt-[24px] max-h-[457px]">
        <InvoiceHeaderDocument class="flex-1" />
        <InvoiceCalculation class="flex-1" :formInvoice="form" />
      </div>
      <div v-if="!checkIsNonPo()">
        <InvoicePoGr v-if="checkPo() && !isNonPo" class="mt-[24px]" />
        <InvoiceItem v-if="isNonPo" class="mt-[24px]" />
        <AdditionalCost
          v-if="
            !isNonPo && (checkIsWithoutDp() || checkIsPoPib() || checkIsPoCC() || checkPoWithDp())
          "
          class="mt-[24px]"
        />
      </div>
      <div v-else>
        <ConstExpenses class="mt-[24px]" />
      </div>
    </div>

    <!-- Content for Payment Status Tab (only for user 3002 and statusCode >= 7, or user 3200 with paid status) -->
    <div
      v-if="
        (checkApprovalNonPo1() && form.statusCode >= 7 && activeTabDetail === 'paymentStatus') ||
        (checkShowPaymentForProfile3200() &&
          form.statusCode === 10 &&
          activeTabDetail === 'paymentStatus')
      "
    >
      <PaymentStatusDetail ref="paymentStatusDetailRef" />
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between gap-[8px] mt-[24px]">
      <div class="flex items-center gap-[10px]">
        <button class="btn btn-outline btn-primary" :disabled="isLoading" @click="goBack">
          <i class="ki-filled ki-black-left"></i>
          Back
        </button>
        <button
          v-if="checkEditButton()"
          class="btn btn-primary"
          :disabled="isLoading"
          @click="goToEdit"
        >
          <i class="ki-duotone ki-pencil"></i>
          Edit
        </button>
      </div>
      <!-- Right side actions: show Update Payment Status on Payment Status tab; otherwise default actions -->
      <div
        v-if="activeTabDetail === 'paymentStatus'"
        class="flex items-center justify-end gap-[10px]"
      >
        <button class="btn btn-primary" :disabled="isLoading" @click="handleUpdatePaymentStatus">
          Update Payment Status
        </button>
      </div>
      <div v-else-if="checkStatusCode()" class="flex items-center justify-end gap-[10px]">
        <button class="btn btn-outline btn-danger" :disabled="isLoading" @click="openReject">
          <i class="ki-duotone ki-cross-circle"></i>
          Reject
        </button>
        <button
          class="btn btn-primary flex items-center gap-2"
          :disabled="isLoading"
          @click="goVerif"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </template>
          <template v-else>
            <i class="ki-duotone ki-check-circle"></i>
            {{ route.query.type === '1' ? 'Verify' : 'Approve' }}
          </template>
        </button>
      </div>
    </div>
    <RejectVerification @reject="goReject" />
    <SuccessVerifModal
      :statusCode="detailInvoice?.header.statusCode || detailInvoiceNonPo?.header.statusCode || -1"
      @afterClose="goToList"
    />
    <SuccessRejectModal @afterClose="goToList" />
    <UpdatePaymentStatusModal :isLoading="isUpdatingPaymentStatus" />
    <SapSyncRequiredModal />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, provide, defineAsyncComponent, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { formTypes } from './types/invoiceDetail'
import type { itemsPoGrType } from './types/invoicePoGr'
import type { itemsCostType } from './types/additionalCost'
import type { invoiceItemTypes } from './types/invoiceItem'
import type { documentDetailTypes } from './types/invoiceDocument'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import { KTModal } from '@/metronic/core'
import { useCheckEmpty } from '@/composables/validation'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useLoginStore } from '@/stores/views/login'
import type {
  PostVerificationTypes,
  SubmissionNonPoTypes,
} from '@/stores/views/invoice/types/verification'
import { isEmpty } from 'lodash'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import UpdatePaymentStatusModal from './InvoiceDetail/PaymentStatusDetail/UpdatePaymentStatusModal.vue'
import SapSyncRequiredModal from './InvoiceDetail/PaymentStatusDetail/SapSyncRequiredModal.vue'

const TabInvoiceDetail = defineAsyncComponent(() => import('./InvoiceDetail/TabInvoiceDetail.vue'))
const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
const PaymentStatusDetail = defineAsyncComponent(
  () => import('./InvoiceDetail/PaymentStatusDetail.vue'),
)
const GeneralData = defineAsyncComponent(() => import('./InvoiceDetail/GeneralData.vue'))
const BankKey = defineAsyncComponent(() => import('./InvoiceDetail/BankKey.vue'))
const InvoiceHeaderDocument = defineAsyncComponent(
  () => import('./InvoiceDetail/InvoiceHeaderDocument.vue'),
)
const InvoiceCalculation = defineAsyncComponent(
  () => import('./InvoiceDetail/InvoiceCalculation.vue'),
)
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceDetail/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceDetail/AdditionalCost.vue'))
const ConstExpenses = defineAsyncComponent(() => import('./InvoiceDetail/CostExpenses.vue'))
const InvoiceItem = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceItem.vue'))
const RejectVerification = defineAsyncComponent(
  () => import('./InvoiceDetail/RejectVerification.vue'),
)
const SuccessVerifModal = defineAsyncComponent(
  () => import('./InvoiceDetail/SuccessVerifModal.vue'),
)
const SuccessRejectModal = defineAsyncComponent(
  () => import('./InvoiceDetail/SuccessRejectModal.vue'),
)

const activeStep = ref<string>('')
const activeTabDetail = ref<string>('data')
const router = useRouter()
const route = useRoute()
const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const loginApi = useLoginStore()
const isLoading = ref<boolean>(false)

const currentRouteName = computed(() => {
  return route.name
})

const isNonPo = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval',
  },
  {
    name: 'Detail Invoice',
    to: '/invoice/detail',
  },
])

const form = ref<formTypes>({
  invoiceUId: '',
  invoiceTypeCode: 0,
  invoiceTypeName: '',
  invoiceDPCode: 0,
  invoiceDPName: '',
  companyCode: '',
  companyName: '',
  invoiceNo: '',
  documentNo: '',
  sapInvoiceNo: '',
  clearingDocumentNo: '',
  invoiceDate: '',
  taxNo: '',
  currCode: '',
  notes: '',
  statusCode: 0,
  statusName: '',
  postingDate: '',
  invoicingParty: '',
  estimatedPaymentDate: '',
  paymentMethodCode: '',
  paymentMethodName: '',
  assigment: '',
  transferNews: '',
  npwpReporting: '',
  remainingDpAmount: 0,
  dpAmountDeduction: 0,
  casDateReceipt: '',
  proposalAmount: 0,
  picFinance: '',
  cashJournalCode: '',
  cashJournalName: '',
  pettyCashStartDate: '',
  pettyCashEndDate: '',
  npwpReportingName: '',
  paymentId: 0,
  bankKey: '',
  bankName: '',
  beneficiaryName: '',
  bankAccountNo: '',
  bankCountryCode: '',
  creditCardBillingId: '',
  vendorId: '',
  vendorName: '',
  npwp: '',
  vendorAddress: '',
  subtotal: 0,
  vatAmount: 0,
  whtAmount: 0,
  additionalCost: 0,
  totalGrossAmount: 0,
  totalNetAmount: 0,
  invoicePoGr: [],
  additionalCosts: [],
  invoiceItem: [],
  costExpense: [],
  alternativePayee: [],
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
})

// Payment Status Modal State
const isUpdatingPaymentStatus = ref(false)
const paymentSummary = ref({
  totalInvoice: 0,
  paymentReceived: 0,
  outstanding: 0,
  currency: 'IDR',
  statusCode: 8,
  statusName: 'Planned',
  clearingDocumentNo: '-',
})

// Ref to collect payment details data from child component
interface PaymentDetail {
  no: number
  paymentDate: string
  amount: string
  status: string
  bankAccount: string
  remarks: string
  attachmentDocument?: string
  invoicePaymentDetailId?: number
}

// Template ref to PaymentStatusDetail component
const paymentStatusDetailRef = ref<{
  getPaymentDetailsData: () => Ref<PaymentDetail[]>
  getSubmittedDocumentNo: () => string
} | null>(null)

// Track if SAP Synchronize has been performed
const hasSapSynced = ref<boolean>(false)

// Handle click from footer when on Payment Status tab
const handleUpdatePaymentStatus = async () => {
  // Get payment details from child component via template ref
  const paymentDetailsDataRef = paymentStatusDetailRef.value?.getPaymentDetailsData()
  const paymentDetailsData = paymentDetailsDataRef?.value || []

  // Check if payment details table has data
  if (paymentDetailsData.length === 0) {
    const modalElement = document.querySelector('#sap_sync_required_modal')
    if (modalElement) {
      const modal = KTModal.getInstance(modalElement as HTMLElement)
      modal.show()
    }
    return
  }

  // Calculate payment summary from form data
  const totalInvoice = form.value.totalNetAmount || 0

  // Calculate payment received from payment details where status is 'Paid'
  const paymentReceived =
    paymentDetailsData.length > 0
      ? paymentDetailsData
          .filter((item) => item.status === 'Paid')
          .reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0)
      : 0

  const outstanding = totalInvoice - paymentReceived

  // Determine status code based on payment amounts
  let statusCode = 8 // Planned
  let statusName = 'Planned'

  if (paymentReceived >= totalInvoice && totalInvoice > 0) {
    statusCode = 10 // Paid
    statusName = 'Paid'
  } else if (paymentReceived > 0 && paymentReceived < totalInvoice) {
    statusCode = 9 // Partially Paid
    statusName = 'Partially Paid'
  }

  paymentSummary.value = {
    totalInvoice,
    paymentReceived,
    outstanding,
    currency: form.value.currCode || 'IDR',
    statusCode,
    statusName,
    clearingDocumentNo: form.value.clearingDocumentNo || '-',
  }

  // Call API to update payment status directly
  await handleConfirmPaymentStatus()
}

const handleConfirmPaymentStatus = async () => {
  try {
    isUpdatingPaymentStatus.value = true

    // Get payment details from child component via template ref
    const paymentDetailsDataRef = paymentStatusDetailRef.value?.getPaymentDetailsData()
    const paymentDetailsData = paymentDetailsDataRef?.value || []

    // Prepare payment details for API
    const paymentDetails = paymentDetailsData.map((item) => ({
      invoicePaymentDetailId: item.invoicePaymentDetailId || 0,
      invoiceUId: form.value.invoiceUId,
      paymentDate: item.paymentDate
        ? new Date(item.paymentDate).toISOString()
        : new Date().toISOString(),
      amount: parseFloat(item.amount || '0'),
      paymentStatus: item.status || 'Plan',
      bankAccount: item.bankAccount || '',
      remarks: item.remarks || '',
      documentUrl: item.attachmentDocument || '',
      documentName: item.attachmentDocument || '',
      documentSize: 0,
    }))

    // Get submitted document number from child component
    const submittedDocumentNo = paymentStatusDetailRef.value?.getSubmittedDocumentNo() || ''

    // Save ALL payment status data to sessionStorage for temporary persistence
    const paymentStatusSessionData = {
      submittedDocumentNo: submittedDocumentNo,
      clearingDocumentNo: form.value.clearingDocumentNo || '',
      paymentStatus: paymentSummary.value.statusName,
      statusCode: paymentSummary.value.statusCode,
      paymentDetails: paymentDetailsData,
    }

    sessionStorage.setItem(
      `paymentStatus_${form.value.invoiceUId}`,
      JSON.stringify(paymentStatusSessionData),
    )

    // Prepare payment status data with all required header fields
    const paymentStatusData = {
      header: {
        id: 0,
        invoiceUId: form.value.invoiceUId,
        companyCode: form.value.companyCode || '',
        sapInvoiceNo: form.value.sapInvoiceNo || '',
        submittedDocumentNo: submittedDocumentNo,
        invoicePostingDate: form.value.postingDate
          ? new Date(form.value.postingDate).toISOString()
          : new Date().toISOString(),
        termOfPayment: form.value.paymentMethodName || '',
        estimatedPaymentDate: form.value.estimatedPaymentDate
          ? new Date(form.value.estimatedPaymentDate).toISOString()
          : new Date().toISOString(),
        paymentMethod: form.value.paymentMethodName || '',
        clearingDocumentNo: form.value.clearingDocumentNo || '',
        paymentStatus: paymentSummary.value.statusName,
        statusCode: paymentSummary.value.statusCode,
        statusName: paymentSummary.value.statusName,
        totalAmountInvoice: paymentSummary.value.totalInvoice,
        paymentReceivedAmount: paymentSummary.value.paymentReceived,
        outstandingAmount: paymentSummary.value.outstanding,
        currency: paymentSummary.value.currency,
      },
      detail: paymentDetails,
    }

    // Call API to update payment status
    const response = await verificationApi.updatePaymentStatus(paymentStatusData)

    if (!response.result.isError) {
      const content = response.result.content

      // Update invoice status if changed
      if (content?.header) {
        form.value.statusCode = content.header.statusCode
        form.value.statusName = content.header.statusName
      }

      // Fetch latest payment status data from GET endpoint
      try {
        const latestData = await verificationApi.getPaymentStatus(form.value.invoiceUId)

        // Update form and payment summary with latest data
        if (latestData?.result?.content?.header) {
          const header = latestData.result.content.header

          // Update payment summary
          paymentSummary.value = {
            totalInvoice: header.totalAmountInvoice,
            paymentReceived: header.paymentReceivedAmount,
            outstanding: header.outstandingAmount,
            currency: header.currency,
            statusCode: header.statusCode,
            statusName: header.statusName,
            clearingDocumentNo: header.clearingDocumentNo || '-',
          }

          // Update form fields if they exist
          if (header.estimatedPaymentDate) {
            form.value.estimatedPaymentDate = header.estimatedPaymentDate
          }
          if (header.paymentMethod) {
            form.value.paymentMethodName = header.paymentMethod
          }
          if (header.statusCode) {
            form.value.statusCode = header.statusCode
            form.value.statusName = header.statusName
          }
        }

        // Update payment details in child component after update success
        if (latestData?.result?.content?.detail) {
          const detail = latestData.result.content.detail
          savedPaymentDetailsFromSession.value = detail.map((item, index) => ({
            no: index + 1,
            paymentDate: item.paymentDate,
            amount: item.amount.toString(),
            status: item.paymentStatus,
            bankAccount: item.bankAccount,
            remarks: item.remarks,
            attachmentDocument: item.documentUrl || '',
            invoicePaymentDetailId: item.invoicePaymentDetailId,
          }))
        }
      } catch (fetchError) {
        console.error('Error fetching latest payment status:', fetchError)
      }

      // Show success modal
      const modalElement = document.querySelector('#update_payment_status_modal')
      if (modalElement) {
        const modal = KTModal.getInstance(modalElement as HTMLElement)
        modal.show()
      }
    } else {
      console.error('Failed to update payment status:', response.result.message)
    }
  } catch (error: unknown) {
    const errorWithResponse = error as {
      response?: { data?: { result?: { message?: string }; message?: string } }
    }
    const backendMessage =
      errorWithResponse?.response?.data?.result?.message ||
      errorWithResponse?.response?.data?.message
    const errorDetail = errorWithResponse?.response?.data
    console.error('Error updating payment status:', errorDetail || error)
    console.error('Full error object:', error)
    if (backendMessage) console.error('Backend message:', backendMessage)
  } finally {
    isUpdatingPaymentStatus.value = false
  }
}

// Provide form data for child components (Payment Status components)
provide('form', form)

// Provide submittedDocumentNo for PaymentInformation component
const submittedDocumentNo = ref<string>('')
provide('submittedDocumentNo', submittedDocumentNo)

// Provide hasSapSynced for PaymentDetails component
provide('hasSapSynced', hasSapSynced)

// Provide paymentSummary for child components
provide('paymentSummary', paymentSummary)

// Provide savedPaymentDetailsFromSession for PaymentDetails component to restore table
const savedPaymentDetailsFromSession = ref<PaymentDetail[]>([])
provide('savedPaymentDetailsFromSession', savedPaymentDetailsFromSession)

const detailInvoice = computed(() => verificationApi.detailInvoice)
const detailInvoiceNonPo = computed(() => verificationApi.detailNonPoInvoice)
const userData = computed(() => loginApi.userData)
const additionalCostTempDelete = computed(() => verificationApi.additionalCostTempDelete)
const costExpensesTempDelete = computed(() => verificationApi.costExpenseTempDelete)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const checkIsNonPo = () => {
  return route.query.invoiceType === 'no_po'
}

const checkVerifikator1 = () => {
  return userData.value?.profile?.profileId === 3190
}

const checkApprovalNonPo1 = () => {
  return userData.value?.profile.profileId === 3002
}

const checkShowPaymentForProfile3200 = () => {
  return userData.value?.profile.profileId === 3200 && form.value.statusCode === 10
}

const checkApprovalNonPoProc = () => {
  return route.query.invoiceType === 'no_po' && userData.value?.profile.profileId === 3191
}

const checkApprovalNonPoCcAdmin = () => {
  return route.query.invoiceType === 'no_po' && userData.value?.profile.profileId === 3190
}

const checkIsWithoutDp = () => {
  return form.value.invoiceDPCode === 9011
}

const checkPoWithDp = () => {
  return form.value.invoiceDPCode === 9013
}

const checkIsPoPib = () => {
  return form.value.invoiceTypeCode === 902
}

const checkIsPoCC = () => {
  return form.value.invoiceTypeCode === 903
}

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

const checkStatusCode = () => {
  let status = true
  switch (form.value.statusCode) {
    case 4:
    case 5:
    case 7:
      status = false
      break
  }

  if (form.value.statusCode === 2 && route.query.type === '1') status = false

  status = checkWorkflow()

  return status
}

const checkEditButton = () => {
  let status = true
  switch (form.value.statusCode) {
    case 4:
    case 5:
    case 7:
      status = false
      break
  }

  if (form.value.statusCode === 2 && route.query.type === '1') status = false

  status = checkWorkflow()

  if (route.query.type === '1' && checkIsNonPo()) status = false

  return status
}

const checkWorkflow = () => {
  let getWf = []

  if (currentRouteName.value !== 'invoiceDetail') {
    getWf = detailInvoiceNonPo.value?.workflow || []
  } else {
    getWf = detailInvoice.value?.workflow || []
  }

  const getProfileId = userData.value?.profile.profileId

  const checkIndex = getWf?.findIndex((item) => item.profileId === getProfileId)

  if (checkIndex !== -1) {
    if (
      getWf[checkIndex].stateCode === 3 ||
      getWf[checkIndex].stateCode === 4 ||
      getWf[checkIndex].stateCode === 5
    )
      return false
    else return true
  } else return true
}

const goToEdit = () => {
  router.push({
    name: 'invoiceDetailEdit',
    query: {
      id: route.query.id,
      type: route.query.type,
      invoiceType: route.query.invoiceType,
    },
  })
}

const openReject = () => {
  const idModal = document.querySelector('#reject_verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkPo = () => {
  return (
    form.value.invoiceTypeCode === 901 ||
    form.value.invoiceTypeCode === 902 ||
    form.value.invoiceTypeCode === 903
  )
}

const checkVerifHeader = () => {
  if (checkApprovalNonPoProc()) return true

  const invoiceDateError = !checkNonPoPettyCash()
    ? useCheckEmpty(form.value.invoiceDate).isError
    : false
  const documentNoError =
    !checkNonPoCas() && !checkNonPoPettyCash() && !checkNonPoLba()
      ? useCheckEmpty(form.value.documentNo).isError
      : false
  const creditCardBillingError = checkVerifikator1()
    ? useCheckEmpty(form.value.creditCardBillingId).isError
    : false

  const postingDateError =
    !checkVerifikator1() && !checkNonPoPettyCash() && !checkNonPoCc()
      ? useCheckEmpty(form.value.postingDate).isError
      : false
  const estimatedPaymentDateError =
    (!checkVerifikator1() && !checkNonPoLba()) ||
    (checkNonPoPettyCash() && checkApprovalNonPo1() && !checkNonPoCc())
      ? useCheckEmpty(form.value.estimatedPaymentDate).isError
      : false
  const paymentMethodError =
    !checkVerifikator1() &&
    !checkNonPoPettyCash() &&
    !checkApprovalNonPoCcAdmin() &&
    !checkNonPoLba()
      ? useCheckEmpty(form.value.paymentMethodCode).isError
      : false
  const transferNewsError =
    !checkVerifikator1() && !checkNonPoPettyCash() && !checkNonPoCc() && !checkNonPoLba()
      ? useCheckEmpty(form.value.transferNews).isError
      : false
  const notesError =
    !checkVerifikator1() && !checkApprovalNonPoCcAdmin()
      ? useCheckEmpty(form.value.notes).isError
      : false

  const taxInvoiceError = checkNonPoCas() ? useCheckEmpty(form.value.taxNo).isError : false
  const npwpReportingError =
    (checkNonPoCas() ||
      (checkNonPoCc() && !checkApprovalNonPoProc() && !checkApprovalNonPoCcAdmin())) &&
    !checkApprovalNonPo1()
      ? useCheckEmpty(form.value.npwpReporting).isError
      : false

  const cashJournalCodeError = checkNonPoPettyCash()
    ? useCheckEmpty(form.value.cashJournalCode).isError
    : false
  const pettyCashPeriodError = checkNonPoPettyCash()
    ? useCheckEmpty(form.value.pettyCashStartDate).isError ||
      useCheckEmpty(form.value.pettyCashEndDate).isError
    : false

  const proposalAmountError =
    !checkApprovalNonPoCcAdmin() && checkNonPoCc()
      ? useCheckEmpty(form.value.proposalAmount).isError
      : false

  if (
    invoiceDateError ||
    postingDateError ||
    estimatedPaymentDateError ||
    documentNoError ||
    paymentMethodError ||
    transferNewsError ||
    creditCardBillingError ||
    notesError ||
    taxInvoiceError ||
    npwpReportingError ||
    cashJournalCodeError ||
    pettyCashPeriodError ||
    proposalAmountError
  )
    return false
  return true
}

const checkVerif = () => {
  let status = true
  status = checkVerifHeader()

  return status
}

// const checkVerifNonPo = () => {
//   let status = true
//   status = checkVerifHeader()

//   return status
// }

const mapPoGr = () => {
  const poGr = []
  for (const item of form.value.invoicePoGr) {
    poGr.push({
      id: item.id,
      poNo: item.poNo,
      poItem: Number(item.poItem),
      grDocumentNo: item.grDocumentNo,
      itemText: item.itemText,
      itemAmount: Number(item.itemAmount),
      uom: item.uom,
      quantity: Number(item.quantity),
      taxCode: item.taxCode,
      vatAmount: item.vatAmount,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: item.whtBaseAmount,
      whtAmount: item.whtAmount,
    })
  }
  return poGr
}

const mapAdditionalCost = () => {
  const cost = []
  for (const item of form.value.additionalCosts) {
    // Safe type casting untuk mengakses itemText property
    const itemRecord = item as unknown as Record<string, unknown>
    const itemText =
      typeof itemRecord['itemText'] === 'string' ? (itemRecord['itemText'] as string) : ''
    cost.push({
      id: item.id,
      activityId: item.activityId,
      activityExpense: item.activityExpense,
      activityName: item.activityName,
      itemAmount: Number(item.itemAmount),
      debitCredit: item.debitCredit,
      taxCode: item.taxCode,
      itemText: itemText,
      vatAmount: item.vatAmount,
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: Number(item.whtBaseAmount),
      whtAmount: item.whtAmount,
    })
  }
  return cost
}

const mapCostExpenses = () => {
  const cost = []

  for (const item of form.value.costExpense) {
    cost.push({
      id: item.id,
      activityId: item.activityId,
      activityExpenses: item.activityExpenses,
      activityName: item.activityName,
      itemAmount: item.itemAmount,
      itemText: item.itemText,
      debitCredit: item.debitCredit,
      taxCode: item.taxCode,
      vatAmount: item.vatAmount,
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: item.whtBaseAmount,
      whtAmount: item.whtAmount,
    })
  }
  return cost
}
const mapDataVerif = () => {
  const invoiceDoc = form.value.invoiceDocument || {}
  const taxDoc = form.value.tax || {}
  const referenceDoc = form.value.referenceDocument || {}
  const otherDoc = form.value.otherDocument || {}
  const documents = []
  if (!isEmpty(invoiceDoc)) documents.push(invoiceDoc)
  if (!isEmpty(taxDoc)) documents.push(taxDoc)
  if (!isEmpty(referenceDoc)) documents.push(referenceDoc)
  if (!isEmpty(otherDoc)) documents.push(otherDoc)
  const data = {
    statusCode: route.query.type === '1' ? 3 : 4,
    statusName: route.query.type === '1' ? 'Verified' : 'Approved',
    statusNotes: '',
    header: {
      invoiceUId: form.value.invoiceUId,
      documentNo: form.value.documentNo,
      invoiceDate: form.value.invoiceDate || null,
      taxNo: form.value.taxNo,
      currCode: form.value.currCode,
      notes: form.value.notes,
      postingDate: form.value.postingDate || null,
      invoicingParty: form.value.invoicingParty,
      estimatedPaymentDate: form.value.estimatedPaymentDate || null,
      paymentMethodCode: form.value.paymentMethodCode,
      paymentMethodName: form.value.paymentMethodName,
      assigment: form.value.assigment,
      transferNews: form.value.transferNews,
      npwpReporting: form.value.npwpReporting,
      creditCardBillingID: form.value.creditCardBillingId,
    },
    payment: {
      paymentId: form.value.paymentId,
      bankKey: form.value.bankKey,
      bankName: form.value.bankName,
      beneficiaryName: form.value.beneficiaryName,
      bankAccountNo: form.value.bankAccountNo,
      bankCountryCode: form.value.bankCountryCode,
    },
    calculation: {
      subtotal: form.value.subtotal,
      vatAmount: form.value.vatAmount,
      whtAmount: form.value.whtAmount,
      additionalCost: form.value.additionalCost,
      totalGrossAmount: form.value.totalGrossAmount,
      totalNetAmount: form.value.totalNetAmount,
    },
    documents,
    pogr: mapPoGr(),
    additionalCosts: mapAdditionalCost(),
  } as PostVerificationTypes

  return data
}

const mapDataVerifNonPo = () => {
  const invoiceDoc = form.value.invoiceDocument || {}
  const taxDoc = form.value.tax || {}
  const referenceDoc = form.value.referenceDocument || {}
  const otherDoc = form.value.otherDocument || {}
  const documents = []
  if (!isEmpty(invoiceDoc)) documents.push(invoiceDoc)
  if (!isEmpty(taxDoc)) documents.push(taxDoc)
  if (!isEmpty(referenceDoc)) documents.push(referenceDoc)
  if (!isEmpty(otherDoc)) documents.push(otherDoc)

  const alt = form.value.alternativePayee?.[0] // FIX: aman saat array kosong

  const data = {
    statusCode: route.query.type === '1' ? 3 : 4,
    statusName: route.query.type === '1' ? 'Verified' : 'Approved',
    statusNotes: '',
    header: {
      invoiceUId: form.value.invoiceUId,
      invoiceDate: form.value.invoiceDate || null,
      postingDate: form.value.postingDate || null,
      documentNo: form.value.documentNo,
      taxNo: form.value.taxNo,
      invoicingParty: form.value.invoicingParty,
      estimatedPaymentDate: form.value.estimatedPaymentDate || null,
      paymentMethodCode: form.value.paymentMethodCode,
      paymentMethodName: form.value.paymentMethodName,
      assigment: form.value.assigment,
      transferNews: form.value.transferNews,
      notes: form.value.notes,
      currCode: form.value.currCode,
      creditCardBillingId: form.value.creditCardBillingId,
      npwpReporting: form.value.npwpReporting,
      department: form.value.department,
      casDateReceipt: form.value.casDateReceipt || null,
      proposalAmount: form.value.proposalAmount,
      picFinance: form.value.picFinance,
      cashJournalCode: form.value.cashJournalCode,
      cashJournalName: form.value.cashJournalName,
      pettyCashStartDate: form.value.pettyCashStartDate || null,
      pettyCashEndDate: form.value.pettyCashEndDate || null,
      npwpReportingName: form.value.npwpReportingName,
    },
    payment: {
      paymentId: form.value.paymentId,
      bankKey: form.value.bankKey,
      bankName: form.value.bankName,
      beneficiaryName: form.value.beneficiaryName,
      bankAccountNo: form.value.bankAccountNo,
      bankCountryCode: form.value.bankCountryCode,
    },
    calculation: {
      subtotal: form.value.subtotal,
      vatAmount: form.value.vatAmount,
      whtAmount: form.value.whtAmount,
      additionalCost: form.value.additionalCost,
      totalGrossAmount: form.value.totalGrossAmount,
      totalNetAmount: form.value.totalNetAmount,
    },
    // FIX: hanya set alternativePay kalau ada datanya (hindari akses [0] undefined)
    ...(alt
      ? {
          alternativePay: {
            id: alt.id,
            invoiceUId: form.value.invoiceUId,
            name: alt.name,
            name2: alt.name2,
            street: alt.street,
            city: alt.city,
            country: alt.country,
            bankAccountNumber: alt.bankAccountNumber,
            bankKey: alt.bankKey,
            bankCountry: alt.bankCountry,
            npwp: alt.npwp,
            ktp: alt.ktp,
            email: alt.email,
            isAlternativePayee: alt.isAlternativePayee,
            isOneTimeVendor: alt.isOneTimeVendor,
          },
        }
      : {}),
    costExpenses: mapCostExpenses(),
    documents,
  } as SubmissionNonPoTypes

  return data
}

const goVerif = () => {
  if (route.query.invoiceType === 'no_po' && route.query.type === '1') {
    isLoading.value = true
    verificationApi
      .verifyInvoiceNonPo(form.value.invoiceUId)
      .then((res) => {
        if (res.statusCode === 200) {
          verificationApi.resetDetailInvoiceEdit()
          const idModal = document.querySelector('#success_verif_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
          for (const item of costExpensesTempDelete.value) {
            verificationApi.deleteCostExpense(form.value.invoiceUId, item)
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        isLoading.value = false
        verificationApi.isFromEdit = false
      })
  } else if (!checkIsNonPo()) {
    const status = checkVerif()
    if (!status) return
    isLoading.value = true
    verificationApi
      .postSubmission(mapDataVerif())
      .then((response) => {
        if (response.statusCode === 200) {
          verificationApi.resetDetailInvoiceEdit()
          const idModal = document.querySelector('#success_verif_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
          for (const item of additionalCostTempDelete.value) {
            verificationApi.deleteAdditionalCost(form.value.invoiceUId, item)
          }
        }
      })
      .finally(() => {
        isLoading.value = false
        verificationApi.isFromEdit = false
      })
  } else {
    const status = checkVerif()
    if (!status) return

    isLoading.value = true
    verificationApi
      .postSubmissionNonPo(mapDataVerifNonPo() as unknown as PostVerificationTypes)
      .then((response) => {
        if (response.statusCode === 200) {
          verificationApi.resetDetailInvoiceEdit()
          const idModal = document.querySelector('#success_verif_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
          for (const item of costExpensesTempDelete.value) {
            verificationApi.deleteCostExpense(form.value.invoiceUId, item)
          }
        }
      })
      .finally(() => {
        isLoading.value = false
        verificationApi.isFromEdit = false
      })
  }
}

const goReject = (reason: string) => {
  verificationApi.isRejectLoading = true
  if (route.query.invoiceType === 'no_po') {
    verificationApi
      .postRejectNonPo({
        invoiceUId: form.value.invoiceUId,
        notes: reason,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          const idModal = document.querySelector('#success_reject_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
        }
      })
      .finally(() => {
        verificationApi.isRejectLoading = false
      })
  } else {
    verificationApi
      .postReject({
        invoiceUId: form.value.invoiceUId,
        notes: reason,
      })
      .then((response) => {
        if (response.statusCode === 200) {
          const idModal = document.querySelector('#success_reject_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
        }
      })
      .finally(() => {
        verificationApi.isRejectLoading = false
      })
  }
}

const goToList = () => {
  if (route.query.invoiceType === 'no_po' || currentRouteName.value !== 'invoiceDetail') {
    router.push({
      name: route.query.type === '1' ? 'invoiceVerificationNoPo' : 'invoiceApprovalNonPo',
    })
  } else {
    router.push({
      name: route.query.type === '1' ? 'invoiceVerification' : 'invoiceApproval',
    })
  }
}

const goBack = () => {
  if (route.query.type === '1') {
    if (route.query.invoiceType === 'no_po') {
      router.push({
        name: 'invoiceVerificationNoPo',
      })
    } else {
      router.push({
        name: 'invoiceVerification',
      })
    }
  } else {
    if (!checkPo()) {
      router.push({
        name: 'invoiceApprovalNonPo',
      })
    } else {
      router.push({
        name: 'invoiceApproval',
      })
    }
  }
  // } else if (route.query.type === '2' && !checkPo()) {
  //   router.push({
  //     name: 'invoiceApprovalNonPo',
  //   })
  // } else if (!checkPo()) {
  //   router.push({
  //     name: 'invoice-list-non-po',
  //   })
  // }
}

const callWhtCode = async (whtType: string) => {
  await invoiceMasterApi.getWhtCode(whtType)
}

const setDataDefault = async () => {
  const data = detailInvoice.value
  const resultPoGr: itemsPoGrType[] = []
  const resultAdditional: itemsCostType[] = []
  let invoice = {} as documentDetailTypes
  let tax = {} as documentDetailTypes
  let reference = {} as documentDetailTypes
  let other = {} as documentDetailTypes

  for (const item of data?.pogr || []) {
    if (item.whtType) await callWhtCode(item.whtType)
    resultPoGr.push({
      ...item,
      whtCodeList: item.whtType ? whtCodeList.value : [],
    })
  }

  for (const item of data?.additionalCosts || []) {
    if (item.whtType) await callWhtCode(item.whtType)
    resultAdditional.push({
      ...item,
      activityExpense: item.activityExpense,
      itemText: '',
      whtCodeList: item.whtType ? whtCodeList.value : [],
    })
  }

  for (const item of data?.documents || []) {
    switch (item.documentType) {
      case 1:
        invoice = item
        break
      case 2:
        tax = item
        break
      case 3:
        reference = item
        break
      case 4:
        other = item
        break
    }
  }

  form.value = {
    invoiceUId: data?.header.invoiceUId || '',
    invoiceTypeCode: data?.header.invoiceTypeCode || 0,
    invoiceTypeName: data?.header.invoiceTypeName || '',
    invoiceDPCode: data?.header.invoiceDPCode || 0,
    invoiceDPName: data?.header.invoiceDPName || '',
    companyCode: data?.header.companyCode || '',
    companyName: data?.header.companyName || '',
    invoiceNo: data?.header.invoiceNo || '',
    documentNo: data?.header.documentNo || '',
    sapInvoiceNo: data?.header.sapInvoiceNo || '',
    clearingDocumentNo: data?.header.clearingDocumentNo || '',
    invoiceDate: data?.header.invoiceDate || '',
    taxNo: data?.header.taxNo || '',
    currCode: data?.header.currCode || '',
    notes: data?.header.notes || '',
    statusCode: data?.header.statusCode || 0,
    statusName: data?.header.statusName || '',
    postingDate: data?.header.postingDate || '',
    invoicingParty: data?.header.invoicingParty || '',
    estimatedPaymentDate: data?.header.estimatedPaymentDate || '',
    paymentMethodCode: data?.header.paymentMethodCode || '',
    paymentMethodName: data?.header.paymentMethodName || '',
    assigment: data?.header.assigment || '',
    transferNews: data?.header.transferNews || '',
    npwpReporting: data?.header.npwpReporting || '',
    remainingDpAmount: data?.header.remainingDPAmount || 0,
    dpAmountDeduction: data?.header.dpAmountDeduction || 0,
    casDateReceipt: data?.header.casDateReceipt || '',
    proposalAmount: data?.header.proposalAmount || 0,
    picFinance: data?.header.picFinance || '',
    cashJournalCode: data?.header.cashJournalCode || '',
    cashJournalName: data?.header.cashJournalName || '',
    pettyCashStartDate: data?.header.pettyCashStartDate || '',
    pettyCashEndDate: data?.header.pettyCashEndDate || '',
    npwpReportingName: data?.header.npwpReportingName || '',
    paymentId: data?.payment.paymentId || 0,
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    creditCardBillingId: data?.header.creditCardBillingID || '',
    beneficiaryName: data?.payment.beneficiaryName || '',
    bankAccountNo: data?.payment.bankAccountNo || '',
    bankCountryCode: data?.payment.bankCountryCode || '',
    vendorId: data?.vendor.vendorId != null ? String(data.vendor.vendorId) : '',
    vendorName: data?.vendor.vendorName || '',
    npwp: data?.vendor.npwp || '',
    vendorAddress: data?.vendor.vendorAddress || '',
    subtotal: data?.calculation.subtotal || 0,
    vatAmount: data?.calculation.vatAmount || 0,
    whtAmount: data?.calculation.whtAmount || 0,
    additionalCost: data?.calculation.additionalCost || 0,
    totalGrossAmount: data?.calculation.totalGrossAmount || 0,
    totalNetAmount: data?.calculation.totalNetAmount || 0,
    invoicePoGr: resultPoGr,
    additionalCosts: resultAdditional,
    invoiceItem: [],
    costExpense: [],
    alternativePayee: [],
    invoiceDocument: invoice,
    tax: tax,
    referenceDocument: reference,
    otherDocument: other,
  }
}

const setDataDefaultNonPo = () => {
  const data = detailInvoiceNonPo.value
  const resultAdditional: invoiceItemTypes[] = []

  // FIX: pakai tipe yang konsisten dengan formTypes (tanpa import type lain)
  let alternativePaeeValue: formTypes['alternativePayee'][number] | null = null

  const alt = data?.alternativePayee?.[0]
  if (alt) {
    alternativePaeeValue = {
      id: alt.id,
      name: alt.name,
      name2: alt.name2,
      street: alt.street,
      city: alt.city,
      country: alt.country,
      bankAccountNumber: alt.bankAccountNumber,
      bankKey: alt.bankKey,
      bankCountry: alt.bankCountry,
      npwp: alt.npwp,
      ktp: alt.ktp,
      email: alt.email,
      isAlternativePayee: alt.isAlternativePayee,
      isOneTimeVendor: alt.isOneTimeVendor,
    }
  }

  for (const item of data?.costExpense || []) {
    resultAdditional.push({
      id: item.id,
      activityId: item.activityId,
      activityExpenses: item.activityExpenses,
      activityName: item.activityName,
      itemText: item.itemText,
      itemAmount: item.itemAmount,
      debitCredit: item.debitCredit,
      taxCode: item.taxCode,
      vatAmount: item.vatAmount,
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: item.whtBaseAmount,
      whtAmount: item.whtAmount,
      whtCodeList: [],
      isEdit: false,
    })
  }

  let invoice = {} as documentDetailTypes
  let tax = {} as documentDetailTypes
  let reference = {} as documentDetailTypes
  let other = {} as documentDetailTypes

  for (const item of data?.documents || []) {
    switch (item.documentType) {
      case 1:
        invoice = item
        break
      case 2:
        tax = item
        break
      case 3:
        reference = item
        break
      case 4:
        other = item
        break
    }
  }

  form.value = {
    invoiceUId: data?.header.invoiceUId || '',
    invoiceTypeCode: data?.header.invoiceTypeCode || 0,
    invoiceTypeName: data?.header.invoiceTypeName || '',
    invoiceDPCode: data?.header.invoiceDPCode || 0,
    invoiceDPName: data?.header.invoiceDPName || '',
    companyCode: data?.header.companyCode || '',
    companyName: data?.header.companyName || '',
    invoiceNo: data?.header.invoiceNo || '',
    documentNo: data?.header.documentNo || '',
    sapInvoiceNo: data?.header.sapInvoiceNo || '',
    clearingDocumentNo: data?.header.clearingDocumentNo || '',
    invoiceDate: data?.header.invoiceDate || '',
    taxNo: data?.header.taxNo || '',
    currCode: data?.header.currCode || '',
    notes: data?.header.notes || '',
    statusCode: data?.header.statusCode || 0,
    statusName: data?.header.statusName || '',
    postingDate: data?.header.postingDate || '',
    invoicingParty: data?.header.invoicingParty || '',
    estimatedPaymentDate: data?.header.estimatedPaymentDate || '',
    paymentMethodCode: data?.header.paymentMethodCode || '',
    paymentMethodName: data?.header.paymentMethodName || '',
    assigment: data?.header.assigment || '',
    transferNews: data?.header.transferNews || '',
    npwpReporting: data?.header.npwpReporting || '',
    department: data?.header.department,
    remainingDpAmount: data?.header.remainingDPAmount || 0,
    dpAmountDeduction: data?.header.dpAmountDeduction || 0,
    casDateReceipt: data?.header.casDateReceipt || '',
    proposalAmount: data?.header.proposalAmount || 0,
    picFinance: data?.header.picFinance || '',
    cashJournalCode: data?.header.cashJournalCode || '',
    cashJournalName: data?.header.cashJournalName || '',
    pettyCashStartDate: data?.header.pettyCashStartDate || '',
    pettyCashEndDate: data?.header.pettyCashEndDate || '',
    npwpReportingName: data?.header.npwpReportingName || '',
    paymentId: data?.payment.paymentId || 0,
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    creditCardBillingId: data?.header.creditCardBillingID || '',
    beneficiaryName: data?.payment.beneficiaryName || '',
    bankAccountNo: data?.payment.bankAccountNo || '',
    bankCountryCode: data?.payment.bankCountryCode || '',
    vendorId: data?.vendor.vendorId != null ? String(data.vendor.vendorId) : '',
    vendorName: data?.vendor.vendorName || '',
    npwp: data?.vendor.npwp || '',
    vendorAddress: data?.vendor.vendorAddress || '',
    subtotal: data?.calculation.subtotal || 0,
    vatAmount: data?.calculation.vatAmount || 0,
    whtAmount: data?.calculation.whtAmount || 0,
    additionalCost: data?.calculation.additionalCost || 0,
    totalGrossAmount: data?.calculation.totalGrossAmount || 0,
    totalNetAmount: data?.calculation.totalNetAmount || 0,
    invoicePoGr: [],
    additionalCosts: [],
    costExpense: resultAdditional,
    alternativePayee: alternativePaeeValue ? [alternativePaeeValue] : [],
    invoiceItem: [],
    invoiceDocument: invoice,
    tax: tax,
    referenceDocument: reference,
    otherDocument: other,
  }
}

const setDataEdit = () => {
  const data = verificationApi.detailInvoiceEdit
  const mappedAdditional = (data?.additionalCosts || []).map((item) => {
    const itemRecord = item as unknown as Record<string, unknown>
    return {
      ...item,
      itemText:
        typeof itemRecord['itemText'] === 'string' ? (itemRecord['itemText'] as string) : '',
      whtCodeList: item.whtType ? whtCodeList.value : [],
    }
  })

  const mappedCostExpenses = (data?.costExpenses || []).map((item) => {
    const itemRecord = item as unknown as Record<string, unknown>
    return {
      ...item,
      itemText:
        typeof itemRecord['itemText'] === 'string' ? (itemRecord['itemText'] as string) : '',
      isEdit: false,
      whtCodeList: item.whtType ? whtCodeList.value : [],
    }
  })

  form.value = {
    invoiceUId: data?.invoiceUId || '',
    invoiceTypeCode: data?.invoiceTypeCode || 0,
    invoiceTypeName: data?.invoiceTypeName || '',
    invoiceDPCode: data?.invoiceDPCode || 0,
    invoiceDPName: data?.invoiceDPName || '',
    companyCode: data?.companyCode || '',
    companyName: data?.companyName || '',
    invoiceNo: data?.invoiceNo || '',
    documentNo: data?.documentNo || '',
    sapInvoiceNo: data?.sapInvoiceNo || '',
    clearingDocumentNo: data?.clearingDocumentNo || '',
    invoiceDate: data?.invoiceDate || '',
    taxNo: data?.taxNo || '',
    currCode: data?.currCode || '',
    notes: data?.notes || '',
    statusCode: data?.statusCode || 0,
    statusName: data?.statusName || '',
    postingDate: data?.postingDate || '',
    invoicingParty: data?.invoicingParty || '',
    estimatedPaymentDate: data?.estimatedPaymentDate || '',
    paymentMethodCode: data?.paymentMethodCode || '',
    paymentMethodName: data?.paymentMethodName || '',
    assigment: data?.assigment || '',
    transferNews: data?.transferNews || '',
    npwpReporting: data?.npwpReporting || '',
    remainingDpAmount: data?.remainingDpAmount || 0,
    dpAmountDeduction: data?.dpAmountDeduction || 0,
    department: data?.department,
    creditCardBillingId: data?.creditCardBillingId || '',
    casDateReceipt: data?.casDateReceipt || '',
    proposalAmount: data?.proposalAmount || 0,
    picFinance: data?.picFinance || '',
    cashJournalCode: data?.cashJournalCode || '',
    cashJournalName: data?.cashJournalName || '',
    pettyCashStartDate: data?.pettyCashStartDate || '',
    pettyCashEndDate: data?.pettyCashEndDate || '',
    npwpReportingName: data?.npwpReportingName || '',
    paymentId: data?.paymentId || 0,
    bankKey: data?.bankKey || '',
    bankName: data?.bankName || '',
    beneficiaryName: data?.beneficiaryName || '',
    bankAccountNo: data?.bankAccountNo || '',
    bankCountryCode: data?.bankCountryCode || '',
    vendorId: data?.vendorId || '',
    vendorName: data?.vendorName || '',
    npwp: data?.npwp || '',
    vendorAddress: data?.vendorAddress || '',
    subtotal: data?.subtotal || 0,
    vatAmount: data?.vatAmount || 0,
    whtAmount: data?.whtAmount || 0,
    additionalCost: data?.additionalCost || 0,
    totalGrossAmount: data?.totalGrossAmount || 0,
    totalNetAmount: data?.totalNetAmount || 0,
    invoicePoGr: data?.invoicePoGr || [],
    additionalCosts: mappedAdditional,
    invoiceItem: [],
    costExpense: mappedCostExpenses,
    alternativePayee:
      data && data.isAlternativePayee
        ? [
            {
              id: data.idAlternative || 0,
              name: data.name || '',
              name2: data.name2 || '',
              street: data.street || '',
              city: data.city || '',
              country: data.country || '',
              bankAccountNumber: data.bankAccountNumber || '',
              bankKey: data.bankKeyAlternative || '',
              bankCountry: data.bankCountry || '',
              npwp: data.npwpAlternative || '',
              ktp: data.ktp || '',
              email: data.email || '',
              isAlternativePayee: !!data.isAlternativePayee,
              isOneTimeVendor: !!data.isOneTimeVendor,
            },
          ]
        : [],
    invoiceDocument: data?.invoiceDocument || null,
    tax: data?.tax || null,
    referenceDocument: data?.referenceDocument || null,
    otherDocument: data?.otherDocument || null,
  }
}

const afterGetDetail = () => {
  if (verificationApi.isFromEdit) {
    setDataEdit()
  } else {
    setDataDefault()
  }

  const statusCode = detailInvoice.value?.header.statusCode ?? -1

  if (statusCode === 0 || statusCode === 1 || statusCode === 5) {
    // Draft / Submitted / Rejected
    activeStep.value = 'Submission'
  } else if (statusCode === 2) {
    // Verified
    activeStep.value = 'Verification'
  } else if (statusCode === 3 || statusCode === 4) {
    // Waiting for Approval / Approved
    activeStep.value = 'Approval'
  } else if (statusCode === 6) {
    // Posted to SAP
    activeStep.value = 'Posting'
  } else if (statusCode >= 7) {
    // Sent to SAP dan status Payment Status (7,8,9,10,...)
    activeStep.value = 'Status'
  } else {
    activeStep.value = 'Submission'
  }
}

const afterGetDetailNonPo = () => {
  if (verificationApi.isFromEdit) {
    setDataEdit()
  } else {
    setDataDefaultNonPo()
  }

  const statusCode = detailInvoiceNonPo.value?.header.statusCode ?? -1

  if (statusCode === 0 || statusCode === 1 || statusCode === 5) {
    activeStep.value = 'Submission'
  } else if (statusCode === 2) {
    activeStep.value = 'Verification'
  } else if (statusCode === 3 || statusCode === 4) {
    activeStep.value = 'Approval'
  } else if (statusCode === 6) {
    activeStep.value = 'Posting'
  } else if (statusCode >= 7) {
    activeStep.value = 'Status'
  } else {
    activeStep.value = 'Submission'
  }
}

watch(
  () => activeTabDetail.value,
  async (newTab) => {
    if (
      newTab === 'paymentStatus' &&
      route.query.type === '2' &&
      (checkApprovalNonPo1() || checkShowPaymentForProfile3200()) &&
      form.value.statusCode >= 7
    ) {
      try {
        const response = await verificationApi.getPaymentStatus(form.value.invoiceUId)
        if (response?.result?.content) {
          const { header, detail } = response.result.content

          if (header.submittedDocumentNo) {
            submittedDocumentNo.value = header.submittedDocumentNo
          }
          if (header.clearingDocumentNo) {
            form.value.clearingDocumentNo = header.clearingDocumentNo
            console.log('Tab Switch - Clearing Doc updated:', header.clearingDocumentNo)
          }

          // Fully sync status and payment summary
          if (header.statusCode) {
            form.value.statusCode = header.statusCode
            form.value.statusName = header.statusName
          }

          paymentSummary.value = {
            statusCode: header.statusCode,
            statusName: header.statusName,
            totalInvoice: header.totalAmountInvoice,
            paymentReceived: header.paymentReceivedAmount,
            outstanding: header.outstandingAmount,
            currency: header.currency,
            clearingDocumentNo: header.clearingDocumentNo || '-',
          }
          console.log('Tab Switch - Payment Summary updated:', paymentSummary.value)

          if (detail && detail.length > 0) {
            savedPaymentDetailsFromSession.value = detail.map((item, index) => ({
              no: index + 1,
              paymentDate: item.paymentDate,
              amount: item.amount.toString(),
              status: item.paymentStatus,
              bankAccount: item.bankAccount,
              remarks: item.remarks,
              attachmentDocument: item.documentUrl || '',
              invoicePaymentDetailId: item.invoicePaymentDetailId,
            }))
          }
        }
      } catch (error) {
        console.error('Error reloading payment status:', error)
      }
    }
  },
)

watch(
  () => form.value,
  () => {
    if (form.value.companyCode) {
      invoiceMasterApi.getActivity(form.value.companyCode || '')
      invoiceMasterApi.getCostCenter(form.value.companyCode || '')
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(async () => {
  if (route.query.type === '1') {
    activeStep.value = 'Verification'
    routes.value = [
      {
        name: 'Invoice Verification',
        to: checkIsNonPo() ? '/invoice/verification/noPo' : '/invoice/verification',
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail',
      },
    ]
  } else {
    activeStep.value = 'Approval'
    routes.value = [
      {
        name: 'Invoice Approval',
        to: checkIsNonPo() ? '/invoice/approval/nonPo' : '/invoice/approval',
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail',
      },
    ]
  }
  invoiceMasterApi.getWhtType()
  invoiceMasterApi.getTaxCode()
  if (!checkIsNonPo()) {
    await verificationApi.getInvoiceDetail(route.query.id?.toString() || '').then(async () => {
      afterGetDetail()

      // Load payment status data from backend API
      if (route.query.type === '2' && checkApprovalNonPo1() && form.value.statusCode >= 7) {
        try {
          const response = await verificationApi.getPaymentStatus(form.value.invoiceUId)
          if (response?.result?.content) {
            const { header, detail } = response.result.content

            if (header.submittedDocumentNo) {
              submittedDocumentNo.value = header.submittedDocumentNo
            }
            if (header.clearingDocumentNo) {
              form.value.clearingDocumentNo = header.clearingDocumentNo
            }

            // Sync status and payment summary on page load
            if (header.statusCode) {
              form.value.statusCode = header.statusCode
              form.value.statusName = header.statusName
            }

            paymentSummary.value = {
              statusCode: header.statusCode,
              statusName: header.statusName,
              totalInvoice: header.totalAmountInvoice,
              paymentReceived: header.paymentReceivedAmount,
              outstanding: header.outstandingAmount,
              currency: header.currency,
              clearingDocumentNo: header.clearingDocumentNo || '-',
            }

            if (detail && detail.length > 0) {
              // Map PaymentStatusDetail to PaymentDetail format
              savedPaymentDetailsFromSession.value = detail.map((item, index) => ({
                no: index + 1,
                paymentDate: item.paymentDate,
                amount: item.amount.toString(),
                status: item.paymentStatus,
                bankAccount: item.bankAccount,
                remarks: item.remarks,
                attachmentDocument: item.documentUrl || '',
                invoicePaymentDetailId: item.invoicePaymentDetailId,
              }))
            }
          }
        } catch (error) {
          console.error('Error loading payment status:', error)
        }
      }
    })
  } else {
    await verificationApi.getInvoiceNonPoDetail(route.query.id?.toString() || '').then(async () => {
      afterGetDetailNonPo()

      // Load payment status data from backend API
      if (route.query.type === '2' && checkApprovalNonPo1() && form.value.statusCode >= 7) {
        try {
          const response = await verificationApi.getPaymentStatus(form.value.invoiceUId)
          if (response?.result?.content) {
            const { header, detail } = response.result.content

            if (header.submittedDocumentNo) {
              submittedDocumentNo.value = header.submittedDocumentNo
            }
            if (header.clearingDocumentNo) {
              form.value.clearingDocumentNo = header.clearingDocumentNo
            }

            // Sync status and payment summary on page load (Non-PO)
            if (header.statusCode) {
              form.value.statusCode = header.statusCode
              form.value.statusName = header.statusName
            }

            paymentSummary.value = {
              statusCode: header.statusCode,
              statusName: header.statusName,
              totalInvoice: header.totalAmountInvoice,
              paymentReceived: header.paymentReceivedAmount,
              outstanding: header.outstandingAmount,
              currency: header.currency,
              clearingDocumentNo: header.clearingDocumentNo || '-',
            }

            if (detail && detail.length > 0) {
              // Map PaymentStatusDetail to PaymentDetail format
              savedPaymentDetailsFromSession.value = detail.map((item, index) => ({
                no: index + 1,
                paymentDate: item.paymentDate,
                amount: item.amount.toString(),
                status: item.paymentStatus,
                bankAccount: item.bankAccount,
                remarks: item.remarks,
                attachmentDocument: item.documentUrl || '',
                invoicePaymentDetailId: item.invoicePaymentDetailId,
              }))
            }
          }
        } catch (error) {
          console.error('Error loading payment status:', error)
        }
      }
    })
  }
})
</script>
