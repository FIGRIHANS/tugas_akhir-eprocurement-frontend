<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus active-name="Submission" />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" class="-mx-[24px]" />
    <div v-if="form.status !== 0" class="status__box--approved -mt-5 -mx-[24px]">
      <i class="ki-outline ki-shield-tick text-primary text-[36px]"></i>
      <div>
        <p class="text-[15px] font-semibold mb-[4px]">Successfully Submitted</p>
        <p class="text-[13px] font-medium text-gray-700">
          The invoice has been successfully submitted. You can now download the invoice PDF for your records.
        </p>
      </div>
    </div>
    <div>
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div v-if="form.status === 0" class="flex justify-between items-center gap-[8px] mt-[24px]">
        <button class="btn btn-outline btn-primary">
          Save as Draft
          <i class="ki-duotone ki-bookmark"></i>
        </button>
        <div class="flex items-center justify-end gap-[8px]">
          <button v-if="tabNow !== 'data'" class="btn btn-outline btn-primary" @click="goBack">
            <i class="ki-filled ki-arrow-left"></i>
            Back
          </button>
          <button class="btn btn-primary" @click="goNext">
            {{ tabNow !== 'preview' ? 'Lanjut' : 'Submit' }}
            <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
            <i v-else class="ki-duotone ki-paper-plane"></i>
          </button>
        </div>
      </div>
      <div v-else class="flex justify-end items-center mt-[24px]">
        <button v-if="tabNow !== 'preview'" class="btn btn-outline btn-primary" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button v-if="tabNow !== 'preview'" class="btn btn-primary" @click="goNext">
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button v-if="tabNow === 'preview'" class="btn btn-primary">
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
  invoiceType: '',
  invoiceTypeName: '',
  vendorId: '',
  businessField: '',
  subBusinessField: '',
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
  invoiceDp: 'NON',
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
  invoicePoGr: [],
  invoiceItem: [],
  additionalCost: [],
  status: 0
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

const checkInvoiceInformation = () => {
  form.companyCodeError = useCheckEmpty(form.companyCode).isError
  form.invoiceNoVendorError = useCheckEmpty(form.invoiceNoVendor).isError
  form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
  form.taxNoInvoiceError = useCheckEmpty(form.taxNoInvoice).isError
  form.descriptionError = useCheckEmpty(form.description).isError
  form.invoiceDocumentError = form.invoiceDocument === null
  form.invoicePoGrError = form.invoicePoGr.length === 0

  if (
    form.companyCodeError ||
    form.invoiceNoVendorError ||
    form.invoiceDateError ||
    form.taxNoInvoiceError ||
    form.descriptionError ||
    form.invoiceDocumentError ||
    form.invoicePoGrError
  ) return false
  else return true
}

const setTab = (value: string) => {
  tabNow.value = value
}
const goBack = () => {
  const list = ['data', 'information', 'preview']
  const checkIndex = list.findIndex((item) => item === tabNow.value)
  if (checkIndex !== -1) {
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
        documentType: listDocumentType.value[index].id,
        documentName: form.invoiceDocument?.name,
        documentUrl: form.invoiceDocument?.url,
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
      grDocumentDate: moment(item.grDocumentDate).toISOString(),
      taxCode: item.taxCode,
      itemAmount: Number(item.itemAmount),
      quantity: Number(item.quantity),
      uom: item.uom,
      itemText: item.materialDescription,
      conditionType: item.conditionType,
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

const mapDataPost = () => {
  const data = {
    header: {
      invoiceUId: '00000000-0000-0000-0000-000000000000',
      invoiceTypeCode: Number(form.invoiceType),
      invoiceTypeName: form.invoiceTypeName,
      invoiceDPCode: Number(form.invoiceType),
      invoiceDPName: form.invoiceTypeName,
      companyCode: form.companyCode,
      companyName: form.companyName,
      invoiceNo: form.invoiceNo,
      vendorInvoiceNo: form.invoiceNoVendor,
      invoiceDate: moment(form.invoiceDate).toISOString(),
      invoiceTaxNo: form.taxNoInvoice,
      currCode: form.currency,
      notes: form.description,
      statusCode: 1,
      statusName: 'Waiting to Verify'
    },
    vendor: {
      vendorId: Number(form.vendorId),
      vendorName: form.vendorId,
      vendorBusinessUnit: form.businessField,
      vendorSubBusinessUnit: form.subBusinessField,
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
      subtotal: 0,
      vatAmount: 0,
      whtAmount: 0,
      additionalCost: 0,
      totalGrossAmount: 0,
      totalNetAmount: 0,
    },
    pogr: mapPoGr(),
    additionalCosts: mapAdditionalCost()
  } as ParamsSubmissionTypes

  return data
} 

const goNext = () => {
  const list = ['data', 'information', 'preview']
  if (tabNow.value !== 'preview') {
    if (form.status === 0) {
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
    // console.log(mapDataPost())
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
  }
}

onMounted(() => {
  invoiceApi.getTaxCalculation()
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getDocumentTypes()
  invoiceMasterApi.getVendorList()
  if (loginApi.isVendor) {
    form.invoiceType = '1'
  }
})

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-submission.scss';
</style>
