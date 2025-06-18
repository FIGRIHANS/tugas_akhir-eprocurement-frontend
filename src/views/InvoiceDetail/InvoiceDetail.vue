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
    <InvoicePoGr v-if="checkPo()" class="mt-[24px]" />
    <AdditionalCost v-if="form.invoiceDPCode === 9011 && checkPo()" class="mt-[24px]" />
    <div class="flex items-center justify-between gap-[8px] mt-[24px]">
      <div class="flex items-center gap-[10px]">
        <button class="btn btn-outline btn-primary" :disabled="isLoading" @click="goBack">
          <i class="ki-filled ki-black-left"></i>
          Back
        </button>
        <button v-if="checkStatusCode()" class="btn btn-primary" :disabled="isLoading" @click="goToEdit">
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
    <SuccessVerifModal />
    <SuccessRejectModal />
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
import type { PostVerificationTypes } from '@/stores/views/invoice/types/verification'
import { isEmpty } from 'lodash'

const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
const GeneralData = defineAsyncComponent(() => import('./InvoiceDetail/GeneralData.vue'))
const BankKey = defineAsyncComponent(() => import('./InvoiceDetail/BankKey.vue'))
const InvoiceHeaderDocument = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceHeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceDetail/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceDetail/AdditionalCost.vue'))
const RejectVerification = defineAsyncComponent(() => import('./InvoiceDetail/RejectVerification.vue'))
const SuccessVerifModal = defineAsyncComponent(() => import('./InvoiceDetail/SuccessVerifModal.vue'))
const SuccessRejectModal = defineAsyncComponent(() => import('./InvoiceDetail/SuccessRejectModal.vue'))

const activeStep = ref<string>('')
const router = useRouter()
const route = useRoute()
const verificationApi = useInvoiceVerificationStore()
const isLoading = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval'
  },
  {
    name: 'Detail Invoice',
    to: '/invoice/detail'
  }
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
  bankKey: '',
  bankName: '',
  beneficiaryName: '',
  bankAccountNo: '',
  vendorId: 0,
  vendorName: '',
  vendorAddress: '',
  subtotal: 0,
  vatAmount: 0,
  whtAmount: 0,
  additionalCost: 0,
  totalGrossAmount: 0,
  totalNetAmount: 0,
  invoicePoGr: [],
  additionalCosts: [],
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null
})

const detailInvoice = computed(() => verificationApi.detailInvoice)

const checkStatusCode = () => {
  let status = true
  switch (form.value.statusCode) {
    case 4:
    case 5:
    case 7:
      status = false
      break
  }

  return status
}

const goToEdit = () => {
  router.push({
    name: 'invoiceDetailEdit',
    query : {
      id: route.query.id,
      type: route.query.type
    }
  })
}

const openReject = () => {
  const idModal = document.querySelector('#reject_Verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkPo = () => {
  return form.value.invoiceTypeCode === 901
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
  ) return false
  return true
}

const checkVerif = () => {
  let status = true
  const data = form.value
  status = checkVerifHeader()

  if (
    !data.bankKeyCheck ||
    !data.generalDataCheck ||
    !data.invoiceHeaderDocumentCheck ||
    !data.invoiceCalculationCheck ||
    !data.invoicePoGrCheck ||
    !data.additionalCostCheck 
  ) status = false

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
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: item.whtBaseAmount,
      whtAmount: item.whtAmount
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
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType,
      whtCode: item.whtCode,
      whtBaseAmount: Number(item.whtBaseAmount)
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
    statusCode: route.query.type === '1'? 3 : 4,
    statusName: route.query.type === '1'? 'Verified' : 'Approved',
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
      npwpReporting: form.value.npwpReporting
    },
    payment: {
      bankKey: form.value.bankKey,
      bankName: form.value.bankName,
      beneficiaryName: form.value.beneficiaryName,
      bankAccountNo: form.value.bankAccountNo
    },
    calculation: {
      subtotal: form.value.subtotal,
      vatAmount: form.value.vatAmount,
      whtAmount: form.value.whtAmount,
      additionalCost: form.value.additionalCost,
      totalGrossAmount: form.value.totalGrossAmount,
      totalNetAmount: form.value.totalNetAmount
    },
    documents,
    pogr: mapPoGr(),
    additionalCosts: mapAdditionalCost()
  } as PostVerificationTypes

  return data
}

