<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex flex-1 gap-[24px]">
      <div class="flex flex-col gap-[24px] w-[60%]">
        <InvoiceView />
        <hr class="border-gray-300" />
        <InvoiceCalculationView />
      </div>
      <div class="flex flex-col gap-[20px] p-[24px] bg-gray-100 rounded-xl flex-1">
        <GeneralDataView />
        <hr class="border-gray-300" />
        <BankKeyView />
      </div>
    </div>
    <hr class="border-gray-300" />
    <InvoicePoGrView v-if="checkPo()" />
    <InvoiceItemView v-if="checkNonPo()" />
    <hr class="border-gray-300" />
    <AdditionalCostView v-if="(form.invoiceDp === '1' || form.invoiceDp === '1') && !checkNonPo()" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../types/invoiceAddWrapper'
import type { itemsPoGrType } from '../types/invoicePoGr'
import type { itemsCostType } from '../types/additionalCost'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const InvoiceView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceView.vue'))
const InvoicePoGrView = defineAsyncComponent(() => import('./InvoicePreview/InvoicePoGrView.vue'))
const InvoiceItemView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceItemView.vue'))
const AdditionalCostView = defineAsyncComponent(() => import('./InvoicePreview/AdditionalCostView.vue'))
const InvoiceCalculationView = defineAsyncComponent(() => import('./InvoicePreview/InvoiceCalculationView.vue'))
const GeneralDataView = defineAsyncComponent(() => import('./InvoicePreview/GeneralDataView.vue'))
const BankKeyView = defineAsyncComponent(() => import('./InvoicePreview/BankKeyView.vue'))

const invoiceApi = useInvoiceSubmissionStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const detailPo = computed(() => invoiceApi.detailPo)

const checkPo = () => {
  return typeForm.value === 'po' || typeForm.value === 'po-view'
}

const checkNonPo = () => {
  return typeForm.value === 'nonpo'
}

const setData = () => {
  const detail = detailPo.value
  if (form) {
    form.invoiceType = detail?.header.invoiceTypeCode.toString() || ''
    form.vendorId = detail?.vendor.vendorId.toString() || ''
    form.address = detail?.vendor.vendorAddress || ''
    form.bankKeyId = detail?.payment.bankKey || ''
    form.bankNameId = detail?.payment.bankName || ''
    form.beneficiaryName = detail?.payment.beneficiaryName || ''
    form.bankAccountNumber = detail?.payment.bankAccountNo || ''
    form.invoiceDp = detail?.header.invoiceDPCode.toString() || ''
    form.companyCode = detail?.header.companyCode || ''
    form.invoiceNoVendor = detail?.header.documentNo.toString() || ''
    form.invoiceNo = detail?.header.invoiceNo.toString() || ''
    form.invoiceDate = detail?.header.invoiceDate || ''
    form.taxNoInvoice = detail?.header.taxNo || ''
    form.currency = detail?.header.currCode || ''
    form.description = detail?.header.notes || ''
    form.subtotal = detail?.calculation.subtotal || 0
    form.vatAmount = detail?.calculation.vatAmount || 0
    form.additionalCostCalc = detail?.calculation.additionalCost || 0
    form.totalGrossAmount = detail?.calculation.totalGrossAmount || 0
    form.totalNetAmount = detail?.calculation.totalNetAmount || 0
    form.status = detail?.header.statusCode || 0
    form.invoicePoGr = []
    for (const item of detail?.pogr || []) {
      const data = {
        poNo: item.poNo,
        poItem: item.poItem,
        grDocumentNo: item.grDocumentNo,
        grDocumentItem: item.grDocumentItem,
        grDocumentDate: item.grDocumentDate,
        taxCode: item.taxCode,
        itemAmount: item.itemAmount,
        quantity: item.quantity,
        uom: item.uom,
        material: '',
        materialDescription: item.itemText,
        currency: 'IDR',
        conditionType: item.conditionType,
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
    for (const item of detail?.additionalCosts || []) {
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
  }
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'

  if (route.query.type === 'po-view') {
    invoiceMasterApi.getDpTypes()
    invoiceMasterApi.getActivity()
    invoiceMasterApi.getCompanyCode()
    invoiceApi.getPoDetail(route.query.invoice?.toString() || '').then(() => {
      setData()
    })
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-preview.scss';
</style>
