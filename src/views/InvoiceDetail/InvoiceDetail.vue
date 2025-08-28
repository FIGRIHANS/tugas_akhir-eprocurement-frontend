<template>
  <div>
    <Breadcrumb title="Detail Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <hr class="-mx-[24px] mb-[24px]" />
    <StatusInvoice :statusCode="form.statusCode" class="mb-[24px]" />
    <div class="flex gap-[24px]">
      <GeneralData class="flex-1" />
      <BankKey class="flex-1" />
    </div>
    <div class="flex gap-[24px] mt-[24px] max-h-[457px]">
      <InvoiceHeaderDocument class="flex-1" />
      <InvoiceCalculation class="flex-1" :formInvoice="form" />
    </div>
    <div v-if="currentRouteName === 'invoiceDetail'">
      <InvoicePoGr v-if="checkPo() && !isNonPo" class="mt-[24px]" />
      <InvoiceItem v-if="isNonPo" class="mt-[24px]" />
      <AdditionalCost
        v-if="
          (form.invoiceDPCode === 9011 && !isNonPo && checkPo()) ||
          form.invoiceTypeCode === 902 ||
          form.invoiceTypeCode === 903
        "
        class="mt-[24px]"
      />
    </div>
    <div v-else>
      <ConstExpenses class="mt-[24px]" />
    </div>
    <div class="flex items-center justify-between gap-[8px] mt-[24px]">
      <div class="flex items-center gap-[10px]">
        <button class="btn btn-outline btn-primary" :disabled="isLoading" @click="goBack">
          <i class="ki-filled ki-black-left"></i>
          Back
        </button>
        <button
          v-if="checkStatusCode()"
          class="btn btn-primary"
          :disabled="isLoading"
          @click="goToEdit"
        >
          <i class="ki-duotone ki-pencil"></i>
          Edit
        </button>
      </div>
      <div v-if="checkStatusCode()" class="flex items-center justify-end gap-[10px]">
        <button class="btn btn-outline btn-danger" :disabled="isLoading" @click="openReject">
          <i class="ki-duotone ki-cross-circle"></i>
          Reject
        </button>
        <button class="btn btn-primary" :disabled="isLoading" @click="goVerif">
          <i class="ki-duotone ki-check-circle"></i>
          {{ route.query.type === '1' ? 'Verify' : 'Approve' }}
        </button>
      </div>
    </div>
    <RejectVerification @reject="goReject" />
    <SuccessVerifModal
      :statusCode="detailInvoice?.header.statusCode || -1"
      @afterClose="goToList"
    />
    <SuccessRejectModal @afterClose="goToList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, defineAsyncComponent, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { formTypes } from './types/invoiceDetail'
import type { itemsPoGrType } from './types/invoicePoGr'
import type { itemsCostType } from './types/additionalCost'
import type { documentDetailTypes } from './types/invoiceDocument'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import { KTModal } from '@/metronic/core'
import { useCheckEmpty } from '@/composables/validation'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useLoginStore } from '@/stores/views/login'
import type { PostVerificationTypes } from '@/stores/views/invoice/types/verification'
import { isEmpty } from 'lodash'

const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
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
const router = useRouter()
const route = useRoute()
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
  remainingDpAmount: '',
  dpAmountDeduction: '',
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
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
})

const detailInvoice = computed(() => verificationApi.detailInvoice)
const userData = computed(() => loginApi.userData)
const additionalCostTempDelete = computed(() => verificationApi.additionalCostTempDelete)

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

const checkWorkflow = () => {
  const getWf = detailInvoice.value?.workflow || []
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
  const invoiceDateError = useCheckEmpty(form.value.invoiceDate).isError
  const postingDateError = useCheckEmpty(form.value.postingDate).isError
  const estimatedPaymentDateError = useCheckEmpty(form.value.estimatedPaymentDate).isError
  const documentNoError = useCheckEmpty(form.value.documentNo).isError
  const paymentMethodError = useCheckEmpty(form.value.paymentMethodCode).isError
  const transferNewsError = useCheckEmpty(form.value.transferNews).isError
  const notesError = useCheckEmpty(form.value.notes).isError

  if (
    invoiceDateError ||
    postingDateError ||
    estimatedPaymentDateError ||
    documentNoError ||
    paymentMethodError ||
    transferNewsError ||
    notesError
  )
    return false
  return true
}

const checkVerif = () => {
  let status = true
  status = checkVerifHeader()

  return status
}

