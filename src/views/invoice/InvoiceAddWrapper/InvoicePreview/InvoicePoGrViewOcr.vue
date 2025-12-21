<template>
  <div v-if="form" class="flex flex-col gap-6">
    <p class="text-lg font-semibold">Invoice PO & GR Item</p>

    <!-- TABLE WRAPPER -->
    <div class="relative overflow-x-auto rounded-lg border border-gray-300">
      <table class="table table-xs table-border w-full whitespace-nowrap">
        <!-- HEADER -->
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="px-3 py-2 text-left text-xs font-semibold text-gray-700"
            >
              {{ item }}
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>
          <tr v-for="(item, index) in pogrLsit" :key="index" class="border-t hover:bg-gray-50">
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ item.poNo }}</td>

            <td v-if="!checkInvoiceDp()" class="px-3 py-2">
              {{ item.poItem }}
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ item.grDocumentNo || '-' }}
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ item.grDocumentItem || '-' }}
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ moment(item.grDocumentDate).format('YYYY/MM/DD') }}
            </td>

            <td class="px-3 py-2 text-right">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.itemAmountLC)
                  : useFormatUsd(item.itemAmountTC)
              }}
            </td>

            <td v-if="!checkInvoiceDp()" class="px-3 py-2 text-right">
              {{ useFormatIdr(item.quantity) }}
            </td>

            <td v-if="!checkInvoiceDp()" class="px-3 py-2">
              {{ item.uom || '-' }}
            </td>

            <td v-if="!checkInvoiceDp()" class="px-3 py-2 max-w-[360px]">
              <div class="group relative">
                <span class="block truncate whitespace-nowrap">
                  {{ item.itemText || '-' }}
                </span>

                <div
                  class="absolute z-50 hidden group-hover:block max-w-md rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg top-2 left-0 -translate-y-full"
                >
                  {{ item.itemText }}
                </div>
              </div>
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ item.conditionType || '-' }}
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ item.conditionTypeDesc || '-' }}
            </td>

            <td v-if="!checkInvoiceDp() && !checkPoPib()" class="px-3 py-2">
              {{ item.qcStatus || '-' }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2">
              {{ getTaxCodeName(item.taxCode) || '-' }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2 text-right">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.vatAmount || 0)
                  : useFormatUsd(item.vatAmount || 0)
              }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2">
              {{ getWhtTypeName(item.whtType) || '-' }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2">
              {{ getWhtCodeName(item.whtCode, item) || '-' }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2 text-right">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.whtBaseAmount || 0)
                  : useFormatUsd(item.whtBaseAmount || 0)
              }}
            </td>

            <td v-if="!checkPoPib()" class="px-3 py-2 text-right">
              {{
                form.currency === 'IDR'
                  ? useFormatIdr(item.whtAmount || 0)
                  : useFormatUsd(item.whtAmount || 0)
              }}
            </td>

            <td class="px-3 py-2">
              {{ item.department }}
            </td>

            <!-- MATCH ICONS -->
            <td class="px-3 py-2 text-center">
              <i class="ki-filled ki-check-circle text-green-500"></i>
            </td>
            <td class="px-3 py-2 text-center">
              <i class="ki-filled ki-cross-circle text-red-500"></i>
            </td>
            <td class="px-3 py-2 text-center">
              <i class="ki-filled ki-check-circle text-green-500"></i>
            </td>
            <td class="px-3 py-2 text-center">
              <i class="ki-filled ki-cross-circle text-red-500"></i>
            </td>
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
  let sourceColumns

  if (form?.invoiceType === '902') {
    sourceColumns = PoPibColumn
  } else if (checkInvoiceDp()) {
    sourceColumns = invoiceDpColumn
  } else {
    sourceColumns = defaultColumn
  }

  const baseColumns = ['Line', ...sourceColumns]

  baseColumns.push('Qty Match', 'Unit Price Match', 'VAT Match', 'WHT Match')

  columns.value = baseColumns
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
