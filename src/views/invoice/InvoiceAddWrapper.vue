<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus active-name="Submission" />
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
      <div v-if="(form.status === 0 || form.status === -1 || form.status === 5) && !checkInvoiceView()" class="flex justify-between items-center gap-[8px] mt-[24px]">
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
            {{ tabNow !== 'preview' ? 'Lanjut' : 'Submit' }}
            <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
            <i v-else class="ki-duotone ki-paper-plane"></i>
          </button>
        </div>
      </div>
      <div v-else class="flex justify-end items-center mt-[24px]">
        <button v-if="tabNow !== 'preview' || checkInvoiceView()" class="btn btn-outline btn-primary" :disabled="isSubmit" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button v-if="tabNow !== 'preview' && !checkInvoiceView()" class="btn btn-primary" :disabled="isSubmit" @click="goNext">
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button v-if="tabNow === 'preview' && !checkInvoiceView()" class="btn btn-primary" :disabled="isSubmit">
          Save as PDF
          <iconPDF />
        </button>
      </div>
    </div>
    <ModalSuccess />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, provide, type Component, defineAsyncComponent } from 'vue'
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
import type { ParamsSubmissionTypes } from '@/stores/views/invoice/types/submission'
import { useLoginStore } from '@/stores/views/login'
import moment from 'moment'
import type { itemsPoGrType } from './types/invoicePoGr'
import type { itemsCostType } from './types/additionalCost'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoiceInformation.vue'))
const InvoicePreview = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoicePreview.vue'))
const ModalSuccess = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoicePreview/ModalSuccess.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const loginApi = useLoginStore()
const router = useRouter()
const route = useRoute()
const tabNow = ref<string>('data')
const isSubmit = ref<boolean>(false)

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

