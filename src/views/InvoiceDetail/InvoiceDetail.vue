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
    <div class="flex gap-[24px] mt-[24px] max-h-[457px]">
      <InvoiceHeaderDocument class="flex-1" />
      <InvoiceCalculation class="flex-1" />
    </div>
    <InvoicePoGr v-if="checkPo()" class="mt-[24px]" />
    <AdditionalCost v-if="!form.invoiceDp && !form.withDp && checkPo()" class="mt-[24px]" />
    <div v-if="form.status === 2" class="flex items-center justify-between gap-[8px] mt-[24px]">
      <div class="flex items-center gap-[10px]">
        <button class="btn btn-outline btn-primary">
          <i class="ki-filled ki-black-left"></i>
          Back
        </button>
        <button class="btn btn-primary" @click="goToEdit">
          <i class="ki-duotone ki-pencil"></i>
          Edit
        </button>
      </div>
      <div class="flex items-center justify-end gap-[10px]">
        <button class="btn btn-outline btn-danger" @click="openReject">
          <i class="ki-duotone ki-cross-circle"></i>
          Reject
        </button>
        <button class="btn btn-primary" @click="goVerif">
          <i class="ki-duotone ki-check-circle"></i>
          Verify
        </button>
      </div>
    </div>
    <RejectVerification />
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
const router = useRouter()

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
  invoiceType: 'po',
  vendorId: 'PT Pharmacy',
  businessField: 'asd',
  subBusinessField: 'asd',
  address: 'Jl. Anumerta no 23 Jakarta Barat',
  isNotRegisteredBank: false,
  bankKeyId: 'BNI1',
  bankNameId: 'BNI',
  beneficiaryName: 'PT Pharmacy',
  bankAccountNumber: '1276387264',
  swiftCode: 'BNI123',
  bankAddress: 'Jl.Maharaya no 24 Jakarta Barat',
  invoiceDate: '12/12/2024',
  postingDate: '-',
  invoiceNo: 'INV0000123',
  companyCode: 'code',
  invoicingParty: 'INV/01/PK/2025053',
  estimatedPaymentDate: '2365456',
  taxNumberInvoice: '12/12/2024',
  invoiceNumberVendor: 'V1',
  paymentMethod: 'W2',
  assignment: '12/12/2024',
  transferNews: 'test',
  currency: 'test',
  npwpReporting: 'test',
  description: 'test',
  invoiceDp: false,
  withDp: false,
  invoicePoGr: [
    {
      line: '1',
      poNumber: 'PO220521000001',
      poItem: 'BOTOL ESK CG 50ML',
      GrDocumentNo: '15',
      GrDocumentItem: 'PCS',
      GrDocumentDate: '99.998',
      taxCode: '1.499.970,00',
      itemAmount: '-',
      quantity: '20 Juni 2024',
      unit: '1.499.970,00',
      itemText: '-',
      conditionType: '-',
      whtType: 'Wajib Pajak',
      whtCode: '-',
      whtBaseAmount: '1.000.000',
      category: '0',
      amountInvoice: 'V2',
      vatAmount: '-',
      totalNetAmount: '1.000.000',
      isEdit: false
    }
  ],
  invoiceItem: [],
  additionalCost: [
    {
      line: '1',
      activity: 'Demurrage Cost',
      itemAmount: 'GR00123',
      debitCredit: '15',
      taxCode: 'PCS',
      costCenter: '99.998',
      profitCenter: '1.499.970,00',
      assignment: 'Wajib Pajak',
      whtType: '-',
      whtCode: '1.000.000',
      whtBaseAmount: 'V2',
      amount: '-',
      isEdit: false
    }
  ],
  invoiceDocument: null,
  tax: null,
  referenceDocument: null,
  otherDocument: null,
  status: 2
})

const goToEdit = () => {
  router.push({
    name: 'invoiceDetailEdit'
  })
}

const openReject = () => {
  const idModal = document.querySelector('#reject_Verification_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkPo = () => {
  return form.value.invoiceType === 'po'
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
