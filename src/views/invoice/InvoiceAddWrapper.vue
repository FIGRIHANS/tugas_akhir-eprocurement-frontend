<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus :active-name="stepperStatus" />
    <TabInvoice
      :active-tab="tabNow"
      :can-click-data="true"
      :can-click-information="canClickInformationTab"
      :can-click-preview="canClickPreviewTab"
      @change-tab="setTab"
      class="-mx-[24px]"
    />
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
            :disabled="
              isSubmit ||
              (!isCheckBudget && tabNow === 'information') ||
              (tabNow === 'information' && !checkInvoiceInformation()) ||
              (tabNow === 'data' && !isAlternativePayeeFilled())
            "
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
          <button
            class="btn btn-primary"
            :disabled="isSubmit || (tabNow === 'data' && !isAlternativePayeeFilled())"
            @click="goNext"
          >
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
          :disabled="
            isSubmit ||
            (tabNow === 'information' && !checkInvoiceInformation()) ||
            (tabNow === 'data' && !isAlternativePayeeFilled())
          "
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
    <ErrorSubmissionModal />
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
  watch,
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
import type {
  ParamsSubmissionTypes,
  ParamsSubmissionNonPo,
  ParamsCheckBudgetType,
  ParamsSubmissionCostExpense,
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
const ErrorSubmissionModal = defineAsyncComponent(
  () => import('./InvoiceAddWrapper/ErrorSubmissionModal.vue'),
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
const loginApi = useLoginStore()
const router = useRouter()
const route = useRoute()
const tabNow = ref<string>('data')
const isSubmit = ref<boolean>(false)
const isCheckBudget = ref<boolean>(false)
const isClickDraft = ref<boolean>(false)
const itemNoAcc = ref<number>(0)
const hasCompletedDataTab = ref<boolean>(false)

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
  paymentId: 0,
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
  invoiceVendorNo: '',
  invoiceDate: '',
  taxNumber: '',
  invoiceDp: '9011',
  amountInvoice: '',
  taxNoInvoice: '',
  remainingDpAmount: 0,
  dpAmountDeduction: 0,
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
  nameAlternativeError: false,
  streetAltiernativeError: false,
  bankAccountNumberAlternativeError: false,
  bankKeyAlternativeError: false,
  emailAlternativeError: false,
  vendorNumber: '',
  department: '',
  reference: '',
  cashJournalCode: '',
  cashJournalName: '',
  pettyCashPeriod: [null, null],
  casNoCode: '',
  casNoName: '',
  casDateReceipt: '',
  dueDateCas: '',
  proposalAmountVal: '',
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

const canClickInformationTab = computed(() => {
  return hasCompletedDataTab.value
})

const canClickPreviewTab = computed(() => {
  return isCheckBudget.value
})

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

  const isAltValid =
    !form.isAlternativePayee ||
    (!!form.nameAlternative &&
      !!form.streetAltiernative &&
      !!form.bankAccountNumberAlternative &&
      !!form.bankKeyAlternative &&
      !!form.emailAlternative)

  if (form.vendorIdError || form.bankKeyIdError || form.invoiceTypeError || !isAltValid)
    return false
  else return true
}

const isAlternativePayeeFilled = () => {
  if (!form.isAlternativePayee) return true
  return (
    !!form.nameAlternative &&
    !!form.streetAltiernative &&
    !!form.bankAccountNumberAlternative &&
    !!form.bankKeyAlternative &&
    !!form.emailAlternative
  )
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
    if (!item.activity || !item.itemAmount || !item.debitCredit) status = true
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

  const isPettyCash = form.invoiceType === '5'

  const hasAtLeastOneDocument =
    form.invoiceDocument !== null ||
    form.tax !== null ||
    form.referenceDocument !== null ||
    form.otherDocument !== null

  const isReimbursement = form.invoiceType === '1'
  const isCreditCard = form.invoiceType === '2'
  const isCAS = form.invoiceType === '3'
  const isLBA = form.invoiceType === '4'

  if (!isPettyCash) {
    if (isCreditCard) {
      form.invoiceDocumentError = false
    } else {
      form.invoiceDocumentError = !hasAtLeastOneDocument
    }

    if (isReimbursement) {
      form.invoiceVendorNoError = useCheckEmpty(form.invoiceVendorNo).isError
      form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
      form.taxNoInvoiceError = useCheckEmpty(form.taxNoInvoice).isError
      form.proposalAmountError = false
      form.casNoCodeError = false
      form.dueDateCasError = false
    } else if (isCreditCard) {
      form.proposalAmountError = useCheckEmpty(form.proposalAmountVal).isError
      form.invoiceVendorNoError = false
      form.invoiceDateError = false
      form.taxNoInvoiceError = false
      form.casNoCodeError = false
      form.dueDateCasError = false
    } else if (isCAS) {
      form.taxNoInvoiceError = useCheckEmpty(form.taxNoInvoice).isError
      form.casNoCodeError = false
      form.invoiceVendorNoError = false
      form.invoiceDateError = false
      form.proposalAmountError = false
      form.dueDateCasError = false
    } else if (isLBA) {
      form.taxNoInvoiceError = useCheckEmpty(form.taxNoInvoice).isError
      form.casNoCodeError = useCheckEmpty(form.casNoCode).isError
      form.dueDateCasError = false
      form.invoiceVendorNoError = false
      form.invoiceDateError = false
      form.proposalAmountError = false
    } else {
      form.invoiceVendorNoError = false
      form.invoiceDateError = false
      form.taxNoInvoiceError = false
      form.proposalAmountError = false
      form.casNoCodeError = false
      form.dueDateCasError = false
    }
  } else {
    form.invoiceVendorNoError = false
    form.invoiceDateError = false
    form.taxNoInvoiceError = false
    form.proposalAmountError = false
    form.invoiceDocumentError = false
  }

  if (!checkIsNonPo()) {
    form.invoicePoGrError = form.invoicePoGr.length === 0 || checkActiveEditPoGr()
    form.additionalCostError = checkActiveEditAdditional() || checkFieldAdditional()
  } else {
    form.invoiceItemError = form.invoiceItem.length === 0 || checkActiveEditInvoiceItem()
    form.departmentError = useCheckEmpty(form.department).isError
  }

  if (form.isAlternativePayee) {
    form.nameAlternativeError = useCheckEmpty(form.nameAlternative).isError
    form.streetAltiernativeError = useCheckEmpty(form.streetAltiernative).isError
    form.bankAccountNumberAlternativeError = useCheckEmpty(
      form.bankAccountNumberAlternative,
    ).isError
    form.bankKeyAlternativeError = useCheckEmpty(form.bankKeyAlternative).isError
    form.emailAlternativeError = useCheckEmpty(form.emailAlternative).isError
  } else {
    form.nameAlternativeError = false
    form.streetAltiernativeError = false
    form.bankAccountNumberAlternativeError = false
    form.bankKeyAlternativeError = false
    form.emailAlternativeError = false
  }

  if (form.invoiceType !== '903') {
    form.descriptionError = useCheckEmpty(form.description).isError
  }

  if (Number(form.invoiceDp) === 9013) {
    form.dpAmountDeductionError =
      form.dpAmountDeduction > form.remainingDpAmount ||
      (form.remainingDpAmount !== 0 && form.dpAmountDeduction === 0)
  }

  if (
    form.companyCodeError ||
    form.invoiceVendorNoError ||
    form.invoiceDateError ||
    form.descriptionError ||
    form.invoiceDocumentError ||
    form.invoicePoGrError ||
    form.additionalCostError ||
    form.dpAmountDeductionError ||
    form.departmentError ||
    form.taxNoInvoiceError ||
    form.proposalAmountError ||
    form.dueDateCasError ||
    form.casNoCodeError ||
    form.invoiceItemError ||
    (form.isAlternativePayee &&
      (form.nameAlternativeError ||
        form.streetAltiernativeError ||
        form.bankAccountNumberAlternativeError ||
        form.bankKeyAlternativeError ||
        form.emailAlternativeError))
  )
    return false
  else return true
}

const setTab = (value: string) => {
  if (value === 'information' && !canClickInformationTab.value) return
  if (value === 'preview' && !canClickPreviewTab.value) return

  if (value === 'information' && tabNow.value === 'preview') {
    isCheckBudget.value = false
    tabNow.value = value
    try {
      ;(document.activeElement as HTMLElement)?.blur()
    } catch {}
    return
  }

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
    const newTab = list[checkIndex - 1]
    if (tabNow.value === 'preview' && newTab === 'information') {
      isCheckBudget.value = false
      tabNow.value = newTab
      try {
        ;(document.activeElement as HTMLElement)?.blur()
      } catch {}
      return
    }

    tabNow.value = newTab
    try {
      ;(document.activeElement as HTMLElement)?.blur()
    } catch {}
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
      poNo: item.poNo.toString(),
      poItem: Number(item.poItem),
      grDocumentNo: item.grDocumentNo,
      grDocumentItem: Number(item.grDocumentItem),
      grDocumentDate: item.grDocumentDate
        ? moment(item.grDocumentDate, 'YYYY').startOf('year').format('YYYY-MM-DD')
        : null,
      taxCode: item.taxCode,
      vatAmount: item.vatAmount || 0,
      itemAmount: form.currency === 'IDR' ? item.itemAmountLC : item.itemAmountTC,
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
  const cost: ParamsSubmissionCostExpense[] = []

  for (const item of form.invoiceItem) {
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === item.activity)
    const baseData: ParamsSubmissionCostExpense = {
      id: item.id || 0,
      activityId: item.activity,
      activityExpenses: listActivity.value[itemIndex].code,
      activityName: listActivity.value[itemIndex].name,
      itemAmount: Number(item.itemAmount),
      itemText: item.itemText,
      debitCredit: item.debitCredit || 'D',
      taxCode: form.invoiceType === '5' ? '' : item.taxCode,
      vatAmount: item.vatAmount,
      costCenter: item.costCenter,
      profitCenter: item.profitCenter,
      assignment: item.assignment,
      whtType: item.whtType || '',
      whtCode: item.whtCode || '',
      whtBaseAmount: Number(item.whtBaseAmount) || 0,
      whtAmount: Number(item.whtAmount) || 0,
    }

    cost.push(baseData)
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
      documentNo: form.invoiceVendorNo,
      invoiceDate: moment(form.invoiceDate).toISOString(),
      taxNo: form.taxNoInvoice,
      currCode: form.currency,
      notes: form.description,
      statusCode: isClickDraft.value ? 0 : 1,
      statusName: isClickDraft.value ? 'Drafted' : 'Waiting to Verify',
      creditCardBillingId: '',
      remainingDPAmount: Number(form.remainingDpAmount),
      dpAmountDeduction: Number(form.dpAmountDeduction),
    },
    vendor: {
      vendorId: form.vendorId ? Number(form.vendorId) : 0,
      vendorName: getVendorName() || '',
      vendorAddress: form.address,
      npwp: form.npwp,
    },
    payment: {
      paymentId: form.paymentId,
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
    additionalCosts: form.invoiceDp === '9012' ? [] : mapAdditionalCost(),
    workflow: [],
    alternativePayee: [],
    costExpense: [],
    isSaveAsDraft: false,
  } as ParamsSubmissionTypes

  return data
}

