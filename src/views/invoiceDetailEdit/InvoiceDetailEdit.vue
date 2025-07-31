<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <TabInvoice :active-tab="tabNow" :with-preview="false" @change-tab="setTab" class="-mx-[24px]" />
    <div>
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div class="flex justify-end items-center mt-[24px] gap-[8px]">
        <button class="btn btn-outline btn-primary" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button v-if="tabNow !== 'information'" class="btn btn-primary" @click="goNext">
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button v-if="tabNow === 'information'" class="btn btn-primary" @click="goNext">
          Save
          <i class="ki-duotone ki-bookmark"></i>
        </button>
      </div>
    </div>
    <!-- <ModalSuccess /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, provide, type Component, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import type { formTypes } from './types/invoiceDetailEdit'
import type { itemsPoGrType } from './types/invoicePoGr'
import type { itemsCostType } from './types/additionalCost'
import type { documentDetailTypes } from './types/invoiceDocument'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from '@/components/invoice/TabInvoice.vue'
import { useCheckEmpty } from '@/composables/validation'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import moment from 'moment'
import { isEmpty } from 'lodash'
import type { documentDetailTypes as documentDetailTypesStore } from '@/stores/views/invoice/types/verification'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceDetailEdit/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(() => import('./InvoiceDetailEdit/InvoiceInformation.vue'))

const verificationApi = useInvoiceVerificationStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const router = useRouter()
const route = useRoute()
const activeStep = ref<string>('')
const tabNow = ref<string>('data')