const goVerif = () => {
  const status = checkVerif()

  if (!status) return
  isLoading.value = true
  verificationApi.postSubmission(mapDataVerif()).then(() => {
    verificationApi.resetDetailInvoiceEdit()
    const idModal = document.querySelector('#success_verif_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
    setTimeout(() => {
      modal.hide()
      router.push({
        name: 'invoiceVerification'
      })
    }, 1000)
  }).finally(() => {
    isLoading.value = false
  })
}

const goReject = (reason: string) => {
  verificationApi.isRejectLoading = true
  verificationApi.postReject({
    invoiceUId: form.value.invoiceUId,
    notes: reason
  }).then(() => {
    const idModal = document.querySelector('#success_reject_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
    setTimeout(() => {
      modal.hide()
      router.push({
        name: 'invoiceVerification'
      })
    }, 1000)
  })
  .finally(() => {
    verificationApi.isRejectLoading = false
  })
}

const goBack = () => {
  if (route.query.type === '1') {
    router.push({
      name: 'invoiceVerification'
    })
  } else {
    router.push({
      name: 'invoiceApproval'
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
      ...item
    })
  }

  for (const item of data?.additionalCosts || []) {
    resultAdditional.push({
      ...item
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
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    beneficiaryName: data?.payment.beneficiaryName || '',
    bankAccountNo: data?.payment.bankAccountNo || '',
    vendorId: data?.vendor.vendorId || 0,
    vendorName: data?.vendor.vendorName || '',
    vendorAddress: data?.vendor.vendorAddress || '',
    subtotal: data?.calculation.subtotal || 0,
    vatAmount: data?.calculation.vatAmount || 0,
    whtAmount: data?.calculation.whtAmount || 0,
    additionalCost: data?.calculation.additionalCost || 0,
    totalGrossAmount: data?.calculation.totalGrossAmount || 0,
    totalNetAmount: data?.calculation.totalNetAmount || 0,
    invoicePoGr: resultPoGr,
    additionalCosts: resultAdditional,
    invoiceDocument: invoice,
    tax: tax,
    referenceDocument: reference,
    otherDocument: other
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
    bankKey: data?.bankKey || '',
    bankName: data?.bankName || '',
    beneficiaryName: data?.beneficiaryName || '',
    bankAccountNo: data?.bankAccountNo || '',
    vendorId: data?.vendorId || 0,
    vendorName: data?.vendorName || '',
    vendorAddress: data?.vendorAddress || '',
    subtotal: data?.subtotal || 0,
    vatAmount: data?.vatAmount || 0,
    whtAmount: data?.whtAmount || 0,
    additionalCost: data?.additionalCost || 0,
    totalGrossAmount: data?.totalGrossAmount || 0,
    totalNetAmount: data?.totalNetAmount || 0,
    invoicePoGr: data?.invoicePoGr || [],
    additionalCosts: data?.additionalCosts || [],
    invoiceDocument: data?.invoiceDocument || null,
    tax: data?.tax || null,
    referenceDocument: data?.referenceDocument || null,
    otherDocument: data?.otherDocument || null
  }
}

onMounted(() => {
  if (route.query.type === '1') {
    activeStep.value = 'Verification'
    routes.value = [
      {
        name: 'Invoice Verification',
        to: '/invoice/verification'
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail'
      }
    ]
  } else {
    activeStep.value = 'Approval'
    routes.value = [
      {
        name: 'Invoice Approval',
        to: '/invoice/approval'
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail'
      }
    ]
  }
  verificationApi.getInvoiceDetail(route.query.id?.toString() || '').then(() => {
    if (verificationApi.isFromEdit) {
      setDataEdit()
    } else {
      setDataDefault()
    }
  })
})

provide('form', form)
</script>
