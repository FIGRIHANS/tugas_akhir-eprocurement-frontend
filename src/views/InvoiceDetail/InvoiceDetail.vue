<template>
  <div>
    <Breadcrumb title="Detail Invoice" :routes="routes" />
    <StepperStatus active-name="Approval" />
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
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, defineAsyncComponent } from 'vue'
import type { formTypes } from './types/invoiceDetail'
import { type routeTypes } from '@/core/type/components/breadcrumb'
import Breadcrumb from '@/components/BreadcrumbView.vue'
import StepperStatus from '../../components/stepperStatus/StepperStatus.vue'

const StatusInvoice = defineAsyncComponent(() => import('./InvoiceDetail/StatusInvoice.vue'))
const GeneralData = defineAsyncComponent(() => import('./InvoiceDetail/GeneralData.vue'))
const BankKey = defineAsyncComponent(() => import('./InvoiceDetail/BankKey.vue'))
const InvoiceHeaderDocument = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceHeaderDocument.vue'))
const InvoiceCalculation = defineAsyncComponent(() => import('./InvoiceDetail/InvoiceCalculation.vue'))
const InvoicePoGr = defineAsyncComponent(() => import('./InvoiceDetail/InvoicePoGr.vue'))
const AdditionalCost = defineAsyncComponent(() => import('./InvoiceDetail/AdditionalCost.vue'))

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
      quantity: '1',
      uom: 'EA',
      price: '$1000.00 CAD',
      part: '0001',
      auxiliaryPartId: '5000123-0001',
      subTotal: '$1000.00',
      taxCode: 'V1-PPN 10%',
      vatAmount: '110.000',
      wht: '110.000',
      whtAmount: '110.000',
      description: 'Gate/Fence Instalation at stewartfile GS',
    }
  ],
  additionalCost: [
    {
      line: '1',
      quantity: '1',
      uom: 'EA',
      amount: '1000.00 CAD',
      costType: 'Transport Cost',
      subTotal: '$1000.00',
      taxCode: 'V1-PPN 10%',
      vatAmount: '110.000',
      wht: '110.000',
      whtAmount: '110.000',
      description: 'Gate/Fence Instalation at stewartfile GS',
    }
  ],
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null
})

provide('form', form.value)
</script>
