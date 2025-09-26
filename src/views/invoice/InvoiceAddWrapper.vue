<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus :active-name="stepperStatus" />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" class="-mx-[24px]" />
    <!-- <div v-if="form.status !== 0" class="status__box--approved -mt-5 -mx-[24px]">
      <i class="ki-outline ki-shield-tick text-primary text-[36px]"></i>
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Submitted</p>
        <p class="text-[13px] font-medium text-gray-700">
          The invoice has been successfully submitted. You can now download the invoice PDF for your records.
        </p>
      </div>
    </div> -->
    <div>
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div
        v-if="checkIsNonPo()"
        class="flex align-items-center justify-between gap-[8px] mt-[24px]"
      >
        <div class="flex-1 flex gap-[8px]">
          <button class="btn btn-outline btn-primary" :disabled="isSubmit" @click="goBack">
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>
          <button class="btn btn-outline btn-primary" :disabled="isSubmit" @click="goSaveDraft">
            Save as Draft
            <i class="ki-duotone ki-bookmark"></i>
          </button>
        </div>
        <div class="flex-1 flex gap-[8px] justify-end">
          <button
            v-if="tabNow === 'information'"
            class="btn btn-primary"
            :disabled="isSubmit || checkFormBudget()"
            @click="checkBudget"
          >
            Budget Checking
            <i class="ki-duotone ki-dollar"></i>
          </button>
          <button
            class="btn btn-primary"
            :disabled="isSubmit || (!isCheckBudget && tabNow === 'information')"
            @click="goNext"
          >
            {{ tabNow !== 'preview' ? 'Next' : 'Submit' }}
            <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
            <i v-else class="ki-duotone ki-paper-plane"></i>
          </button>
        </div>
      </div>
      <div
        v-else-if="
          (form.status === 0 || form.status === -1 || form.status === 5) &&
          !checkInvoiceView() &&
          !checkInvoiceNonPoView()
        "
        class="flex justify-between items-center gap-[8px] mt-[24px]"
      >
        <button class="btn btn-outline btn-primary" :disabled="isSubmit" @click="goSaveDraft">
          Save as Draft
          <i class="ki-duotone ki-bookmark"></i>
        </button>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" :disabled="isSubmit" @click="goBack">
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>
          <button class="btn btn-primary" :disabled="isSubmit" @click="goNext">
            {{ tabNow !== 'preview' ? 'Next' : 'Submit' }}
            <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
            <i v-else class="ki-duotone ki-paper-plane"></i>
          </button>
        </div>
      </div>
      <div v-else class="flex justify-end items-center mt-[24px]">
        <button
          v-if="tabNow !== 'preview' || checkInvoiceView() || checkInvoiceNonPoView()"
          class="btn btn-outline btn-primary"
          :disabled="isSubmit"
          @click="goBack"
        >
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button
          v-if="tabNow !== 'preview' && !checkInvoiceView() && !checkInvoiceNonPoView()"
          class="btn btn-primary"
          :disabled="isSubmit"
          @click="goNext"
        >
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button
          v-if="tabNow === 'preview' && !checkInvoiceView() && !checkInvoiceNonPoView()"
          class="btn btn-primary"
          :disabled="isSubmit"
        >
          Save as PDF
          <iconPDF />
        </button>
      </div>
    </div>
    <ModalSuccess :isDraft="isClickDraft" @afterClose="goToList" />
    <ModalErrorDocumentNumberModal />
    <ModalSuccessBudgetCheck @afterClose="isCheckBudget = true" />
    <ModalFailedBudgetCheck @afterClose="isCheckBudget = false" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  provide,
  type Component,
  defineAsyncComponent,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import type { formTypes } from './types/invoiceAddWrapper'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from '@/components/invoice/TabInvoice.vue'
