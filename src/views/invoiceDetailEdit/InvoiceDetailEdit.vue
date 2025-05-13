<template>
  <div>
    <Breadcrumb title="Add Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <TabInvoice :active-tab="tabNow" :with-preview="false" @change-tab="setTab" class="-mx-[24px]" />
    <div>
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
      <div class="flex justify-end items-center mt-[24px]">
        <button class="btn btn-outline btn-primary" @click="goBack">
          <i class="ki-filled ki-arrow-left"></i>
          Back
        </button>
        <button v-if="tabNow !== 'information'" class="btn btn-primary" @click="goNext">
          Next
          <i class="ki-duotone ki-black-right"></i>
        </button>
        <button v-if="tabNow === 'information'" class="btn btn-primary">
          Save
          <i class="ki-duotone ki-bookmark"></i>
        </button>
      </div>
    </div>
    <!-- <ModalSuccess /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, provide, type Component, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import type { formTypes } from './types/invoiceDetailEdit'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'
import TabInvoice from '@/components/invoice/TabInvoice.vue'
import { useCheckEmpty } from '@/composables/validation'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'

const InvoiceData = defineAsyncComponent(() => import('./InvoiceDetailEdit/InvoiceData.vue'))
const InvoiceInformation = defineAsyncComponent(() => import('./InvoiceDetailEdit/InvoiceInformation.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const router = useRouter()
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

const form = reactive<formTypes>({
  invoiceType: '',
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
  nameBank: '',
  postalCode: '',
  street: '',
  city: '',
  country: '',
  bankAccount: '',
  bankNumber: '',
  bankCountry: '',
  npwpNumber: '',
  ktpNumber: '',
  email: '',
  invoiceDate: '',
  postingDate: '',
  invoiceNumber: '',
  companyCode: '',
  estimatedPaymentDate: '',
  taxNumberInvoice: '',
  invoiceNumberVendor: '',
  paymentMethod: '',
  assignment: '',
  transferNews: '',
  currency: '',
  npwpReporting: '',
  description: '',
  invoiceDp: true,
  withDp: false,
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
  invoicePoGr: [
    {
      poNumber: '12',
      poItem: 'dw',
      GrDocumentNo: '12',
      GrDocumentItem: 'wd',
      GrDocumentDate: 'qf',
      taxCode: '43',
      itemAmount: 'fw',
      quantity: 'ag',
      unit: 'ger',
      itemText: 'ht',
      conditionType: 'fa',
      whtType: '23',
      whtCode: 'r23',
      whtBaseAmount: 'r4',
      category: 'fw',
      amountInvoice: 'vf',
      vatAmount: 'vs',
      totalNetAmount: 'bfg',
      isEdit: false
    }
  ],
  invoiceItem: [],
  additionalCost: [],
  status: 0
})

const contentComponent = computed(() => {
  const components = {
    data: InvoiceData,
    information: InvoiceInformation
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const checkInvoiceData = () => {
  if (
    form.nameBank ||
    form.postalCode ||
    form.street || 
    form.city ||
    form.country ||
    form.bankAccount ||
    form.bankNumber ||
    form.bankCountry ||
    form.npwpNumber ||
    form.ktpNumber ||
    form.email
  ) return false
}

const checkInvoiceInformation = () => {
  form.invoiceDateError = useCheckEmpty(form.invoiceDate).isError
  form.invoicePoGrError = form.invoicePoGr.length === 0

  form.invoiceDocumentError = form.invoiceDocument === null
  form.taxError = form.tax === null
  form.referenceDocumentError = form.referenceDocument === null
  form.otherDocumentError = form.otherDocument === null

  if (
    form.invoiceDateError ||
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
const goBack = () => {
  const list = ['data', 'information']
  const checkIndex = list.findIndex((item) => item === tabNow.value)
  if (checkIndex !== -1) {
    tabNow.value = list[checkIndex - 1]
  }
}

const goNext = () => {
  const list = ['data', 'information']
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
    router.push({
      name: 'invoice-list'
    })
  }
}

onMounted(() => {
  invoiceApi.getTaxCalculation()
  if (form.status === 2) {
    activeStep.value = 'Verification'
  } else {
    activeStep.value = 'Approval'
  }
})

provide('form', form)
</script>

<style lang="scss" scoped>
@use './styles/invoice-detail-edit.scss';
</style>
