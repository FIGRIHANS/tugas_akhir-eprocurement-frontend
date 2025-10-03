<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    </div>
    <div class="po__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th 
              v-for="(item, index) in columns"
              :key="index"
              class="po__column"
              :class="{
                'po__column--line': item.toLowerCase() === 'Line'.toLowerCase(),
                'po__column--tax': item.toLowerCase() === 'tax code',
                'po__column--wht-type': item.toLowerCase() === 'wht type',
                'po__column--wht-code': item.toLowerCase() === 'wht code',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pogrList" :key="index" class="po__items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">
              {{ moment(item.grDocumentDate).format('YYYY/MM/DD') || '-' }}
            </td>
            <td v-if="!checkInvoiceDp()">{{ form.currCode === 'IDR' ? useFormatIdr(item.itemAmount) : useFormatUsd(item.itemAmount) || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.quantity) || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.conditionTypeDesc || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.qcStatus || '-' }}</td>
            <td v-if="!checkPoPib()">{{ getTaxCodeName(item.taxCode) || '-' }}</td>
            <td v-if="!checkPoPib()">
              {{ form.currCode === 'IDR' ? useFormatIdr(item.vatAmount) : useFormatUsd(item.vatAmount) || 0 }}
            </td>
            <td v-if="!checkPoPib()">{{ getWhtTypeName(item.whtType) || '-' }}</td>
            <td v-if="!checkPoPib()">{{ getWhtCodeName(item.whtCode, item) || '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.whtBaseAmount ? form.currCode === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) : '-' }}</td>
            <td v-if="!checkPoPib()">{{ item.whtAmount ? form.currCode === 'IDR' ? useFormatIdr(item.whtAmount) : useFormatUsd(item.whtAmount) : '-' }}</td>
            <td>{{ item.department || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject, onMounted, type Ref } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import { defaultColumn, manualAddColumn, invoiceDpColumn } from '@/static/invoicePoGr'
import moment from 'moment'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { itemsPoGrType } from '../types/invoicePoGr'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const columns = ref<string[]>([])
const pogrList = ref<itemsPoGrType[]>([])

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const setAdditionalCostList = async () => {
  const result = [] as itemsPoGrType[]
  if (form.value.additionalCosts) {
    for (const item of form.value.invoicePoGr) {
      if (item.whtType) await callWhtCode(item.whtType)
      const data = {
        ...item,
        whtCodeList: whtCodeList.value
      }
      result.push(data)
    }
  }
  pogrList.value = result
}

const checkInvoiceDp = () => {
  return form.value.invoiceDPCode === 9012
}

const checkPoPib = () => {
  return form.value.invoiceTypeCode === 902
}

const setColumn = () => {
  if (checkInvoiceDp()) columns.value = ['Line', ...invoiceDpColumn]
  else if (checkPoPib()) columns.value = ['Line', ...manualAddColumn]
  else columns.value = ['Line', ...defaultColumn]
}

const callWhtCode = async (whtType: string) => {
  await invoiceMasterApi.getWhtCode(whtType)
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
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

const getWhtCodeName = (code: string, data: itemsPoGrType) => {
  const index = data.whtCodeList.findIndex((item) => item.whtCode === code)
  if (index !== -1) {
    const detailData = data.whtCodeList[index]
    return `${detailData.whtCode} - ${detailData.description}`
  }
  return '-'
}

watch(
  () => [form.value.invoiceDPCode, form.value.invoiceTypeCode],
  () => {
    setColumn()
  },
  {
    immediate: true
  }
)

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

onMounted(() => {
  setColumn()
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-po-gr.scss';
</style>
