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
        <button class="btn btn-primary" @click="goNext">
          {{ tabNow !== 'preview' ? 'Lanjut' : 'Submit' }}
          <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
          <i v-else class="ki-duotone ki-paper-plane"></i>
        </button>
      </div>
      <div v-else class="flex justify-end items-center mt-[24px]">
        <button v-if="tabNow !== 'preview'" class="btn btn-primary" @click="goNext">
          Lanjut
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
import { ref, reactive, computed, provide, type Component, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import type { formTypes } from './types/invoiceAddWrapper'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from './InvoiceAddWrapper/TabInvoice.vue'
import iconPDF from '@/components/icons/iconPDF.vue'
import { KTModal } from '@/metronic/core'
import { useCheckEmpty } from '@/composables/validation'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoiceInformation.vue'))
const InvoicePreview = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoicePreview.vue'))
const ModalSuccess = defineAsyncComponent(() => import('./InvoiceAddWrapper/InvoicePreview/ModalSuccess.vue'))

const router = useRouter()
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
  name: '',
  vendorId: '',
  businessField: '',
  subBusinessField: '',
  invoiceCategory: '',
  address: '',
  bankKeyId: '',
  bankNameId: '',
  beneficiaryName: '',
  bankAccountNumber: '',
  swiftCode: '',
  bankAddress: '',
  invoiceNo: '',
  companyCode: '',
  companyCodeDescription: '',
  supplierInvoiceNumber: '',
  invoiceDate: '',
  taxNumber: '',
  taxDate: '',
  taxCode: '',
  whtCode: '',
  paymentDate: '',
  department: '',
  invoiceDp: false,
  withDp: false,
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
  invoicePoGr: [],
  invoiceItem: [],
  additionalCost: [],
  status: 1
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation,
    preview: InvoicePreview
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const checkInvoiceData = () => {
  form.vendorIdError = useCheckEmpty(form.vendorId).isError
  form.bankKeyIdError = useCheckEmpty(form.bankKeyId).isError

  if (
    form.vendorIdError ||
    form.bankKeyIdError
  ) return false
  else return true
}

const checkInvoiceInformation = () => {
  form.supplierInvoiceNumberError = useCheckEmpty(form.supplierInvoiceNumber).isError
  form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
  form.taxNumberError = useCheckEmpty(form.taxNumber).isError
  form.taxDateError = useCheckEmpty(form.taxDate).isError
  form.taxCodeError = useCheckEmpty(form.taxCode).isError
  form.whtCodeError = useCheckEmpty(form.whtCode).isError
  form.paymentDateError = useCheckEmpty(form.paymentDate).isError
  form.invoicePoGrError = form.invoicePoGr.length === 0

  form.invoiceDocumentError = form.invoiceDocument === null
  form.taxError = form.tax === null
  form.referenceDocumentError = form.referenceDocument === null
  form.otherDocumentError = form.otherDocument === null

  if (
    form.supplierInvoiceNumberError ||
    form.invoiceDateError ||
    form.taxNumberError ||
    form.taxDateError ||
    form.taxCodeError ||
    form.whtCodeError ||
    form.paymentDateError ||
    form.invoiceDocumentError ||
    form.taxError ||
    form.referenceDocumentError ||
    form.otherDocumentError
  ) return false
  else return true
}

const setTab = (value: string) => {
  tabNow.value = value
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
    const idModal = document.querySelector('#success_invoice_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()

    setTimeout(() => {
      modal.hide()
      router.push({
        name: 'invoice-list'
      })
    }, 1000)
  }
}

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-submission.scss';
</style>
