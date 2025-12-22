<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="invoice__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              :class="{
                'invoice__field-base--line': item.toLowerCase() === 'line',
                'invoice__field-base--tax': item.toLowerCase() === 'tax code',
                'invoice__field-base--wht-type': item.toLowerCase() === 'wht type',
                'invoice__field-base--wht-code': item.toLowerCase() === 'wht code',
              }"
              class="invoice__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pogrLsit" :key="index" class="invoice__field-items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">
              {{ moment(item.grDocumentDate).format('YYYY/MM/DD') }}
            </td>
            <td>
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.itemAmountLC)
                  : useFormatUsd(item.itemAmountTC)
              }}
            </td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.quantity) }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionTypeDesc || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.qcStatus || '-' }}</td>
            <td v-if="!checkPoPib()">{{ getTaxCodeName(item.taxCode) || '-' }}</td>
            <td v-if="!checkPoPib()">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.vatAmount || 0)
                  : useFormatUsd(item.vatAmount || 0)
              }}
            </td>
            <td v-if="!checkPoPib()">{{ getWhtTypeName(item.whtType) || '-' }}</td>
            <td v-if="!checkPoPib()">{{ getWhtCodeName(item.whtCode, item) || '-' }}</td>
            <td v-if="!checkPoPib()">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.whtBaseAmount?.toString() || '')
                  : useFormatUsd(item.whtBaseAmount?.toString() || '')
              }}
            </td>
            <td v-if="!checkPoPib()">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.whtAmount?.toString() || '')
                  : useFormatUsd(item.whtAmount?.toString() || '')
              }}
            </td>
            <td>{{ item.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import moment from 'moment'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { itemsPoGrType } from '../../types/invoicePoGr'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const columns = ref<string[]>([])
const pogrLsit = ref<itemsPoGrType[]>([])

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const setPoGrList = async () => {
  const result = [] as itemsPoGrType[]
  if (form.invoicePoGr) {
    for (const item of form.invoicePoGr) {
      if (item.whtType) await callWhtCode(item.whtType)
      const data = {
        ...item,
        whtCodeList: whtCodeList.value,
      }
      result.push(data)
    }
  }
  pogrLsit.value = result
}

const callWhtCode = async (whtType: string) => {
  await invoiceMasterApi.getWhtCode(whtType)
}

const checkInvoiceDp = () => {
  return form?.invoiceDp === '9012'
}

const checkPoPib = () => {
  return form?.invoiceType === '902'
}

const setColumn = () => {
  if (form?.invoiceType === '902') columns.value = ['Line', ...PoPibColumn]
  else if (checkInvoiceDp()) columns.value = ['Line', ...invoiceDpColumn]
  else columns.value = ['Line', ...defaultColumn]
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
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    setColumn()
  },
  {
    immediate: true,
  },
)

watch(
  () => form,
  () => {
    setPoGrList()
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  setColumn()
})
</script>
