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
        <button class="btn btn-outline btn-primary" :disabled="isLoading" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button v-if="tabNow !== 'information'" class="btn btn-primary" :disabled="isLoading" @click="goNext">
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button v-if="tabNow === 'information'" class="btn btn-primary" :disabled="isLoading" @click="goNext">
          Save
          <i class="ki-duotone ki-bookmark"></i>
        </button>
      </div>
    </div>
    <SuccessEditApproval @afterClose="handleAfterSuccess" />
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
import { KTModal } from '@/metronic/core'
import type { PostVerificationTypes } from '@/stores/views/invoice/types/verification'
import type { documentDetailTypes as documentDetailTypesStore } from '@/stores/views/invoice/types/verification'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceDetailEdit/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(
  () => import('./InvoiceDetailEdit/InvoiceInformation.vue'),
)
const SuccessEditApproval = defineAsyncComponent(
  () => import('./InvoiceDetailEdit/SuccessEditApproval.vue'),
)

const verificationApi = useInvoiceVerificationStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const router = useRouter()
const route = useRoute()
const activeStep = ref<string>('')
const tabNow = ref<string>('data')
const isLoading = ref<boolean>(false)

const routes = ref<routeTypes[]>([
  {
    name: 'E-invoice',
    to: '/invoice',
  },
  {
    name: 'Add E-invoice',
    to: '/invoice/add',
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
  creditCardBillingId: '',
  creditCardBillingError: false,
  isAlternativePayee: false,
  isOneTimeVendor: false,
  nameAlternative: '',
  nameOtherAlternative: '',
  streetAltiernative: '',
  cityAlternative: '',
  countryAlternative: '',
  bankAccountNumberAlternative: '',
  bankKeyAlternative: '',
  bankCountryAlternative: '',
  npwpNumberAlternative: '',
  ktpNumberAlternative: '',
  emailAlternative: '',
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation,
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const detailInvoice = computed(() => verificationApi.detailInvoice)
const detailInvoiceNonPO = computed(() => verificationApi.detailNonPoInvoice)

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
  form.value.creditCardBillingError = useCheckEmpty(form.value.creditCardBillingId).isError

  if (Number(form.value.invoiceDPCode) === 9013) {
    form.value.dpAmountDeductionError =
      Number(form.value.dpAmountDeduction) > Number(form.value.remainingDpAmount)
  }

  if (
    form.value.invoiceDateError ||
    form.value.postingDateError ||
    form.value.estimatedPaymentDateError ||
    form.value.documentNoError ||
    form.value.paymentMethodError ||
    form.value.transferNewsError ||
    form.value.notesError ||
    form.value.dpAmountDeductionError
  )
    status = false
  for (const item of form.value.additionalCosts) {
    if (!item.activityExpense || !item.itemAmount || !item.debitCredit) {
      status = false
    }
  }

  status = status ? checkTableItem() : false

  return status
}

const checkTableItem = () => {
  let status = true

  for (const item of form.value.invoicePoGr) {
    if (item.isEdit) status = false
  }

  for (const item of form.value.additionalCosts) {
    if (item.isEdit) status = false
  }

  for (const item of form.value.invoiceItem) {
    if (item.isEdit) status = false
  }

  return status
}

const setTab = (value: string) => {
  tabNow.value = value
}

const handleAfterSuccess = () => {
  if (form.value.statusCode === 1 && route.query.invoiceType === 'no_po') {
    router.push({
      name: 'invoiceDetail',
      query: {
        id: form.value.invoiceUId,
        type: '1',
        invoiceType: 'no_po'
      }
    })
  } else if (form.value.statusCode === 1 && route.query.invoiceType === 'po') {
    router.push({
      name: 'invoiceDetail',
      query: {
        id: form.value.invoiceUId,
        type: '1',
      }
    })
  } else {
    router.push({
      name: 'invoiceApproval',
    })
  }
}

const goBack = () => {
  const list = ['data', 'information']
  if (tabNow.value === 'data') {
    router.push({
      name: 'invoiceDetail',
      query: {
        id: route.query.id,
        type: route.query.type,
      },
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
    const data = {
      ...form.value,
      postingDate: moment(form.value.postingDate).toISOString(),
      estimatedPaymentDate: moment(form.value.estimatedPaymentDate).toISOString(),
      invoiceDocument: !isEmpty(form.value.invoiceDocument)
        ? {
          id: form.value.invoiceDocument.id || 0,
          documentType: 1,
          documentName: form.value.invoiceDocument.name || '',
          documentUrl: form.value.invoiceDocument.path,
          documentSize: Number(form.value.invoiceDocument.fileSize),
        }
        : null,
      tax: !isEmpty(form.value.tax)
        ? {
          id: form.value.tax.id || 0,
          documentType: 2,
          documentName: form.value.tax.name || '',
          documentUrl: form.value.tax.path,
          documentSize: Number(form.value.tax.fileSize),
        }
        : null,
      referenceDocument: !isEmpty(form.value.referenceDocument)
        ? {
          id: form.value.referenceDocument.id || 0,
          documentType: 3,
          documentName: form.value.referenceDocument.name || '',
          documentUrl: form.value.referenceDocument.path,
          documentSize: Number(form.value.referenceDocument.fileSize),
        }
        : null,
      otherDocument: !isEmpty(form.value.otherDocument)
        ? {
          id: form.value.otherDocument.id || 0,
          documentType: 4,
          documentName: form.value.otherDocument.name || '',
          documentUrl: form.value.otherDocument.path,
          documentSize: Number(form.value.otherDocument.fileSize),
        }
        : null,
    }
    verificationApi.detailInvoiceEdit = data

    if (form.value.statusCode === 4) {
      isLoading.value = true
      verificationApi
        .putSubmission(mapDataVerif())
        .then(() => {
          verificationApi.resetDetailInvoiceEdit()
          const idModal = document.querySelector('#success_data_edit_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
        })
        .finally(() => {
          isLoading.value = false
        })
    } else if (form.value.statusCode === 1) {
      isLoading.value = true
      verificationApi
        .putEditInvoice(mapDataVerif())
        .then(() => {
          verificationApi.resetDetailInvoiceEdit()
          const idModal = document.querySelector('#success_data_edit_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
        })
        .finally(() => {
          isLoading.value = false
        })
    } else {
      router.push({
        name: 'invoiceDetail',
        query: {
          id: route.query.id,
          type: route.query.type,
        },
      })
    }
  }
}

const mapDataEditPoGr = () => {
  const result = [] as itemsPoGrType[]
  if (verificationApi.detailInvoiceEdit) {
    for (const item of verificationApi.detailInvoiceEdit.invoicePoGr) {
      result.push({
        ...item,
        isEdit: false,
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
        whtAmount: 0,
        isEdit: false,
      })
    }
  }
  return result
}

const mapDocument = (data: documentDetailTypesStore | null) => {
  if (!data) return null
  return {
    id: data.id,
    name: data.documentName,
    path: data.documentUrl,
    fileSize: data.documentSize ? data.documentSize.toString() : '0',
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
    invoicePoGr: mapDataEditPoGr(),
    additionalCosts: mapDataEditAdditional(),
    invoiceItem: [],
    invoiceDocument: mapDocument(data?.invoiceDocument || null),
    tax: mapDocument(data?.tax || null),
    referenceDocument: mapDocument(data?.referenceDocument || null),
    otherDocument: mapDocument(data?.otherDocument || null),
    creditCardBillingId: data?.creditCardBillingId || '',
    isAlternativePayee: false,
    isOneTimeVendor: false,
    nameAlternative: '',
    nameOtherAlternative: '',
    streetAltiernative: '',
    cityAlternative: '',
    countryAlternative: '',
    bankAccountNumberAlternative: '',
    bankKeyAlternative: '',
    bankCountryAlternative: '',
    npwpNumberAlternative: '',
    ktpNumberAlternative: '',
    emailAlternative: '',
  }
}

const setDataDefault = () => {
  const invoiceType = route.query.invoiceType

  const data = invoiceType === 'no_po' ? detailInvoiceNonPO.value : detailInvoice.value
  const resultPoGr: itemsPoGrType[] = []
  const resultAdditional: itemsCostType[] = []
  let invoice = {} as documentDetailTypes
  let tax = {} as documentDetailTypes
  let reference = {} as documentDetailTypes
  let other = {} as documentDetailTypes

  for (const item of data?.pogr || []) {
    resultPoGr.push({
      ...item,
      vatAmount: 0,
      isEdit: false,
    })
  }

  for (const item of data?.additionalCosts || []) {
    resultAdditional.push({
      ...item,
      whtCodeList: [],
      isEdit: false,
    })
  }

  for (const item of data?.documents || []) {
    const data = {
      id: item.id,
      name: item.documentName,
      path: item.documentUrl,
      fileSize: item.documentSize ? item.documentSize.toString() : '0',
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
    creditCardBillingId: data?.header.creditCardBillingId || '',
    isAlternativePayee: false,
    isOneTimeVendor: false,
    nameAlternative: '',
    nameOtherAlternative: '',
    streetAltiernative: '',
    cityAlternative: '',
    countryAlternative: '',
    bankAccountNumberAlternative: '',
    bankKeyAlternative: '',
    bankCountryAlternative: '',
    npwpNumberAlternative: '',
    ktpNumberAlternative: '',
    emailAlternative: '',
  }
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

const mapPoGr = () => {
  const poGr = []
  for (const item of form.value.invoicePoGr) {
    poGr.push({
      id: item.id,
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
      id: item.id,
      activityId: item.activityId,
      activityExpense: item.activityExpense,
      activityName: item.activityName,
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
      whtAmount: item.whtAmount,
    })
  }
  return cost
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

  if (route.query.invoiceType === 'no_po') {
    verificationApi.getInvoiceNonPoDetail(route.query.id?.toString() || '').then(() => {
      if (verificationApi.isFromEdit) {
        setDataEdit()
      } else {
        setDataDefault()
      }
    })
  } else {
    verificationApi.getInvoiceDetail(route.query.id?.toString() || '').then(() => {
      if (verificationApi.isFromEdit) {
        setDataEdit()
      } else {
        setDataDefault()
      }
    })
  }
})

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-detail-edit.scss';
</style>