const routes = ref<routeTypes[]>([
  {
    name: 'E-invoice',
    to: '/invoice'
  },
  {
    name: 'Add E-invoice',
    to: '/invoice/add'
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
  remainingDpAmount: '',
  dpAmountDeduction: '',
  bankKey: '',
  bankName: '',
  beneficiaryName: '',
  bankAccountNo: '',
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
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const detailInvoice = computed(() => verificationApi.detailInvoice)

const checkInvoiceData = () => {
  return true
  // if (!form.bankKeyId) return false
}

const checkInvoiceInformation = () => {
  let status = true
  form.value.invoiceDateError = useCheckEmpty(form.value.invoiceDate).isError
  form.value.postingDateError = useCheckEmpty(form.value.postingDate).isError
  form.value.estimatedPaymentDateError = useCheckEmpty(form.value.estimatedPaymentDate).isError
  form.value.documentNoError = useCheckEmpty(form.value.documentNo).isError
  form.value.paymentMethodError = useCheckEmpty(form.value.paymentMethodCode).isError
  form.value.transferNewsError = useCheckEmpty(form.value.transferNews).isError
  form.value.notesError = useCheckEmpty(form.value.notes).isError

  if (Number(form.value.invoiceDPCode) === 9013) {
    form.value.dpAmountDeductionError = Number(form.value.dpAmountDeduction) > Number(form.value.remainingDpAmount)
  }

  if (
    form.value.invoiceDateError ||
    form.value.postingDateError ||
    form.value.estimatedPaymentDateError ||
    form.value.documentNoError ||
    form.value.paymentMethodError ||
    form.value.transferNewsError ||
    form.value.notesError||
    form.value.dpAmountDeductionError
  ) status = false
  
  for (const item of form.value.additionalCosts) {
    if (!item.activityExpense || !item.itemAmount || !item.debitCredit) {
      status = false
    }
  }

  return status
}

const setTab = (value: string) => {
  tabNow.value = value
}
const goBack = () => {
  const list = ['data', 'information']
  if (tabNow.value === 'data') {
    router.push({
      name: 'invoiceDetail',
      query: {
        id: route.query.id,
        type: route.query.type
      }
    })
  } else {
    const checkIndex = list.findIndex((item) => item === tabNow.value)
    if (checkIndex !== -1) {
      tabNow.value = list[checkIndex - 1]
    }
  }
}

const goNext = () => {
  const list = ['data', 'information']
  if (tabNow.value === 'data') {
    const check = checkInvoiceData()
    if (!check) return
    const checkIndex = list.findIndex((item) => item === tabNow.value)
    if (checkIndex !== -1) {
      tabNow.value = list[checkIndex + 1]
    }
  } else {
    const check = checkInvoiceInformation()
    if (!check) return
    verificationApi.isFromEdit = true
    verificationApi.detailInvoiceEdit = {
      ...form.value,
      postingDate: moment(form.value.postingDate).toISOString(),
      estimatedPaymentDate: moment(form.value.estimatedPaymentDate).toISOString(),
      invoiceDocument: !isEmpty(form.value.invoiceDocument) ? {
        documentType: 1,
        documentName: form.value.invoiceDocument.name || '',
        documentUrl: form.value.invoiceDocument.path,
        documentSize: Number(form.value.invoiceDocument.fileSize)
      } : null,
      tax: !isEmpty(form.value.tax) ? {
        documentType: 2,
        documentName: form.value.tax.name || '',
        documentUrl: form.value.tax.path,
        documentSize: Number(form.value.tax.fileSize)
      } : null,
      referenceDocument: !isEmpty(form.value.referenceDocument) ? {
        documentType: 3,
        documentName: form.value.referenceDocument.name || '',
        documentUrl: form.value.referenceDocument.path,
        documentSize: Number(form.value.referenceDocument.fileSize)
      } : null,
      otherDocument: !isEmpty(form.value.otherDocument) ? {
        documentType: 4,
        documentName: form.value.otherDocument.name || '',
        documentUrl: form.value.otherDocument.path,
        documentSize: Number(form.value.otherDocument.fileSize)
      } : null
    }
    router.push({
      name: 'invoiceDetail',
      query: {
        id: route.query.id,
        type: route.query.type
      }
    })
  }
}

const mapDataEditPoGr = () => {
  const result = [] as itemsPoGrType[]
  if (verificationApi.detailInvoiceEdit) {
    for (const item of verificationApi.detailInvoiceEdit.invoicePoGr) {
      result.push({
        ...item,
        isEdit: false
      })
    }
  }
  return result
}

const mapDataEditAdditional = () => {
  const result = [] as itemsCostType[]
  if (verificationApi.detailInvoiceEdit) {
    for (const item of verificationApi.detailInvoiceEdit.additionalCosts) {
      result.push({
        ...item,
        isEdit: false
      })
    }
  }
  return result
}

const mapDocument = (data: documentDetailTypesStore | null) => {
  if (!data) return null
  return {
    name: data.documentName,
    path: data.documentUrl,
    fileSize: data.documentSize ? data.documentSize.toString() : '0'
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
    remainingDpAmount: data?.remainingDpAmount || '',
    dpAmountDeduction: data?.dpAmountDeduction || '',
    bankKey: data?.bankKey || '',
    bankName: data?.bankName || '',
    beneficiaryName: data?.beneficiaryName || '',
    bankAccountNo: data?.bankAccountNo || '',
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
    invoicePoGr: mapDataEditPoGr(),
    additionalCosts: mapDataEditAdditional(),
    invoiceDocument: mapDocument(data?.invoiceDocument || null),
    tax: mapDocument(data?.tax || null),
    referenceDocument: mapDocument(data?.referenceDocument || null),
    otherDocument: mapDocument(data?.otherDocument || null)
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
      isEdit: false
    })
  }

  for (const item of data?.additionalCosts || []) {
    resultAdditional.push({
      ...item,
      isEdit: false
    })
  }

  for (const item of data?.documents || []) {
    const data = {
      name: item.documentName,
      path: item.documentUrl,
      fileSize: item.documentSize ? item.documentSize.toString() : '0'
    } as documentDetailTypes
    switch (item.documentType) {
      case 1:
        invoice = data
        break
      case 2:
        tax = data
        break
      case 3:
        reference = data
        break
      case 4:
        other = data
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
    postingDate: data?.header.postingDate || moment(),
    invoicingParty: data?.header.invoicingParty || '',
    estimatedPaymentDate: data?.header.estimatedPaymentDate || '',
    paymentMethodCode: data?.header.paymentMethodCode || '',
    paymentMethodName: data?.header.paymentMethodName || '',
    assigment: data?.header.assigment || '',
    transferNews: data?.header.transferNews || '',
    npwpReporting: data?.header.npwpReporting || '',
    remainingDpAmount: data?.header.remainingDpAmount || '',
    dpAmountDeduction: data?.header.dpAmountDeduction || '',
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    beneficiaryName: data?.payment.beneficiaryName || '',
    bankAccountNo: data?.payment.bankAccountNo || '',
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
    invoiceDocument: invoice,
    tax: tax,
    referenceDocument: reference,
    otherDocument: other
  }
}

onMounted(() => {
  invoiceMasterApi.getTaxCode()
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getDpTypes()
  invoiceMasterApi.getVendorList()
  invoiceMasterApi.getCurrency()
  if (route.query.type === '1') {
    activeStep.value = 'Verification'
  } else {
    activeStep.value = 'Approval'
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

<style lang="scss" scoped>
@use './styles/invoice-detail-edit.scss';
</style>