import iconPDF from '@/components/icons/iconPDF.vue'
import { KTModal } from '@/metronic/core'
import { useCheckEmpty } from '@/composables/validation'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useNotifInvoiceEmailStore } from '@/stores/views/invoice/email'
import type {
  ParamsSubmissionTypes,
  ParamsSubmissionNonPo,
  ParamsCheckBudgetType,
  GlaccountDatum,
  AccountPayable,
  Accounttax,
  Currencyamount,
} from '@/stores/views/invoice/types/submission'
import { useLoginStore } from '@/stores/views/login'
import moment from 'moment'
import type { itemsPoGrType } from './types/invoicePoGr'
import type { itemsCostType } from './types/additionalCost'
import type { invoiceItemTypes } from './types/invoiceItem'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/InvoiceInformation.vue'),
)
const InvoicePreview = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoicePreview.vue'))
const ModalSuccess = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/InvoicePreview/ModalSuccess.vue'),
)
const ModalErrorDocumentNumberModal = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/ErrorDocumentNumberModal.vue'),
)
const ModalSuccessBudgetCheck = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/ModalSuccessBudgetCheck.vue'),
)
const ModalFailedBudgetCheck = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/ModalFailedBudgetCheck.vue'),
)

const invoiceApi = useInvoiceSubmissionStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const notifEmailApi = useNotifInvoiceEmailStore()
const loginApi = useLoginStore()
const router = useRouter()
const route = useRoute()
const tabNow = ref<string>('data')
const isSubmit = ref<boolean>(false)
const isCheckBudget = ref<boolean>(false)
const isClickDraft = ref<boolean>(false)
const itemNoAcc = ref<number>(0)

const stepperStatus = ref('')

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

