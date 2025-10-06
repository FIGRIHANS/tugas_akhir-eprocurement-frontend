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
    <div v-if="!checkIsNonPo()">
      <InvoicePoGr v-if="checkPo() && !isNonPo" class="mt-[24px]" />
      <InvoiceItem v-if="isNonPo" class="mt-[24px]" />
      <AdditionalCost
        v-if="!isNonPo && (checkIsWithoutDp() || checkIsPoPib())"
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
          v-if="checkEditButton()"
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
      :statusCode="detailInvoice?.header.statusCode || detailInvoiceNonPo?.header.statusCode || -1"
      @afterClose="goToList"
    />
    <SuccessRejectModal @afterClose="goToList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, provide, defineAsyncComponent, onMounted } from 'vue'
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
  itemsAlternativePayee,
} from '@/stores/views/invoice/types/verification'
import { isEmpty } from 'lodash'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

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
  return userData.value.profile.profileId === 3190
}

const checkIsWithoutDp = () => {
  return form.value.invoiceDPCode === 9011
}

const checkIsPoPib = () => {
  return form.value.invoiceTypeCode === 902
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
  const invoiceDateError = useCheckEmpty(form.value.invoiceDate).isError
  const documentNoError = useCheckEmpty(form.value.documentNo).isError
  const creditCardBillingError = checkVerifikator1() ? useCheckEmpty(form.value.creditCardBillingId).isError : false
  
  const postingDateError = !checkVerifikator1() ? useCheckEmpty(form.value.postingDate).isError : false
  const estimatedPaymentDateError = !checkVerifikator1() ? useCheckEmpty(form.value.estimatedPaymentDate).isError : false
  const paymentMethodError = !checkVerifikator1() ? useCheckEmpty(form.value.paymentMethodCode).isError : false
  const transferNewsError = !checkVerifikator1() ? useCheckEmpty(form.value.transferNews).isError : false
  const notesError = !checkVerifikator1() ? useCheckEmpty(form.value.notes).isError : false

  if (
    invoiceDateError ||
    postingDateError ||
    estimatedPaymentDateError ||
    documentNoError ||
    paymentMethodError ||
    transferNewsError ||
    creditCardBillingError ||
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
    cost.push({
      id: item.id,
      activityId: item.activityId,
      activityExpense: item.activityExpenses,
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
      invoiceDate: form.value.invoiceDate,
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

  const data = {
    statusCode: route.query.type === '1' ? 3 : 4,
    statusName: route.query.type === '1' ? 'Verified' : 'Approved',
    statusNotes: '',
    header: {
      invoiceUId: form.value.invoiceUId,
      invoiceDate: form.value.invoiceDate,
      postingDate: form.value.invoiceDate || null,
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
      npwpReporting: form.value.npwpReporting,
      department: form.value.department,
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
    alternativePay: {
      id: form.value.alternativePayee[0].id,
      invoiceUId: form.value.invoiceUId,
      name: form.value.alternativePayee[0].name,
      name2: form.value.alternativePayee[0].name2,
      street: form.value.alternativePayee[0].street,
      city: form.value.alternativePayee[0].city,
      country: form.value.alternativePayee[0].country,
      bankAccountNumber: form.value.alternativePayee[0].bankAccountNumber,
      bankKey: form.value.alternativePayee[0].bankKey,
      bankCountry: form.value.alternativePayee[0].bankCountry,
      npwp: form.value.alternativePayee[0].npwp,
      ktp: form.value.alternativePayee[0].ktp,
      email: form.value.alternativePayee[0].email,
      isAlternativePayee: form.value.alternativePayee[0].isAlternativePayee,
      isOneTimeVendor: form.value.alternativePayee[0].isOneTimeVendor,
      // isActive: form.value.alternativePayee[0].isActive,
      // isDeleted: form.value.alternativePayee[0].isDeleted,
      // createdBy: form.value.alternativePayee[0].createdBy,
      // createdUtcDate: form.value.alternativePayee[0].createdUtcDate,
      // modifiedBy: form.value.alternativePayee[0].modifiedBy,
      // modifiedUtcDate: form.value.alternativePayee[0].modifiedUtcDate,
    },
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
      .postSubmissionNonPo(mapDataVerifNonPo())
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
    remainingDpAmount: data?.header.remainingDpAmount,
    dpAmountDeduction: data?.header.dpAmountDeduction,
    paymentId: data?.payment.paymentId || 0,
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    creditCardBillingId: data?.header.creditCardBillingID || '',
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
  let alternativePaeeValue: itemsAlternativePayee | null = null

  if (data?.alternativePayee.length > 0) {
    alternativePaeeValue = {
      id: data?.alternativePayee[0]?.id,
      name: data?.alternativePayee[0]?.name,
      name2: data?.alternativePayee[0]?.name2,
      street: data?.alternativePayee[0]?.street,
      city: data?.alternativePayee[0]?.city,
      country: data?.alternativePayee[0]?.country,
      bankAccountNumber: data?.alternativePayee[0].bankAccountNumber,
      bankKey: data?.alternativePayee[0]?.bankKey,
      bankCountry: data?.alternativePayee[0]?.bankCountry,
      npwp: data?.alternativePayee[0]?.npwp,
      ktp: data?.alternativePayee[0]?.ktp,
      email: data?.alternativePayee[0]?.email,
      isAlternativePayee: data?.alternativePayee[0]?.isAlternativePayee,
      isOneTimeVendor: data?.alternativePayee[0]?.isOneTimeVendor,
    }
  }

  let invoice = {} as documentDetailTypes
  let tax = {} as documentDetailTypes
  let reference = {} as documentDetailTypes
  let other = {} as documentDetailTypes

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
      isEdit: false
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
    invoiceDate: data?.header.invoiceDate || null,
    taxNo: data?.header.taxNo || '',
    currCode: data?.header.currCode || '',
    notes: data?.header.notes || '',
    statusCode: data?.header.statusCode || 0,
    statusName: data?.header.statusName || '',
    postingDate: data?.header.postingDate || null,
    invoicingParty: data?.header.invoicingParty || '',
    estimatedPaymentDate: data?.header.estimatedPaymentDate || null,
    paymentMethodCode: data?.header.paymentMethodCode || '',
    paymentMethodName: data?.header.paymentMethodName || '',
    assigment: data?.header.assigment || '',
    transferNews: data?.header.transferNews || '',
    npwpReporting: data?.header.npwpReporting || '',
    department: data?.header.department,
    remainingDpAmount: data?.header.remainingDpAmount,
    dpAmountDeduction: data?.header.dpAmountDeduction,
    paymentId: data?.payment.paymentId || 0,
    bankKey: data?.payment.bankKey || '',
    bankName: data?.payment.bankName || '',
    creditCardBillingId: data?.header.creditCardBillingID || '',
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
  form.value = {
    invoiceUId: data?.invoiceUId || '',
    invoiceTypeCode: data?.invoiceTypeCode || 0,
    invoiceTypeName: data?.invoiceTypeName || '',
    invoiceDPCode: data?.invoiceDPCode || 0,
    invoiceDPName: data?.invoiceDPName || '',
    invoiceVendorNo: data?.vendorId,
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
    remainingDpAmount: data?.remainingDpAmount,
    dpAmountDeduction: data?.dpAmountDeduction,
    department: data?.department,
    paymentId: data?.paymentId,
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
    costExpense: data?.costExpenses,
    alternativePayee: [
      {
        id: data?.idAlternative,
        name: data?.name,
        name2: data?.name2,
        street: data?.street,
        city: data?.city,
        country: data?.country,
        bankAccountNumber: data?.bankAccountNumber,
        bankKey: data?.bankKeyAlternative,
        bankCountry: data?.bankCountry,
        npwp: data?.npwpAlternative,
        ktp: data?.ktp,
        email: data?.email,
        isAlternativePayee: data?.isAlternativePayee,
        isOneTimeVendor: data?.isOneTimeVendor
      }
    ],
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
}

const afterGetDetailNonPo = () => {
  if (verificationApi.isFromEdit) {
    setDataEdit()
  } else {
    setDataDefaultNonPo()
  }
  switch (detailInvoiceNonPo.value?.header.statusCode) {
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
}

watch(
  () => [detailInvoice.value, detailInvoiceNonPo.value],
  () => {
    if (!checkIsNonPo()) afterGetDetail()
    else afterGetDetailNonPo()
    if (form.value.companyCode) {
      invoiceMasterApi.getActivity(form.value.companyCode || '')
      invoiceMasterApi.getCostCenter(form.value.companyCode || '')
    }
  },
  {
    deep: true,
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
    await verificationApi.getInvoiceDetail(route.query.id?.toString() || '').then(() => {
      afterGetDetail()
    })
  } else {
    await verificationApi.getInvoiceNonPoDetail(route.query.id?.toString() || '').then(() => {
      afterGetDetailNonPo()
    })
  }
})

provide('form', form)
</script>
