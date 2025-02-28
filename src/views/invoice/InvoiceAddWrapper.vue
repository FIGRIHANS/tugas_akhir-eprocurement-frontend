<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus />
    <TabInvoice :active-tab="tabNow" @change-tab="setTab" />
    <div class="p-[24px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div class="flex justify-between items-center gap-[8px] mt-[24px]">
        <div class="flex items-center gap-[16px]">
          <button v-if="tabNow === 'preview'" class="btn btn-outline btn-primary">
            Save as PDF
            <iconPDF />
          </button>
          <button class="btn btn-outline btn-primary">
            Save as Draft
            <i class="ki-duotone ki-bookmark"></i>
          </button>
        </div>
        <button class="btn btn-primary" @click="goNext">
          {{ tabNow !== 'preview' ? 'Lanjut' : 'Submit' }}
          <i v-if="tabNow !== 'preview'" class="ki-duotone ki-black-right"></i>
          <i v-else class="ki-duotone ki-paper-plane"></i>
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
import StepperStatus from './InvoiceAddWrapper/StepperStatus.vue'
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
  companyId: '',
  vendorId: '',
  billToCompany: '',
  billToVendor: '',
  vendorTaxId: '',
  address: '',
  bankKeyId: '',
  bankNameId: '',
  beneficiaryName: '',
  bankAccountNumber: '',
  swiftCode: '',
  bankAddress: '',
  invoiceNo: '',
  taxInvoiceNumber: '',
  taxDate: '',
  taxCalculationId: '',
  taxCode: '',
  whtCode: '',
  paymentTerm: '',
  invoiceDocument: null,
  tax: null,
  bast: null,
  referenceDocument: null,
  buktiPotong: null,
  otherDocument: null,
  invoicePoGr: [],
  additionalCost: []
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
  form.companyIdError = useCheckEmpty(form.companyId).isError
  form.vendorIdError = useCheckEmpty(form.vendorId).isError
  form.billToCompanyError = useCheckEmpty(form.billToCompany).isError
  form.billToVendorError = useCheckEmpty(form.billToVendor).isError
  form.vendorTaxIdError = useCheckEmpty(form.vendorTaxId).isError
  form.addressError = useCheckEmpty(form.address).isError

  form.bankKeyIdError = useCheckEmpty(form.bankKeyId).isError
  form.bankNameIdError = useCheckEmpty(form.bankNameId).isError
  form.beneficiaryNameError = useCheckEmpty(form.beneficiaryName).isError
  form.bankAccountNumberError = useCheckEmpty(form.bankAccountNumber).isError
  form.swiftCodeError = useCheckEmpty(form.swiftCode).isError
  form.bankAddressError = useCheckEmpty(form.bankAddress).isError

  if (
    form.companyIdError ||
    form.vendorIdError ||
    form.billToCompanyError ||
    form.billToVendorError ||
    form.vendorTaxIdError ||
    form.addressError ||
    form.bankKeyIdError ||
    form.bankNameIdError ||
    form.beneficiaryNameError ||
    form.bankAccountNumberError ||
    form.swiftCodeError ||
    form.bankAddressError
  ) return false
  else return true
}

const checkInvoiceInformation = () => {
  form.invoiceNoError = useCheckEmpty(form.invoiceNo).isError
  form.taxInvoiceNumberError = useCheckEmpty(form.taxInvoiceNumber).isError
  form.taxDateError = useCheckEmpty(form.taxDate).isError
  form.taxCalculationIdError = useCheckEmpty(form.taxCalculationId).isError
  form.taxCodeError = useCheckEmpty(form.taxCode).isError
  form.whtCodeError = useCheckEmpty(form.whtCode).isError
  form.paymentTermError = useCheckEmpty(form.paymentTerm).isError
  form.invoicePoGrError = form.invoicePoGr.length === 0
  form.additionalCostError = form.additionalCost.length === 0

  form.invoiceDocumentError = form.invoiceDocument === null
  form.taxError = form.tax === null
  form.bastError = form.bast === null
  form.referenceDocumentError = form.referenceDocument === null
  form.buktiPotongError = form.buktiPotong === null
  form.otherDocumentError = form.otherDocument === null

  if (
    form.invoiceNoError ||
    form.taxInvoiceNumberError ||
    form.taxDateError ||
    form.taxCalculationIdError ||
    form.taxCodeError ||
    form.whtCodeError ||
    form.paymentTermError ||
    form.invoiceDocumentError ||
    form.taxError ||
    form.bastError ||
    form.referenceDocumentError ||
    form.buktiPotongError ||
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
    if (tabNow.value === 'data') {
      const check = checkInvoiceData()
      if (!check) return
    } else {
      const check = checkInvoiceInformation()
      if (!check) return
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