const form = reactive<formTypes>({
  invoiceUId: '',
  invoiceType: '901',
  invoiceTypeName: 'Invoice PO',
  vendorId: '',
  npwp: '',
  address: '',
  bankKeyId: '',
  bankNameId: '',
  beneficiaryName: '',
  bankAccountNumber: '',
  swiftCode: '',
  bankAddress: '',
  invoiceNo: '',
  companyCode: '',
  companyName: '',
  invoiceNoVendor: '',
  invoiceDate: '',
  taxNumber: '',
  invoiceDp: '9011',
  amountInvoice: '',
  taxNoInvoice: '',
  remainingDpAmount: '1.000.000.000',
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
  status: -1
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation,
    preview: InvoicePreview
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const listDocumentType = computed(() => invoiceMasterApi.documentType)
const vendorList = computed(() => invoiceMasterApi.vendorList)
const invoiceDpList = computed(() => invoiceMasterApi.dpType)
const detailPo = computed(() => invoiceApi.detailPo)

const checkInvoiceView = () => {
  return route.query.type === 'po-view'
}

const checkInvoiceData = () => {
  form.vendorIdError = useCheckEmpty(form.vendorId).isError
  form.bankKeyIdError = useCheckEmpty(form.bankKeyId).isError
  if (route.query.path === 'po') form.invoiceTypeError = useCheckEmpty(form.invoiceType).isError

  if (
    form.vendorIdError ||
    form.bankKeyIdError ||
    form.invoiceTypeError
  ) return false
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
    if (
      !item.activity ||
      !item.itemAmount ||
      !item.debitCredit ||
      !item.taxCode
    ) status = true
  }
  return status
}

const checkInvoiceInformation = () => {
  form.companyCodeError = useCheckEmpty(form.companyCode).isError
  form.invoiceNoVendorError = useCheckEmpty(form.invoiceNoVendor).isError
  form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
  form.descriptionError = useCheckEmpty(form.description).isError
  form.invoiceDocumentError = form.invoiceDocument === null
  form.invoicePoGrError = form.invoicePoGr.length === 0 || checkActiveEditPoGr()
  form.additionalCostError = checkActiveEditAdditional() || checkFieldAdditional()

  if (
    form.companyCodeError ||
    form.invoiceNoVendorError ||
    form.invoiceDateError ||
    form.descriptionError ||
    form.invoiceDocumentError ||
    form.invoicePoGrError ||
    form.additionalCostError
  ) return false
  else return true
}

const setTab = (value: string) => {
  tabNow.value = value
}
const goBack = () => {
  const list = ['data', 'information', 'preview']
  const checkIndex = list.findIndex((item) => item === tabNow.value)
  if (checkIndex === 0 || checkInvoiceView()) {
    router.push({
      name: 'invoice'
    })
  }
  if (checkIndex !== -1 && checkIndex !== 0) {
    tabNow.value = list[checkIndex - 1]
  }
}

const mapDocument = () => {
  const document = []
  const libDocument = [
    'invoiceDocument',
    'tax',
    'referenceDocument',
    'otherDocument'
  ]
  for (const [index, item] of libDocument.entries()) {
    if (form[item as keyof typeof form]) {
      document.push({
        documentType: Number(listDocumentType.value[index].code),
        documentName: form.invoiceDocument?.name,
        documentUrl: form.invoiceDocument?.path,
        documentSize: Number(form.invoiceDocument?.fileSize)
      })
    }
  }
  return document
}

const mapPoGr = () => {
  const poGr = []
  for (const item of form.invoicePoGr) {
    poGr.push({
      poNo: item.poNo,
      poItem: Number(item.poItem),
      grDocumentNo: item.grDocumentNo,
      grDocumentItem: Number(item.grDocumentItem),
      grDocumentDate: moment(item.grDocumentDate, 'YYYY').startOf('year').format('YYYY-MM-DD'),
      taxCode: item.taxCode,
      itemAmount: Number(item.currency === item.currencyLC ? item.itemAmountLC : item.itemAmountTC),
      quantity: Number(item.quantity),
      uom: item.uom,
      itemText: item.itemText,
      conditionType: item.conditionType,
      conditionTypeDesc: item.conditionTypeDesc,
      qcStatus: item.qcStatus,
      whtType: '-',
      whtCode: '-',
      whtBaseAmount: 0,
      whtAmount: 0,
      department: item.department
    })
  }
  return poGr
}

const mapAdditionalCost = () => {
  const cost = []
  for (const item of form.additionalCost) {
    cost.push({
      activityExpense: item.activity,
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

const getVendorName = () => {
  const getIndex = vendorList.value.findIndex((item) => item.vendorCode === form?.vendorId)
  if (getIndex !== -1) return vendorList.value[getIndex].vendorName
}

const getDpName = () => {
  const getIndex = invoiceDpList.value.findIndex((item) => item.code === form?.invoiceDp)
  if (getIndex !== -1) return invoiceDpList.value[getIndex].name
}

const mapDataPost = () => {
  const data = {
    header: {
      invoiceUId: form.status === 0 ? form.invoiceUId :'00000000-0000-0000-0000-000000000000',
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
      statusCode: 1,
      statusName: 'Waiting to Verify'
    },
    vendor: {
      vendorId: Number(form.vendorId),
      vendorName: getVendorName(),
      npwp: form.npwp,
      vendorAddress: form.address
    },
    payment: {
      bankKey: form.bankKeyId,
      bankName: form.bankNameId,
      beneficiaryName: form.beneficiaryName,
      bankAccountNo: form.bankAccountNumber
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
    additionalCosts: form.invoiceDp === '9012' || form.invoiceDp === '9013' ? [] : mapAdditionalCost()
  } as ParamsSubmissionTypes

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
    invoiceApi.postSubmission(mapDataPost()).then(() => {
      const idModal = document.querySelector('#success_invoice_modal')
      const modal = KTModal.getInstance(idModal as HTMLElement)
      modal.show()

      setTimeout(() => {
        modal.hide()
        router.push({
          name: 'invoice-list'
        })
      }, 1000)
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isSubmit.value = false
    })
  }
}

const goSaveDraft = () => {
  const data = mapDataPost()
  data.header.statusCode = 0
  data.header.statusName = 'Draft'
  isSubmit.value = true
  invoiceApi.postSubmission(data).then(() => {
    const idModal = document.querySelector('#success_invoice_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()

    setTimeout(() => {
      modal.hide()
      router.push({
        name: 'invoice-list'
      })
    }, 1000)
  })
  .catch((error) => {
    console.error(error)
  })
  .finally(() => {
    isSubmit.value = false
  })
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
    form.invoicePoGr = []
    for (const item of detail.pogr) {
      const data = {
        poNo: item.poNo,
        poItem: item.poItem,
        grDocumentNo: item.grDocumentNo,
        grDocumentItem: item.grDocumentItem,
        grDocumentDate: item.grDocumentDate,
        taxCode: item.taxCode,
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
        isEdit: false
      } as itemsPoGrType
      form.invoicePoGr.push(data)
    }
    form.additionalCost = []
    for (const item of detail.additionalCosts) {
      const data = {
        activity: item.activityExpense,
        itemAmount: item.itemAmount.toString(),
        debitCredit: item.debitCredit,
        taxCode: item.taxCode,
        costCenter: item.costCenter,
        profitCenter: item.profitCenter,
        assignment: item.assignment,
        whtType: item.whtType,
        whtCode: item.whtCode,
        whtBaseAmount: item.whtBaseAmount.toString(),
        isEdit: false
      } as itemsCostType
      form.additionalCost.push(data)
    }

    for (const doc of detail.documents) {
      switch (doc.documentType) {
        case 1:
          form.invoiceDocument = {
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl
          }
          break
        case 2:
          form.tax = {
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl
          }
          break
        case 3:
          form.referenceDocument = {
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl
          }
          break
        case 4:
          form.otherDocument = {
            name: doc.documentName,
            fileSize: doc.documentSize.toString(),
            path: doc.documentUrl
          }
          break
      }
    }
  }
}

onMounted(() => {
  invoiceMasterApi.getTaxCode()
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getDocumentTypes()
  invoiceMasterApi.getVendorList()
  if (loginApi.isVendor) {
    form.invoiceType = '1'
  }

  if (route.query.type === 'po-view') {
    tabNow.value = 'preview'
  }

  if (route.query.type === 'po-view' || route.query.invoice) {

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
