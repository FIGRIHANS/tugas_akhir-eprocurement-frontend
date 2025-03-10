<template>
  <div>
    <Breadcrumb title="Detail Invoice" :routes="routes" />
    <StepperStatus :active-name="activeStep" />
    <hr class="-mx-[24px] mb-[24px]" />
    <StatusInvoice class="mb-[24px]" />
    <div class="flex gap-[24px]">
      <GeneralData class="flex-1" />
      <BankKey class="flex-1" />
    </div>
    <div class="flex gap-[24px] mt-[24px]">
      <InvoiceHeaderDocument class="flex-1" />
      <InvoiceCalculation class="flex-1" />
    </div>
    <InvoicePoGr class="mt-[24px]" />
    <AdditionalCost class="mt-[24px]" />
    <div v-if="form.status === 2" class="flex items-center justify-end gap-[10px] py-[8px] px-[30px] mt-[24px]">
      <button class="btn btn-outline btn-danger" @click="openReject">
        <i class="ki-duotone ki-cross-circle"></i>
        Reject
      </button>
      <button class="btn btn-primary" @click="goVerif">
        <i class="ki-duotone ki-check-circle"></i>
        Verify
      </button>
    </div>
    <RejectVerification />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, defineAsyncComponent, onMounted } from 'vue'
import type { formTypes } from './types/invoiceDetail'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import { KTModal } from '@/metronic/core'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'

const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
const GeneralData = defineAsyncComponent(() => import('./InvoiceDetail/GeneralData.vue'))
const BankKey = defineAsyncComponent(() => import('./InvoiceDetail/BankKey.vue'))
const InvoiceHeaderDocument = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceHeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceDetail/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceDetail/AdditionalCost.vue'))
const RejectVerification = defineAsyncComponent(() => import('./InvoiceDetail/RejectVerification.vue'))

const activeStep = ref<string>('')

const routes = ref<routeTypes[]>([
  {
    name: 'Invoice Approval',
    to: '/invoice/approval'
  },
  {
    name: 'Detail Invoice',
    to: '/invoice/detail'
  }
])

const form = ref<formTypes>({
  companyId: 'PT Arya Noble',
  vendorId: 'PT Pharmacy',
  businessField: 'asd',
  subBusinessField: 'asd',
  address: 'Jl. Anumerta no 23 Jakarta Barat',
  vendorTaxId: '23747623',
  bankKeyId: 'BNI1',
  bankNameId: 'BNI',
  beneficiaryName: 'PT Pharmacy',
  bankAccountNumber: '1276387264',
  swiftCode: 'BNI123',
  bankAddress: 'Jl.Maharaya no 24 Jakarta Barat',
  invoiceNo: 'string',
  taxInvoiceNumber: 'string',
  taxDate: 'string',
  taxCalculationId: 'string',
  taxCode: 'string',
  whtCode: 'string',
  paymentTerm: 'string',
  invoicePoGr: [
    {
      line: '1',
      grNumber: 'GR00123',
      poNumber: 'PO220521000001',
      poSapNumber: '1110021976',
      itemName: 'BOTOL ESK CG 50ML',
      quantity: '15',
      uom: 'PCS',
      costPerUnit: '99.998',
      totalCost: '1.499.970,00',
      deliveryDate: '20 Juni 2024',
      billable: '1.499.970,00',
      dp: '-',
      dpValue: '-',
      whtType: 'Wajib Pajak',
      whtCode: '-',
      dpp: '1.000.000',
      whtValue: '0',
      vat: 'V2',
      otherDpp: '-',
      amount: '1.000.000'
    }
  ],
  additionalCost: [
    {
      line: '1',
      type: 'Demurrage Cost',
      glCode: 'GR00123',
      costCenter: '-',
      quantity: '15',
      uom: 'PCS',
      costPerUnit: '99.998',
      totalCost: '1.499.970,00',
      pphType: 'Wajib Pajak',
      pphCode: '-',
      dpp: '1.000.000',
      pphValue: '0',
      vat: 'V2',
      otherDpp: '-',
      amount: '1.000.000',
      remark: 'Perlu ada detail'
    }
  ],
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
  status: 2
})

const openReject = () => {
  const idModal = document.querySelector('#reject_Verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkVerif = () => {
  const data = form.value
  if (
    !data.bankKeyCheck ||
    !data.generalDataCheck ||
    !data.invoiceHeaderDocumentCheck ||
    !data.invoiceCalculationCheck ||
    !data.invoicePoGrCheck ||
    !data.additionalCostCheck 
  ) return false
  return true
}

const goVerif = () => {
  const status = checkVerif()

  if (!status) return
}

onMounted(() => {
  if (form.value.status === 2) {
    activeStep.value = 'Verification'
    routes.value = [
      {
        name: 'Invoice Verification',
        to: '/invoice/verification'
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail'
      }
    ]
  } else {
    activeStep.value = 'Approval'
    routes.value = [
      {
        name: 'Invoice Approval',
        to: '/invoice/approval'
      },
      {
        name: 'Detail Invoice',
        to: '/invoice/detail'
      }
    ]
  }
})

provide('form', form.value)
</script>
