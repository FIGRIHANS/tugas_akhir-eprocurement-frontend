<template>
  <div>
    <Breadcrumb title="Detail Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <hr class="-mx-[24px] mb-[24px]" />
    <StatusInvoice class="mb-[24px]" />
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
        <button class="btn btn-outline btn-primary" @click="goBack">
          <i class="ki-filled ki-black-left"></i>
          Back
        </button>
        <button class="btn btn-primary" @click="goToEdit">
          <i class="ki-duotone ki-pencil"></i>
          Edit
        </button>
      </div>
      <div class="flex items-center justify-end gap-[10px]">
        <button class="btn btn-outline btn-danger" @click="openReject">
          <i class="ki-duotone ki-cross-circle"></i>
          Reject
        </button>
        <button class="btn btn-primary" @click="goVerif">
          <i class="ki-duotone ki-check-circle"></i>
          Verify
        </button>
      </div>
    </div>
    <RejectVerification />
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
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
const GeneralData = defineAsyncComponent(() => import('./InvoiceDetail/GeneralData.vue'))
const BankKey = defineAsyncComponent(() => import('./InvoiceDetail/BankKey.vue'))
const InvoiceHeaderDocument = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceHeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceDetail/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceDetail/AdditionalCost.vue'))
const RejectVerification = defineAsyncComponent(() => import('./InvoiceDetail/RejectVerification.vue'))

const activeStep = ref<string>('')
const router = useRouter()
const route = useRoute()
const verificationApi = useInvoiceVerificationStore()

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

const goToEdit = () => {
  router.push({
    name: 'invoiceDetailEdit',
    query : {
      id: route.query.id,
      type: route.query.type
    }
  })
}

const detailInvoice = computed(() => verificationApi.detailInvoice)

const openReject = () => {
  const idModal = document.querySelector('#reject_Verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkPo = () => {
  return form.value.invoiceTypeCode === 901
}

const checkVerif = () => {
  const data = form.value
  if (
    !data.bankKeyCheck ||
    !data.generalDataCheck ||
    !data.invoiceHeaderDocumentCheck ||
    !data.invoiceCalculationCheck ||
    !data.invoicePoGrCheck ||
    !data.additionalCostCheck 
  ) return false
  return true
}

const goVerif = () => {
  const status = checkVerif()

  if (!status) return
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
