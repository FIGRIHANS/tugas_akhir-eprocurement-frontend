<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
    </div>
    <div class="cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__column"
              :class="{
                'cost__column--line': item.toLowerCase() === 'Line'.toLowerCase(),
                'cost__column--activity': item.toLowerCase() === 'activity / expense',
                'cost__column--tax': item.toLowerCase() === 'tax code',
                'cost__column--cost': item.toLowerCase() === 'cost center',
                'cost__column--wht-type': item.toLowerCase() === 'wht type',
                'cost__column--wht-code': item.toLowerCase() === 'wht code',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in additionalList" :key="index" class="cost__items">
            <td>{{ index + 1 }}</td>
            <td>{{ getActivityName(item.activityId) || '-' }}</td>
            <td>{{ item.itemAmount || '-' }}</td>
            <td>{{ item.debitCredit || '-' }}</td>
            <td>{{ getTaxCodeName(item.taxCode) || '-' }}</td>
            <td>{{ item.vatAmount ? form.currCode === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) : '-' }}</td>
            <td>{{ getCostCenterName(item.costCenter) || '-' }}</td>
            <td>{{ item.profitCenter || '-' }}</td>
            <td>{{ item.assignment || '-' }}</td>
            <td>{{ getWhtTypeName(item.whtType) || '-' }}</td>
            <td>{{ getWhtCodeName(item.whtCode, item) || '-' }}</td>
            <td>{{ item.whtBaseAmount || '-' }}</td>
            <td>{{ item.whtAmount || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, type Ref } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import type { itemsCostType } from '../types/additionalCost'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const additionalList = ref<itemsCostType[]>([])

const columns = ref([
  'Line',
  'Activity / Expense',
  'Item Amount',
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

const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)
const listActivity = computed(() => invoiceMasterApi.activityList)
const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)

const setAdditionalCostList = () => {
  const result = [] as itemsCostType[]
  if (form.value.additionalCosts) {
    for (const item of form.value.additionalCosts) {
      if (item.whtType) callWhtCode(item.whtType)
      const data = {
        ...item,
        whtCodeList: whtCodeList.value
      }
      result.push(data)
    }
  }
  additionalList.value = result
}

const callWhtCode = (whtType: string) => {
  invoiceMasterApi.getWhtCode(whtType)
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
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

const getWhtCodeName = (code: string, data: itemsCostType) => {
  const index = data.whtCodeList.findIndex((item) => item.whtCode === code)
  if (index !== -1) {
    const detailData = data.whtCodeList[index]
    return `${detailData.whtCode} - ${detailData.description}`
  }
  return '-'
}

watch(
  () => form.value,
  () => {
    setAdditionalCostList()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>