const mapPoGr = () => {
  const poGr = []
  for (const item of form.value.invoicePoGr) {
    poGr.push({
      poNo: item.poNo,
      poItem: Number(item.poItem),
      grDocumentNo: item.grDocumentNo,
      itemAmount: Number(item.itemAmount),
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
    cost.push({
      activityExpense: item.activityExpense,
      itemAmount: Number(item.itemAmount),
      debitCredit: item.debitCredit,
      taxCode: item.taxCode,
      vatAmount: item.vatAmount,
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: Number(item.whtBaseAmount),
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
      invoiceDate: form.value.invoiceDate,
      taxNo: form.value.taxNo,
      currCode: form.value.currCode,
      notes: form.value.notes,
      postingDate: form.value.postingDate,
      invoicingParty: form.value.invoicingParty,
      estimatedPaymentDate: form.value.estimatedPaymentDate,
      paymentMethodCode: form.value.paymentMethodCode,
      paymentMethodName: form.value.paymentMethodName,
      assigment: form.value.assigment,
      transferNews: form.value.transferNews,
      npwpReporting: form.value.npwpReporting,
      creditCardBillingId: form.value.creditCardBillingId,
    },
    payment: {
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

const goVerif = () => {
  const status = checkVerif()

  if (!status) return
  isLoading.value = true
  verificationApi
    .postSubmission(mapDataVerif())
    .then(() => {
      verificationApi.resetDetailInvoiceEdit()
      const idModal = document.querySelector('#success_verif_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
      for (const item of additionalCostTempDelete.value) {
        verificationApi.deleteAdditionalCost(form.value.invoiceUId, item.id)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

const goReject = (reason: string) => {
  verificationApi.isRejectLoading = true
  verificationApi
    .postReject({
      invoiceUId: form.value.invoiceUId,
      notes: reason,
    })
    .then(() => {
      const idModal = document.querySelector('#success_reject_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    })
    .finally(() => {
      verificationApi.isRejectLoading = false
    })
}

const goToList = () => {
  router.push({
    name: route.query.type === '1' ? 'invoiceVerification' : 'invoiceApproval',
  })
}

const goBack = () => {
  if (route.query.type === '1') {
    router.push({
      name: 'invoiceVerification',
    })
  } else if (!checkPo()) {
    router.push({
      name: 'invoice-list-non-po',
    })
  } else {
    router.push({
      name: 'invoiceApproval',
    })
  }
}

const setDataDefault = () => {
  const data = detailInvoice.value
  const resultPoGr: itemsPoGrType[] = []
  const resultAdditional: itemsCostType[] = []
  let invoice = {} as documentDetailTypes
  let tax = {} as documentDetailTypes
  let reference = {} as documentDetailTypes
  let other = {} as documentDetailTypes

  for (const item of data?.pogr || []) {
    resultPoGr.push({
      ...item,
    })
  }

  for (const item of data?.additionalCosts || []) {
    resultAdditional.push({
      ...item,
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
    remainingDpAmount: '',
    dpAmountDeduction: '',
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    creditCardBillingId: data?.header.creditCardBillingId || '',
    beneficiaryName: data?.payment.beneficiaryName || '',
    bankAccountNo: data?.payment.bankAccountNo || '',
    bankCountryCode: data?.payment.bankCountryCode || '',
    vendorId: data?.vendor.vendorId || '',
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
    invoiceDocument: invoice,
    tax: tax,
    referenceDocument: reference,
    otherDocument: other,
  }
}

const setDataEdit = () => {
  const data = verificationApi.detailInvoiceEdit
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
    remainingDpAmount: '',
    dpAmountDeduction: '',
    bankKey: data?.bankKey || '',
    bankName: data?.bankName || '',
    beneficiaryName: data?.beneficiaryName || '',
    bankAccountNo: data?.bankAccountNo || '',
    bankCountryCode: data?.bankCountryCode || '',
    creditCardBillingId: data?.creditCardBillingId || '',
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
    additionalCosts: data?.additionalCosts || [],
    invoiceItem: [],
    invoiceDocument: data?.invoiceDocument || null,
    tax: data?.tax || null,
    referenceDocument: data?.referenceDocument || null,
    otherDocument: data?.otherDocument || null,
  }
}

onMounted(async () => {
  if (route.query.type === '1') {
    activeStep.value = 'Verification'
    routes.value = [
      {
        name: 'Invoice Verification',
        to: '/invoice/verification',
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
        to: '/invoice/approval',
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail',
      },
    ]
  }
  if (checkPo) {
    await verificationApi.getInvoiceDetail(route.query.id?.toString() || '').then(() => {
      if (verificationApi.isFromEdit) {
        setDataEdit()
      } else {
        setDataDefault()
      }
      switch (detailInvoice.value?.header.statusCode) {
        case 1:
        case 3:
          activeStep.value = 'Verification'
          break
        case 2:
        case 4:
          activeStep.value = 'Approval'
          break
        case 7:
          activeStep.value = 'Posting'
          break
      }
    })
  } else {
    await verificationApi.getInvoiceNonPoDetail(route.query.id?.toString() || '').then(() => {
      if (verificationApi.isFromEdit) {
        setDataEdit()
      } else {
        setDataDefault()
      }
      switch (detailInvoice.value?.header.statusCode) {
        case 1:
        case 3:
          activeStep.value = 'Verification'
          break
        case 2:
        case 4:
          activeStep.value = 'Approval'
          break
        case 7:
          activeStep.value = 'Posting'
          break
      }
    })
  }
})

provide('form', form)
</script>