const mapDataPostNonPo = () => {
  const isReimbursement = form.invoiceType === '1'
  const isCreditCard = form.invoiceType === '2'
  const isCAS = form.invoiceType === '3'
  const isLBA = form.invoiceType === '4'
  const isPettyCash = form.invoiceType === '5'

  let invoiceTypeName = 'Reimbursement'
  if (isReimbursement) invoiceTypeName = 'Reimbursement'
  else if (isCreditCard) invoiceTypeName = 'Credit Card'
  else if (isCAS) invoiceTypeName = 'CAS'
  else if (isLBA) invoiceTypeName = 'LBA'
  else if (isPettyCash) invoiceTypeName = 'Petty Cash'

  let invoiceDateToUse: string | null = null
  let pettyCashStartDate: string | null = null
  let pettyCashEndDate: string | null = null

  if (isPettyCash && Array.isArray(form.pettyCashPeriod) && form.pettyCashPeriod[0]) {
    pettyCashStartDate = moment(form.pettyCashPeriod[0]).toISOString()
    pettyCashEndDate = form.pettyCashPeriod[1]
      ? moment(form.pettyCashPeriod[1]).toISOString()
      : null
  } else if ((isReimbursement || isCAS) && form.invoiceDate) {
    invoiceDateToUse = moment(form.invoiceDate).toISOString()
  } else if (!isReimbursement && !isCreditCard && !isCAS && !isLBA && form.invoiceDate) {
    invoiceDateToUse = moment(form.invoiceDate).toISOString()
  }

  const postingDateToUse: string | null = invoiceDateToUse

  const data = {
    header: {
      invoiceUId:
        form.status === 0 || form.status === 5
          ? form.invoiceUId
          : '00000000-0000-0000-0000-000000000000',
      invoiceTypeCode: Number(form.invoiceType),
      invoiceTypeName: invoiceTypeName,
      invoiceVendorNo: isCAS ? form.taxNoInvoice || '' : form.invoiceVendorNo || '',
      companyCode: form.companyCode,
      companyName: form.companyName,
      invoiceNo: form.invoiceNo,
      documentNo: isPettyCash
        ? ''
        : isReimbursement
          ? form.invoiceVendorNo || ''
          : isCreditCard
            ? form.invoiceVendorNo || ''
            : isCAS
              ? ''
              : isLBA
                ? form.casNoCode || ''
                : '',
      invoicingParty: '',
      assigment: '',
      transferNews: '',
      npwpReporting: '',
      invoiceDate: invoiceDateToUse || null,
      postingDate: postingDateToUse || null,
      estimatedPaymentDate: postingDateToUse || null,
      paymentMethodCode: '',
      paymentMethodName: '',
      taxNo: form.taxNoInvoice || '',
      currCode: form.currency,
      creditCardBillingID: '',
      notes: form.description,
      statusCode: isClickDraft.value ? 0 : 1,
      statusName: isClickDraft.value ? 'Drafted' : 'Waiting to Verify',
      department: checkIsNonPo() ? form.department : userData.value.profile.costCenter || '',
      profileId: userData.value.profile.profileId.toString(),
      casDateReceipt:
        isCAS && form.casDateReceipt ? moment(form.casDateReceipt).toISOString() : null,
      dueDateCas: isLBA && form.dueDateCas ? moment(form.dueDateCas).toISOString() : null,
      proposalAmount: isCreditCard ? Number(form.proposalAmountVal) || 0 : 0,
      picFinance: '',
      cashJournalCode: isPettyCash ? form.cashJournalCode || '' : '',
      cashJournalName: isPettyCash
        ? typeof form.cashJournalName === 'string'
          ? form.cashJournalName
              .replace(new RegExp('^' + (form.cashJournalCode || '') + '\\s*-\\s*'), '')
              .trim()
          : form.cashJournalName || ''
        : '',
      pettyCashStartDate: pettyCashStartDate || null,
      pettyCashEndDate: pettyCashEndDate || null,
      npwpReportingName: '',
    },
    vendor: {
      vendorId: form.vendorId ? Number(form.vendorId) : 0,
      vendorName: getVendorName() || '',
      vendorAddress: form.address,
      npwp: form.npwp,
    },
    payment: {
      paymentId: form.paymentId,
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
      isAlternativePayee: form.isAlternativePayee || null,
      isOneTimeVendor: form.isOneTimeVendor || null,
    },
    costExpenses: mapInvoiceItem() as ParamsSubmissionCostExpense[],
    isSaveAsDraft: false,
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
        hasCompletedDataTab.value = true
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
      const submissionData = mapDataPostNonPo()

      invoiceApi
        .postSubmissionNonPo(submissionData)
        .then((response) => {
          setAfterResponsePost(response)
        })
        .catch((error) => {
          invoiceApi.errorMessageSubmission =
            error.response?.data?.result?.message || error.message || 'An unexpected error occurred'
          const idModal = document.querySelector('#error_submission_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
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
          invoiceApi.errorMessageSubmission =
            error.response?.data?.result?.message || error.message || 'An unexpected error occurred'
          const idModal = document.querySelector('#error_submission_modal')
          const modal = KTModal.getInstance(idModal as HTMLElement)
          modal.show()
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
    data.isSaveAsDraft = true

    invoiceApi
      .postSubmissionNonPo(data)
      .then((response) => {
        setAfterResponsePost(response)
      })
      .catch((error) => {
        invoiceApi.errorMessageSubmission =
          error.response?.data?.result?.message || error.message || 'Failed to save draft'
        const idModal = document.querySelector('#error_submission_modal')
        const modal = KTModal.getInstance(idModal as HTMLElement)
        modal.show()
      })
      .finally(() => {
        isSubmit.value = false
      })
  } else {
    const data = mapDataPost()
    data.header.statusCode = 0
    data.header.statusName = 'Draft'
    data.isSaveAsDraft = true
    invoiceApi
      .postSubmission(data)
      .then((response) => {
        setAfterResponsePost(response)
      })
      .catch((error) => {
        invoiceApi.errorMessageSubmission =
          error.response?.data?.result?.message || error.message || 'Failed to save draft'
        const idModal = document.querySelector('#error_submission_modal')
        const modal = KTModal.getInstance(idModal as HTMLElement)
        modal.show()
      })
      .finally(() => {
        isSubmit.value = false
      })
  }
}

const setAfterResponsePost = (response: { statusCode: number; result: { message: string } }) => {
  if (response.statusCode === 200) {
    const idModal = document.querySelector('#success_invoice_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
    if (form.invoiceUId) {
      if (route.query.type === 'nonpo') {
        for (const item of costExpensesTempDelete.value) {
          verificationApi.deleteCostExpense(form.invoiceUId, item)
        }
      } else {
        for (const item of additionalCostTempDelete.value) {
          verificationApi.deleteAdditionalCost(form.invoiceUId, item)
        }
      }
    }
  } else {
    invoiceApi.errorMessageSubmission = response.result.message
    const idModal = document.querySelector('#error_submission_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
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
    form.paymentId = detail.payment.paymentId
    form.bankKeyId = detail.payment.bankKey
    form.bankNameId = detail.payment.bankName
    form.beneficiaryName = detail.payment.beneficiaryName
    form.bankAccountNumber = detail.payment.bankAccountNo
    form.bankCountryCode = detail.payment.bankCountryCode
    form.invoiceDp = detail.header.invoiceDPCode ? detail.header.invoiceDPCode.toString() : ''
    form.companyCode = detail.header.companyCode
    form.invoiceVendorNo = detail.header.documentNo ? detail.header.documentNo.toString() : ''
    form.invoiceNo = detail.header.invoiceNo ? detail.header.invoiceNo.toString() : ''
    form.invoiceDate = detail.header.invoiceDate
    form.taxNoInvoice = detail.header.taxNo
    form.currency = detail.header.currCode
    form.dpAmountDeduction = detail.header.dpAmountDeduction
    form.remainingDpAmount = detail.header.remainingDPAmount
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
    form.paymentId = detail.payment.paymentId
    form.bankKeyId = detail.payment.bankKey
    form.bankNameId = detail.payment.bankName
    form.beneficiaryName = detail.payment.beneficiaryName
    form.bankAccountNumber = detail.payment.bankAccountNo
    form.bankCountryCode = detail.payment.bankCountryCode
    form.invoiceDp = detail.header.invoiceDPCode ? detail.header.invoiceDPCode.toString() : ''
    form.companyCode = detail.header.companyCode
    if (detail.header.invoiceTypeCode === 3) {
      form.invoiceVendorNo = ''
    } else {
      form.invoiceVendorNo = detail.header.documentNo ? detail.header.documentNo.toString() : ''
    }
    form.invoiceNo = detail.header.invoiceNo ? detail.header.invoiceNo.toString() : ''
    form.invoiceDate = detail.header.invoiceDate
    form.taxNoInvoice = detail.header.taxNo
    form.casNoCode = detail.header.casNoCode || ''
    form.casNoName = detail.header.casNoName || ''
    form.casDateReceipt = detail.header.casDateReceipt || ''
    form.dueDateCas = detail.header.dueDateCas || ''
    form.cashJournalCode = detail.header.cashJournalCode || ''
    form.cashJournalName = detail.header.cashJournalName || ''
    form.proposalAmountVal = detail.header.proposalAmount || ''

    if (detail.header.pettyCashStartDate && detail.header.pettyCashEndDate) {
      form.pettyCashPeriod = [
        new Date(detail.header.pettyCashStartDate),
        new Date(detail.header.pettyCashEndDate),
      ]
    }

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
      TAX_CODE: form.invoiceType === '5' ? ' ' : item.taxCode || ' ',
      COSTCENTER: item.costCenter || '',
      PROFIT_CTR: item.profitCenter || '',
    }
    glAccount.push(glData)
  }

  itemNoAcc.value += 1

  if (form.invoiceType === '5') {
    const accData = {
      ITEMNO_ACC: itemNoAcc.value,
      VENDOR_NO: form.vendorId || '',
      REF_KEY_1: '',
      REF_KEY_2: '',
      REF_KEY_3: '',
      BLINE_DATE: '',
      PMNTTRMS: '',
      PYMT_METH: '',
      ALLOC_NMBR: '',
      ITEM_TEXT: form.cashJournalCode || '',
      TAX_CODE: '',
      PAYMT_REF: '',
    }
    accountPayable.push(accData)
  } else {
    let itemText = ''
    if (form.invoiceType === '1') {
      itemText = form.invoiceVendorNo || ''
    } else if (form.invoiceType === '2') {
      itemText = form.proposalAmountVal || form.description || ''
    } else if (form.invoiceType === '3') {
      itemText = form.taxNoInvoice || ''
    } else if (form.invoiceType === '4') {
      itemText = form.casNoCode || form.taxNoInvoice || ''
    }

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
      ITEM_TEXT: itemText,
      TAX_CODE: form.invoiceItem.length > 0 ? form.invoiceItem[0].taxCode || ' ' : ' ',
      PAYMT_REF: '',
    }
    accountPayable.push(accData)
  }

  if (form.invoiceType !== '5') {
    for (const item of form.invoiceItem) {
      if (!item.taxCode) continue
      if (item.taxCode === 'V0') continue
      const checkAccountTax = accountTax.findIndex((sub) => sub.TAX_CODE === item.taxCode)
      if (checkAccountTax === -1) {
        const index = listTaxCalculation.value.findIndex((sub) => sub.code === item.taxCode)
        if (index !== -1) {
          itemNoAcc.value += 1
          const taxData = {
            ITEMNO_ACC: itemNoAcc.value,
            TAX_CODE: item.taxCode,
            TAX_RATE: listTaxCalculation.value[index].value,
          }
          accountTax.push(taxData)
        }
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

  let docDate = moment().format('YYYYMMDD')

  if (form.invoiceType === '5') {
    if (Array.isArray(form.pettyCashPeriod) && form.pettyCashPeriod[0]) {
      docDate = moment(form.pettyCashPeriod[0]).format('YYYYMMDD')
    }
  } else if (form.invoiceType === '1') {
    if (form.invoiceDate) {
      docDate = moment(form.invoiceDate).format('YYYYMMDD')
    }
  } else if (form.invoiceType === '4') {
    if (form.dueDateCas) {
      docDate = moment(form.dueDateCas).format('YYYYMMDD')
    }
  }

  let refDocNo = ''
  if (form.invoiceType === '5') {
    refDocNo = form.cashJournalCode || form.invoiceNo || form.description || 'PETTY_CASH'
  } else if (form.invoiceType === '1') {
    refDocNo = form.invoiceVendorNo || form.taxNoInvoice || form.invoiceNo || 'REIMBURSEMENT'
  } else if (form.invoiceType === '2') {
    refDocNo = form.proposalAmountVal || form.invoiceNo || form.description || 'CREDIT_CARD'
  } else if (form.invoiceType === '3' || form.invoiceType === '4') {
    refDocNo =
      form.casNoCode ||
      form.taxNoInvoice ||
      form.invoiceNo ||
      (form.invoiceType === '3' ? 'CAS' : 'LBA')
  }

  if (!refDocNo || refDocNo.trim() === '') {
    refDocNo = form.invoiceNo || form.description || 'REF_DOC'
  }

  const fiscalYear = parseInt(docDate.substring(0, 4))
  const fiscalPeriod = parseInt(docDate.substring(4, 6))

  let docType = 'KR'
  if (form.invoiceType === '5') {
    docType = 'SA'
  } else if (form.invoiceType === '1') {
    docType = 'KR'
  } else if (form.invoiceType === '2') {
    docType = 'KR'
  } else if (form.invoiceType === '3') {
    docType = 'KR'
  } else if (form.invoiceType === '4') {
    docType = 'KR'
  }

  const data = {
    REQUEST: {
      HEADER_TXT: form.taxNoInvoice || '',
      COMP_CODE: form.companyCode,
      DOC_DATE: docDate,
      PSTNG_DATE: docDate,
      FISC_YEAR: fiscalYear,
      FIS_PERIOD: fiscalPeriod,
      DOC_TYPE: docType,
      REF_DOC_NO: refDocNo,
      CUSTOMERCPD: {
        NAME: form.nameAlternative || '',
        NAME_2: form.nameOtherAlternative || '',
        POSTL_CODE: '',
        CITY: form.cityAlternative || '',
        COUNTRY: form.countryAlternative || '',
        STREET: form.streetAltiernative || '',
        BANK_ACCT: form.bankAccountNumberAlternative || '',
        BANK_NO: form.bankKeyAlternative || '',
        BANK_CTRY: form.bankCountryAlternative || '',
        TAX_NO_1: form.npwpNumberAlternative || '',
        TAX_NO_3: form.ktpNumberAlternative || '',
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
    .then((response) => {
      if (response) {
        const respTop = response as unknown as Record<string, unknown>
        const topRESPONSE = respTop['RESPONSE']
        if (Array.isArray(topRESPONSE)) {
          invoiceApi.responseCheckBudget =
            respTop as unknown as typeof invoiceApi.responseCheckBudget
        }
      }

      const respObj = (() => {
        if (invoiceApi.responseCheckBudget) return invoiceApi.responseCheckBudget
        if (response && typeof response === 'object') {
          const r = response as unknown as Record<string, unknown>
          const result = r['result']
          if (result && typeof result === 'object') {
            const resObj = result as Record<string, unknown>
            if (resObj['content']) return resObj['content']
          }
          return response
        }
        return undefined
      })()

      const RESPONSE =
        respObj && typeof respObj === 'object'
          ? (respObj as Record<string, unknown>)['RESPONSE']
          : undefined
      const hasSuccess =
        Array.isArray(RESPONSE) &&
        (RESPONSE as Array<Record<string, unknown>>).some((r) => (r['TYPE'] as string) === 'S')

      if (hasSuccess) {
        isCheckBudget.value = true
        const idModal = document.querySelector('#success_budget_check_modal')
        const modal = KTModal.getInstance(idModal as HTMLElement)
        if (modal) modal.show()
      } else {
        isCheckBudget.value = false

        const extractResponseMessages = (resp: unknown): string => {
          if (!resp || typeof resp !== 'object' || resp === null) return ''
          const rObj = resp as Record<string, unknown>
          const RESPONSE = rObj['RESPONSE']
          if (Array.isArray(RESPONSE) && RESPONSE.length > 0 && typeof RESPONSE[0] === 'object') {
            const first = RESPONSE[0] as Record<string, unknown>
            const MESSAGE = first['MESSAGE']
            if (Array.isArray(MESSAGE))
              return MESSAGE.filter((m) => typeof m === 'string').join('\n')
            if (typeof MESSAGE === 'string') return MESSAGE
          }
          const result = rObj['result']
          if (result && typeof result === 'object') {
            const resObj = result as Record<string, unknown>
            const m = resObj['message']
            if (typeof m === 'string') return m
          }
          const m2 = rObj['message']
          if (typeof m2 === 'string') return m2
          return ''
        }

        invoiceApi.errorMessageSubmission = extractResponseMessages(respObj || response)
        const idModal = document.querySelector('#failed_budget_check_modal')
        const modal = KTModal.getInstance(idModal as HTMLElement)
        if (modal) modal.show()
      }
    })
    .catch((error) => {
      isCheckBudget.value = false

      const extractResponseMessages = (resp: unknown): string => {
        if (!resp || typeof resp !== 'object' || resp === null) return ''
        const rObj = resp as Record<string, unknown>
        const RESPONSE = rObj['RESPONSE']
        if (Array.isArray(RESPONSE) && RESPONSE.length > 0 && typeof RESPONSE[0] === 'object') {
          const first = RESPONSE[0] as Record<string, unknown>
          const MESSAGE = first['MESSAGE']
          if (Array.isArray(MESSAGE)) return MESSAGE.filter((m) => typeof m === 'string').join('\n')
          if (typeof MESSAGE === 'string') return MESSAGE
        }
        const result = rObj['result']
        if (result && typeof result === 'object') {
          const resObj = result as Record<string, unknown>
          const m = resObj['message']
          if (typeof m === 'string') return m
        }
        const m2 = rObj['message']
        if (typeof m2 === 'string') return m2
        return ''
      }

      const errData = error?.response?.data
      if (errData) {
        const errTop = errData as unknown as Record<string, unknown>
        if (Array.isArray(errTop['RESPONSE'])) {
          invoiceApi.responseCheckBudget =
            errTop as unknown as typeof invoiceApi.responseCheckBudget
        }
      }

      invoiceApi.errorMessageSubmission = extractResponseMessages(errData || error)
      const idModal = document.querySelector('#failed_budget_check_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      if (modal) modal.show()
    })
}

const checkFormBudget = () => {
  let status = false

  const isPettyCash = form.invoiceType === '5'

  const hasAtLeastOneDocument =
    form.invoiceDocument !== null ||
    form.tax !== null ||
    form.referenceDocument !== null ||
    form.otherDocument !== null

  if (isPettyCash) {
    if (
      !form.companyCode ||
      !form.cashJournalCode ||
      !form.pettyCashPeriod ||
      (Array.isArray(form.pettyCashPeriod) &&
        (!form.pettyCashPeriod[0] || !form.pettyCashPeriod[1])) ||
      !form.description ||
      !form.department ||
      form.invoiceItem.length === 0
    ) {
      status = true
    }
  } else {
    const isReimbursement = form.invoiceType === '1'
    const isCreditCard = form.invoiceType === '2'
    const isCAS = form.invoiceType === '3'
    const isLBA = form.invoiceType === '4'

    if (
      !form.companyCode ||
      !form.description ||
      !form.department ||
      form.invoiceItem.length === 0 ||
      (!isCreditCard && !hasAtLeastOneDocument)
    ) {
      status = true
    }

    if (isReimbursement) {
      if (!form.invoiceVendorNo || !form.invoiceDate || !form.taxNoInvoice) {
        status = true
      }
    }

    if (isCreditCard) {
      if (!form.proposalAmountVal) {
        status = true
      }
    }

    if (isCAS) {
      if (!form.taxNoInvoice) {
        status = true
      }
    }

    if (isLBA) {
      if (!form.taxNoInvoice || !form.casNoCode || !form.department) {
        status = true
      }
    }
  }

  for (const item of form.invoiceItem) {
    if (item.isEdit || !item.itemAmount) status = true
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
    hasCompletedDataTab.value = true
  }

  if (
    route.query.type === 'non-po-view' ||
    (route.query.invoice &&
      route.query.type !== 'non-po-view' &&
      route.query.type !== 'po-view' &&
      route.query.type === 'nonpo')
  ) {
    hasCompletedDataTab.value = true

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
    hasCompletedDataTab.value = true

    invoiceApi.getPoDetail(route.query.invoice?.toString() || '').then(() => {
      setData()
    })
  }
})

watch(
  () => form.invoiceItem,
  () => {
    if (isCheckBudget.value) isCheckBudget.value = false
  },
  { deep: true },
)

watch(
  () => form.additionalCost,
  () => {
    if (isCheckBudget.value) isCheckBudget.value = false
  },
  { deep: true },
)

watch(
  () => form.invoicePoGr,
  () => {
    if (isCheckBudget.value) isCheckBudget.value = false
  },
  { deep: true },
)

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-submission.scss';
</style>