const form = reactive<formTypes>({
  invoiceUId: '',
  invoiceType: '901',
  invoiceTypeName: 'PO',
  vendorId: '',
  vendorName: '',
  npwp: '',
  address: '',
  bankKeyId: '',
  bankNameId: '',
  beneficiaryName: '',
  bankAccountNumber: '',
  swiftCode: '',
  bankAddress: '',
  bankCountryCode: '',
  invoiceNo: '',
  companyCode: '',
  companyName: '',
  invoiceNoVendor: '',
  invoiceDate: '',
  taxNumber: '',
  invoiceDp: '9011',
  amountInvoice: '',
  taxNoInvoice: '',
  remainingDpAmount: '',
  dpAmountDeduction: '',
  currency: 'IDR',
  description: '',
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
  subtotal: 0,
  vatAmount: 0,
  whtAmount: 0,
  additionalCostCalc: 0,
  totalGrossAmount: 0,
  totalNetAmount: 0,
  invoicePoGr: [],
  invoiceItem: [],
  additionalCost: [],
  status: -1,
  idAlternativePayment: 0,
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
  vendorNumber: '123456',
  department: '',
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation,
    preview: InvoicePreview,
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const listDocumentType = computed(() => invoiceMasterApi.documentType)
const vendorList = computed(() => invoiceMasterApi.vendorList)
const invoiceDpList = computed(() => invoiceMasterApi.dpType)
const detailPo = computed(() => invoiceApi.detailPo)
const detailNonPo = computed(() => invoiceApi.detailNonPo)
const userData = computed(() => loginApi.userData)
const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const listActivity = computed(() => invoiceMasterApi.activityList)
const additionalCostTempDelete = computed(() => verificationApi.additionalCostTempDelete)
const costExpensesTempDelete = computed(() => verificationApi.costExpenseTempDelete)

const checkInvoiceView = () => {
  return route.query.type === 'po-view'
}

const checkInvoiceNonPoView = () => {
  return route.query.type === 'non-po-view'
}

const checkIsNonPo = () => {
  return route.query.type === 'nonpo'
}

const checkInvoiceData = () => {
  form.vendorIdError = useCheckEmpty(form.vendorId).isError
  form.bankKeyIdError = useCheckEmpty(form.bankKeyId).isError
  if (route.query.path === 'po') form.invoiceTypeError = useCheckEmpty(form.invoiceType).isError

  if (form.vendorIdError || form.bankKeyIdError || form.invoiceTypeError) return false
  else return true
}

const checkActiveEditPoGr = () => {
  let status = false
  for (const item of form.invoicePoGr) {
    if (status) return
    if (item.isEdit) status = true
  }
  return status
}

const checkActiveEditAdditional = () => {
  let status = false
  for (const item of form.additionalCost) {
    if (status) return
    if (item.isEdit) status = true
  }
  return status
}

const checkFieldAdditional = () => {
  let status = false
  for (const item of form.additionalCost) {
    if (status) return
    if (!item.activity || !item.itemAmount || !item.debitCredit || !item.taxCode) status = true
  }
  return status
}

const checkActiveEditInvoiceItem = () => {
  let status = false
  for (const item of form.invoiceItem) {
    if (status) return
    if (item.isEdit) status = true
  }
  return status
}

const checkInvoiceInformation = () => {
  form.companyCodeError = useCheckEmpty(form.companyCode).isError
  form.invoiceNoVendorError = useCheckEmpty(form.invoiceNoVendor).isError
  form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
  form.invoiceDocumentError = form.invoiceDocument === null

  if (!checkIsNonPo()) {
    form.invoicePoGrError = form.invoicePoGr.length === 0 || checkActiveEditPoGr()
    form.additionalCostError = checkActiveEditAdditional() || checkFieldAdditional()
  } else {
    form.invoiceItemError = form.invoiceItem.length === 0 || checkActiveEditInvoiceItem()
    form.departmentError = useCheckEmpty(form.department).isError
  }

  if (form.invoiceType !== '903') {
    form.descriptionError = useCheckEmpty(form.description).isError
  }

  if (Number(form.invoiceDp) === 9013) {
    form.dpAmountDeductionError = Number(form.dpAmountDeduction) > Number(form.remainingDpAmount)
  }

  if (
    form.companyCodeError ||
    form.invoiceNoVendorError ||
    form.invoiceDateError ||
    form.descriptionError ||
    form.invoiceDocumentError ||
    form.invoicePoGrError ||
    form.additionalCostError ||
    form.dpAmountDeductionError ||
    form.departmentError
  )
    return false
  else return true
}

const setTab = (value: string) => {
  tabNow.value = value
}
const goBack = () => {
  const list = ['data', 'information', 'preview']
  const checkIndex = list.findIndex((item) => item === tabNow.value)
  if (checkIndex === 0 || checkInvoiceView() || checkInvoiceNonPoView()) {
    const nameRoute =
      checkInvoiceView() || (!checkIsNonPo() && !checkInvoiceNonPoView())
        ? 'invoice'
        : 'invoice-list-non-po'
    router.push({
      name: nameRoute,
    })
  }
  if (checkIndex !== -1 && checkIndex !== 0) {
    tabNow.value = list[checkIndex - 1]
  }
}

const mapDocument = () => {
  const document = []
  const libDocument = ['invoiceDocument', 'tax', 'referenceDocument', 'otherDocument']
  for (const [index, item] of libDocument.entries()) {
    if (form[item as keyof typeof form]) {
      document.push({
        id: form[item].id || 0,
        documentType: Number(listDocumentType.value[index].code),
        documentName: form[item].name,
        documentUrl: form[item].path,
        documentSize: Number(form[item].fileSize),
      })
    }
  }
  return document
}

const mapPoGr = () => {
  const poGr = []
  for (const item of form.invoicePoGr) {
    poGr.push({
      id: item.id || 0,
      poNo: item.poNo,
      poItem: Number(item.poItem),
      grDocumentNo: item.grDocumentNo,
      grDocumentItem: Number(item.grDocumentItem),
      grDocumentDate: item.grDocumentDate
        ? moment(item.grDocumentDate, 'YYYY').startOf('year').format('YYYY-MM-DD')
        : null,
      taxCode: item.taxCode,
      vatAmount: item.vatAmount || 0,
      itemAmount: form.currency === item.currencyLC ? item.itemAmountLC : item.itemAmountTC,
      quantity: Number(item.quantity),
      uom: item.uom,
      itemText: item.itemText,
      conditionType: item.conditionType,
      conditionTypeDesc: item.conditionTypeDesc,
      qcStatus: item.qcStatus,
      whtType: '',
      whtCode: '',
      whtBaseAmount: item.whtBaseAmount,
      whtAmount: 0,
      department: item.department,
    })
  }
  return poGr
}

const mapAdditionalCost = () => {
  const cost = []
  for (const item of form.additionalCost) {
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === item.activity)
    cost.push({
      activityId: item.activity,
      activityExpense: listActivity.value[itemIndex].code,
      activityName: listActivity.value[itemIndex].name,
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
      whtAmount: 0,
    })
  }
  return cost
}

const mapInvoiceItem = () => {
  const cost = []
  for (const item of form.invoiceItem) {
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === item.activity)
    cost.push({
      id: item.id || 0,
      activityId: item.activity,
      activityExpenses: listActivity.value[itemIndex].code,
      activityName: listActivity.value[itemIndex].name,
      itemAmount: Number(item.itemAmount),
      itemText: item.itemText,
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

const getVendorName = () => {
  const getIndex = vendorList.value.findIndex((item) => item.sapCode === form?.vendorId)
  if (getIndex !== -1) return vendorList.value[getIndex].vendorName
}

const getDpName = () => {
  const getIndex = invoiceDpList.value.findIndex((item) => item.code === form?.invoiceDp)
  if (getIndex !== -1) return invoiceDpList.value[getIndex].name
}

const mapDataPost = () => {
  const data = {
    header: {
      invoiceUId:
        form.status === 0 || form.status === 5
          ? form.invoiceUId
          : '00000000-0000-0000-0000-000000000000',
      invoiceTypeCode: Number(form.invoiceType),
      invoiceTypeName: form.invoiceTypeName,
      invoiceDPCode: form.invoiceType === '901' ? Number(form.invoiceDp) : null,
      invoiceDPName: form.invoiceType === '901' ? getDpName() : '',
      companyCode: form.companyCode,
      companyName: form.companyName,
      invoiceNo: form.invoiceNo,
      documentNo: form.invoiceNoVendor,
      invoiceDate: moment(form.invoiceDate).toISOString(),
      taxNo: form.taxNoInvoice,
      currCode: form.currency,
      notes: form.description,
      statusCode: isClickDraft.value ? 0 : 1,
      statusName: isClickDraft.value ? 'Drafted' : 'Waiting to Verify',
    },
    vendor: {
      vendorId: Number(form.vendorId),
      vendorName: getVendorName(),
      npwp: form.npwp,
      vendorAddress: form.address,
    },
    payment: {
      bankKey: form.bankKeyId,
      bankName: form.bankNameId,
      beneficiaryName: form.beneficiaryName,
      bankAccountNo: form.bankAccountNumber,
      bankCountryCode: form.bankCountryCode,
    },
    documents: mapDocument(),
    calculation: {
      subtotal: form.subtotal,
      vatAmount: form.vatAmount,
      whtAmount: form.whtAmount,
      additionalCost: form.additionalCostCalc,
      totalGrossAmount: form.totalGrossAmount,
      totalNetAmount: form.totalNetAmount,
    },
    pogr: mapPoGr(),
    additionalCosts:
      form.invoiceDp === '9012' || form.invoiceDp === '9013' ? [] : mapAdditionalCost(),
  } as ParamsSubmissionTypes

  return data
}

const mapDataPostNonPo = () => {
  const data = {
    header: {
      invoiceUId:
        form.status === 0 || form.status === 5
          ? form.invoiceUId
          : '00000000-0000-0000-0000-000000000000',
      invoiceTypeCode: Number(form.invoiceType),
      invoiceTypeName: form.invoiceTypeName,
      invoiceVendorNo: form.vendorId,
      companyCode: form.companyCode,
      companyName: form.companyName,
      invoiceNo: form.invoiceNo,
      documentNo: form.invoiceNoVendor,
      invoiceDate: moment(form.invoiceDate).toISOString(),
      postingDate: null,
      estimatedPaymentDate: null,
      paymentMethodCode: '',
      paymentMethodName: '',
      taxNo: form.taxNoInvoice,
      currCode: form.currency,
      creditCardBillingID: '',
      notes: form.description,
      statusCode: isClickDraft.value ? 0 : 1,
      statusName: isClickDraft.value ? 'Drafted' : 'Waiting to Verify',
      department: checkIsNonPo() ? form.department : userData.value.profile.costCenter || '',
      profileId: userData.value.profile.profileId.toString(),
    },
    vendor: {
      vendorId: Number(form.vendorId),
      vendorName: getVendorName(),
      npwp: form.npwp,
      vendorAddress: form.address,
    },
    payment: {
      bankKey: form.bankKeyId,
      bankName: form.bankNameId,
      beneficiaryName: form.beneficiaryName,
      bankAccountNo: form.bankAccountNumber,
      bankCountryCode: form.bankCountryCode,
    },
    documents: mapDocument(),
    calculation: {
      subtotal: form.subtotal,
      vatAmount: form.vatAmount,
      whtAmount: form.whtAmount,
      additionalCost: form.additionalCostCalc,
      totalGrossAmount: form.totalGrossAmount,
      totalNetAmount: form.totalNetAmount,
    },
    alternativePay: {
      id: form.idAlternativePayment,
      invoiceUId:
        form.status === 0 || form.status === 5
          ? form.invoiceUId
          : '00000000-0000-0000-0000-000000000000',
      name: form.nameAlternative,
      name2: form.nameOtherAlternative,
      street: form.streetAltiernative,
      city: form.cityAlternative,
      country: form.countryAlternative,
      bankAccountNumber: form.bankAccountNumberAlternative,
      bankKey: form.bankKeyAlternative,
      bankCountry: form.bankCountryAlternative,
      npwp: form.npwpNumberAlternative,
      ktp: form.ktpNumberAlternative,
      email: form.emailAlternative,
      isAlternativePayee: form.isAlternativePayee,
      isOneTimeVendor: form.isOneTimeVendor,
    },
    costExpenses: mapInvoiceItem(),
  } as ParamsSubmissionNonPo

  return data
}

const goNext = () => {
  const list = ['data', 'information', 'preview']
  if (tabNow.value !== 'preview') {
    if (form.status === 0 || form.status === -1 || form.status === 5) {
      if (tabNow.value === 'data') {
        const check = checkInvoiceData()
        if (!check) return
      } else {
        const check = checkInvoiceInformation()
        if (!check) return
      }
    }
    const checkIndex = list.findIndex((item) => item === tabNow.value)
    if (checkIndex !== -1) {
      tabNow.value = list[checkIndex + 1]
    }
  } else {
    isSubmit.value = true
    if (route.query.type === 'nonpo') {
      invoiceApi
        .postSubmissionNonPo(mapDataPostNonPo())
        .then((response) => {
          setAfterResponsePost(response)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          isSubmit.value = false
        })
    } else {
      invoiceApi
        .postSubmission(mapDataPost())
        .then((response) => {
          setAfterResponsePost(response)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          isSubmit.value = false
        })
    }
  }
}

const goToList = () => {
  isClickDraft.value = false
  const nameRoute = !checkIsNonPo() ? 'invoice' : 'invoice-list-non-po'
  router.push({
    name: nameRoute,
  })
}

const goSaveDraft = () => {
  isSubmit.value = true
  isClickDraft.value = true
  if (route.query.type === 'nonpo') {
    const data = mapDataPostNonPo()
    data.header.statusCode = 0
    data.header.statusName = 'Draft'
    invoiceApi
      .postSubmissionNonPo(data)
      .then((response) => {
        setAfterResponsePost(response)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        isSubmit.value = false
      })
  } else {
    const data = mapDataPost()
    data.header.statusCode = 0
    data.header.statusName = 'Draft'
    invoiceApi
      .postSubmission(data)
      .then((response) => {
        setAfterResponsePost(response)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        isSubmit.value = false
      })
  }
}

const setAfterResponsePost = (response) => {
  if (response.statusCode === 200) {
    const idModal = document.querySelector('#success_invoice_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
    if (form.invoiceUId) {
      if (route.query.type === 'nonpo') {
        for (const item of costExpensesTempDelete.value) {
          console.log('non po')
          verificationApi.deleteCostExpense(form.invoiceUId, item)
        }
      } else {
        for (const item of additionalCostTempDelete.value) {
          console.log('po')
          verificationApi.deleteAdditionalCost(form.invoiceUId, item)
        }
      }
    }
  } else {
    if (response.result.message.includes('Invoice Document Number')) {
      const idModal = document.querySelector('#error_document_number_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    }
  }
}

const setData = () => {
  const detail = detailPo.value

  if (form && detail) {
    form.status = detail.header.statusCode
    form.invoiceUId = detail.header.invoiceUId
    form.invoiceType = detail.header.invoiceTypeCode ? detail.header.invoiceTypeCode.toString() : ''
    form.vendorId = detail.vendor.vendorId ? detail.vendor.vendorId.toString() : ''
    form.npwp = detail.vendor.npwp
    form.address = detail.vendor.vendorAddress
    form.bankKeyId = detail.payment.bankKey
    form.bankNameId = detail.payment.bankName
    form.beneficiaryName = detail.payment.beneficiaryName
    form.bankAccountNumber = detail.payment.bankAccountNo
    form.bankCountryCode = detail.payment.bankCountryCode
    form.invoiceDp = detail.header.invoiceDPCode ? detail.header.invoiceDPCode.toString() : ''
    form.companyCode = detail.header.companyCode
    form.invoiceNoVendor = detail.header.documentNo ? detail.header.documentNo.toString() : ''
    form.invoiceNo = detail.header.invoiceNo ? detail.header.invoiceNo.toString() : ''
    form.invoiceDate = detail.header.invoiceDate
    form.taxNoInvoice = detail.header.taxNo
    form.currency = detail.header.currCode
    form.description = detail.header.notes
    form.subtotal = detail.calculation.subtotal
    form.vatAmount = detail.calculation.vatAmount
    form.additionalCostCalc = detail.calculation.additionalCost
    form.whtAmount = detail.calculation.whtAmount
    form.totalGrossAmount = detail.calculation.totalGrossAmount
    form.totalNetAmount = detail.calculation.totalNetAmount
    form.invoicePoGr = []
    for (const item of detail.pogr) {
      const data = {
        id: item.id,
        poNo: item.poNo,
        poItem: item.poItem,
        grDocumentNo: item.grDocumentNo,
        grDocumentItem: item.grDocumentItem,
        grDocumentDate: item.grDocumentDate,
        taxCode: item.taxCode,
        vatAmount: item.vatAmount,
        currencyLC: form.currency,
        currencyTC: form.currency,
        itemAmountLC: item.itemAmount,
        itemAmountTC: item.itemAmount,
        quantity: item.quantity,
        uom: item.uom,
        itemText: item.itemText,
        currency: 'IDR',
        conditionType: item.conditionType,
        conditionTypeDesc: item.conditionTypeDesc,
        qcStatus: item.qcStatus,
        postingDate: '',
        enteredOn: '',
        purchasingOrg: '',
        department: item.department,
        whtType: item.whtType,
        whtCode: item.whtCode,
        whtBaseAmount: item.whtBaseAmount,
        whtAmount: item.whtAmount,
        isEdit: false,
      } as itemsPoGrType
      form.invoicePoGr.push(data)
    }
    form.additionalCost = []
    for (const item of detail.additionalCosts) {
      const data = {
        id: item.id,
        activity: item.activityId,
        activityCode: item.activityExpense,
        activityName: item.activityName,
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
        isEdit: false,
      } as itemsCostType
      form.additionalCost.push(data)
    }

    for (const doc of detail.documents) {
      switch (doc.documentType) {
        case 1:
          form.invoiceDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 2:
          form.tax = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 3:
          form.referenceDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 4:
          form.otherDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
      }
    }
  }
}

const setDataNonPo = () => {
  const detail = detailNonPo.value
  if (form && detail) {
    form.status = detail.header.statusCode
    form.invoiceUId = detail.header.invoiceUId
    form.invoiceType = detail.header.invoiceTypeCode ? detail.header.invoiceTypeCode.toString() : ''
    form.vendorId = detail.vendor.vendorId ? detail.vendor.vendorId.toString() : ''
    form.npwp = detail.vendor.npwp
    form.address = detail.vendor.vendorAddress
    form.bankKeyId = detail.payment.bankKey
    form.bankNameId = detail.payment.bankName
    form.beneficiaryName = detail.payment.beneficiaryName
    form.bankAccountNumber = detail.payment.bankAccountNo
    form.bankCountryCode = detail.payment.bankCountryCode
    form.invoiceDp = detail.header.invoiceDPCode ? detail.header.invoiceDPCode.toString() : ''
    form.companyCode = detail.header.companyCode
    form.invoiceNoVendor = detail.header.documentNo ? detail.header.documentNo.toString() : ''
    form.invoiceNo = detail.header.invoiceNo ? detail.header.invoiceNo.toString() : ''
    form.invoiceDate = detail.header.invoiceDate
    form.taxNoInvoice = detail.header.taxNo
    form.currency = detail.header.currCode
    form.description = detail.header.notes
    form.subtotal = detail.calculation.subtotal
    form.vatAmount = detail.calculation.vatAmount
    form.additionalCostCalc = detail.calculation.additionalCost
    form.totalGrossAmount = detail.calculation.totalGrossAmount
    form.totalNetAmount = detail.calculation.totalNetAmount
    form.department = detail.header.department

    const dataAlternativePayee = detail.alternativePayee[0]
    form.isAlternativePayee = dataAlternativePayee ? dataAlternativePayee.isAlternativePayee : false
    form.isOneTimeVendor = dataAlternativePayee ? dataAlternativePayee.isOneTimeVendor : false
    form.nameAlternative = dataAlternativePayee ? dataAlternativePayee.name : '-'
    form.nameOtherAlternative = dataAlternativePayee ? dataAlternativePayee.name2 : '-'
    form.streetAltiernative = dataAlternativePayee ? dataAlternativePayee.street : '-'
    form.cityAlternative = dataAlternativePayee ? dataAlternativePayee.city : '-'
    form.countryAlternative = dataAlternativePayee ? dataAlternativePayee.country : '-'
    form.bankAccountNumberAlternative = dataAlternativePayee
      ? dataAlternativePayee.bankAccountNumber
      : '-'
    form.bankKeyAlternative = dataAlternativePayee ? dataAlternativePayee.bankKey : '-'
    form.bankCountryAlternative = dataAlternativePayee ? dataAlternativePayee.bankCountry : '-'
    form.npwpNumberAlternative = dataAlternativePayee ? dataAlternativePayee.npwp : '-'
    form.ktpNumberAlternative = dataAlternativePayee ? dataAlternativePayee.ktp : '-'
    form.emailAlternative = dataAlternativePayee ? dataAlternativePayee.email : '-'

    form.invoiceItem = []
    for (const item of detail.costExpense) {
      const data = {
        id: item.id,
        activity: item.activityId,
        activityCode: item.activityExpenses,
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
        whtBaseAmount: item.whtBaseAmount.toString(),
        whtAmount: item.whtAmount ? item.whtAmount.toString() : '0',
        whtCodeList: [],
        isEdit: false,
      } as invoiceItemTypes
      form.invoiceItem.push(data)
    }

    for (const doc of detail.documents) {
      switch (doc.documentType) {
        case 1:
          form.invoiceDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 2:
          form.tax = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 3:
          form.referenceDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
        case 4:
          form.otherDocument = {
            id: doc.id,
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl,
          }
          break
      }
    }
  }
}

const mapDataCheck = () => {
  itemNoAcc.value = 0
  const glAccount = [] as GlaccountDatum[]
  const accountPayable = [] as AccountPayable[]
  const accountTax = [] as Accounttax[]
  const currencyAmount = [] as Currencyamount[]

  for (const item of form.invoiceItem) {
    itemNoAcc.value += 1
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === item.activity)
    const glData = {
      ITEMNO_ACC: itemNoAcc.value,
      GL_ACCOUNT: listActivity.value[itemIndex].code,
      ITEM_TEXT: item.itemText,
      ALLOC_NMBR: '',
      TAX_CODE: item.taxCode,
      COSTCENTER: item.costCenter,
      PROFIT_CTR: '',
    }
    glAccount.push(glData)
  }

  itemNoAcc.value += 1
  const accData = {
    ITEMNO_ACC: itemNoAcc.value,
    VENDOR_NO: form.vendorId,
    REF_KEY_1: form.npwp,
    REF_KEY_2: '',
    REF_KEY_3: '',
    BLINE_DATE: '',
    PMNTTRMS: '',
    PYMT_METH: '',
    ALLOC_NMBR: '',
    ITEM_TEXT: form.invoiceNoVendor,
    TAX_CODE: form.invoiceItem[0].taxCode,
    PAYMT_REF: '',
  }
  accountPayable.push(accData)

  for (const item of accountPayable) {
    if (item.TAX_CODE !== 'V0') {
      const index = listTaxCalculation.value.findIndex((sub) => sub.code === item.TAX_CODE)
      if (index !== -1) {
        itemNoAcc.value += 1
        const taxData = {
          ITEMNO_ACC: itemNoAcc.value,
          TAX_CODE: item.TAX_CODE,
          TAX_RATE: listTaxCalculation.value[index].value,
        }
        accountTax.push(taxData)
      }
    }
  }

  itemNoAcc.value = 0

  for (const item of form.invoiceItem) {
    itemNoAcc.value += 1
    const currData = {
      ITEMNO_ACC: itemNoAcc.value,
      CURRENCY: form.currency,
      AMT_DOCCUR: item.itemAmount,
      AMT_BASE: 0,
    }
    currencyAmount.push(currData)
  }

  let totalItemAmountCurr = 0
  let totalVatAmountCurr = 0
  for (const item of form.invoiceItem) {
    totalItemAmountCurr += item.itemAmount
    totalVatAmountCurr += item.vatAmount
  }
  itemNoAcc.value += 1
  const currData = {
    ITEMNO_ACC: itemNoAcc.value,
    CURRENCY: form.currency,
    AMT_DOCCUR: (totalItemAmountCurr + totalVatAmountCurr) * -1,
    AMT_BASE: 0,
  }
  currencyAmount.push(currData)

  for (const item of accountTax) {
    if (item.TAX_CODE !== 'V0') {
      const filterTax = form.invoiceItem.filter((sub) => sub.taxCode === item.TAX_CODE)
      if (filterTax.length !== 0) {
        itemNoAcc.value += 1
        let totalVat = 0
        let totalAmount = 0
        for (const subItem of filterTax) {
          totalVat += subItem.vatAmount
          totalAmount += subItem.itemAmount
        }
        const currData = {
          ITEMNO_ACC: itemNoAcc.value,
          CURRENCY: form.currency,
          AMT_DOCCUR: totalVat,
          AMT_BASE: totalAmount,
        }
        currencyAmount.push(currData)
      }
    }
  }

  const data = {
    REQUEST: {
      HEADER_TXT: form.taxNoInvoice,
      COMP_CODE: form.companyCode,
      DOC_DATE: moment(form.invoiceDate).format('YYYYMMDD'),
      REF_DOC_NO: form.invoiceNoVendor,
      CUSTOMERCPD: {
        NAME: form.nameAlternative,
        NAME_2: form.nameOtherAlternative,
        POSTL_CODE: '',
        CITY: form.cityAlternative,
        COUNTRY: form.countryAlternative,
        STREET: form.streetAltiernative,
        BANK_ACCT: form.bankAccountNumberAlternative,
        BANK_NO: form.bankKeyAlternative,
        BANK_CTRY: form.bankCountryAlternative,
        TAX_NO_1: form.npwpNumberAlternative,
        TAX_NO_3: form.ktpNumberAlternative,
        LANGU_ISO: '',
        GLO_RE1_OT: '',
      },
      GLACCOUNT_DATA: glAccount,
      ACCOUNT_PAYABLE: accountPayable,
      ACCOUNTTAX: accountTax,
      CURRENCYAMOUNT: currencyAmount,
    },
  } as ParamsCheckBudgetType

  return data
}

const checkBudget = () => {
  const data = mapDataCheck()
  invoiceApi
    .postCheckBudget(data)
    .then(() => {
      const idModal = document.querySelector('#success_budget_check_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    })
    .catch(() => {
      const idModal = document.querySelector('#failed_budget_check_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()
    })
}

const checkFormBudget = () => {
  let status = false
  if (
    !form.companyCode ||
    !form.invoiceNoVendor ||
    !form.invoiceDate ||
    !form.description ||
    !form.invoiceDocument ||
    form.invoiceItem.length === 0
  )
    status = true

  for (const item of form.invoiceItem) {
    if (item.isEdit || !item.itemAmount || !item.taxCode) status = true
  }

  return status
}

const setStepperStatus = () => {
  if (detailNonPo.value.header.statusCode === 1) {
    stepperStatus.value = 'Submission'
  } else if (detailNonPo.value.header.statusCode === 2) {
    stepperStatus.value = 'Approval'
  }
}

onMounted(() => {
  invoiceMasterApi.getTaxCode()
  if (!checkIsNonPo()) invoiceMasterApi.getInvoicePoType()
  else invoiceMasterApi.getInvoiceNonPoType()
  invoiceMasterApi.getDocumentTypes()
  invoiceMasterApi.getVendorList()
  if (loginApi.isVendor) {
    form.invoiceType = '901'
  }

  if (route.query.type === 'nonpo') {
    form.invoiceType = '1'
    form.invoiceTypeName = 'Reimbursement'
  }

  if (route.query.type === 'po-view' || route.query.type === 'non-po-view') {
    tabNow.value = 'preview'
  }

  if (
    route.query.type === 'non-po-view' ||
    (route.query.invoice &&
      route.query.type !== 'non-po-view' &&
      route.query.type !== 'po-view' &&
      route.query.type === 'nonpo')
  ) {
    invoiceApi.getNonPoDetail(route.query.invoice?.toString() || '').then(() => {
      setStepperStatus()
      setDataNonPo()
    })
  }

  if (
    route.query.type === 'po-view' ||
    (route.query.invoice &&
      route.query.type !== 'non-po-view' &&
      route.query.type !== 'po-view' &&
      route.query.type === 'po')
  ) {
    invoiceApi.getPoDetail(route.query.invoice?.toString() || '').then(() => {
      setData()
    })
  }
})

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-submission.scss';
</style>
