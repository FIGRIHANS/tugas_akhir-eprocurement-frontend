<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Costs / Expenses</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              :class="{
                'invoice__field-base--line': item.toLowerCase() === 'line',
                'invoice__field-base--activity': item.toLowerCase() === 'activity / expense',
                'invoice__field-base--item-amount': item.toLowerCase() === 'item amount',
                'invoice__field-base--tax': item.toLowerCase() === 'tax code',
                'invoice__field-base--cost': item.toLowerCase() === 'cost center',
                'invoice__field-base--wht-type': item.toLowerCase() === 'wht type',
                'invoice__field-base--wht-code': item.toLowerCase() === 'wht code',
              }"
              class="invoice__field-base"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoiceItem" :key="index" class="invoice__field-items">
            <td>{{ index + 1 }}</td>
            <td>{{ !item.activityCode && !item.activityName ? getActivityName(item.activity) : `${item.activityCode} - ${item.activityName}` || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.itemAmount) : useFormatUsd(item.itemAmount) || '-' }}</td>
            <td>{{ item.itemText || '-' }}</td>
            <td>{{ getDebitCreditName(item.debitCredit) || '-' }}</td>
            <td>{{ getTaxCodeName(item.taxCode) || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) || '-' }}</td>
            <td>{{ getCostCenterName(item.costCenter) || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ getWhtTypeName(item.whtType) || '-' }}</td>
            <td>{{ getWhtCodeName(item.whtCode, item) || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) || '-' }}</td>
            <td>{{ form.currency === 'IDR' ? useFormatIdr(item.whtAmount) : useFormatUsd(item.whtAmount) || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from 'vue'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { invoiceItemTypes } from '../../types/invoiceItem'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const costExpenseList = ref<invoiceItemTypes[]>([])

const columns = ref<string[]>([
  'Line',
  'Activity / Expense',
  'Item Amount',
  'Item Text',
  'Debit/Credit',
  'Tax Code',
  'VAT Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount'
])

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)
const listActivity = computed(() => invoiceMasterApi.activityList)

const setAdditionalCostList = async () => {
  const result = [] as invoiceItemTypes[]
  if (form.invoiceItem) {
    for (const item of form.invoiceItem) {
      if (item.whtType) await callWhtCode(item.whtType)
      const data = {
        ...item,
        whtCodeList: whtCodeList.value
      }
      result.push(data)
    }
  }
  costExpenseList.value = result
}

const callWhtCode = async (whtType: string) => {
  await invoiceMasterApi.getWhtCode(whtType)
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}

const getDebitCreditName = (code: string) => {
  if (code === 'K') return 'Credit'
  else if (code === 'D') return 'Debit'
  else return '-'
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getCostCenterName = (costCenter: string) => {
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getWhtTypeName = (code: string) => {
  const index = whtTypeList.value.findIndex((item) => item.code === code)
  if (index !== -1) {
    const data = whtTypeList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getWhtCodeName = (code: string, data: invoiceItemTypes) => {
  const index = data.whtCodeList.findIndex((item) => item.whtCode === code)
  if (index !== -1) {
    const detailData = data.whtCodeList[index]
    return `${detailData.whtCode} - ${detailData.description}`
  }
  return '-'
}

watch(
  () => form,
  () => {
    setAdditionalCostList()
    invoiceMasterApi.getCostCenter(form.companyCode || '')
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
