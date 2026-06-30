<template>
  <div v-if="form" class="flex flex-col gap-6">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="invoice__table rounded-lg border border-gray-200">
      <table class="table table-xs">
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
                'invoice__field-base--department': item.toLowerCase() === 'department',
              }"
              class="invoice__field-base !border-b-teal-500 !bg-teal-100 !text-teal-500"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pogrLsit.length === 0">
            <td :colspan="columns.length" class="text-center text-[13px] py-4 text-gray-500">
              No Data Available
            </td>
          </tr>
          <tr v-for="(item, index) in pogrLsit" :key="index" class="border-t hover:bg-gray-50">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">
              {{ formatGrDocumentDate(item.grDocumentDate) }}
            </td>
            <td v-if="!checkInvoiceDp()">{{ item.deliveryOrderNo || '-' }}</td>
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
            <td v-if="!checkInvoiceDp() && form?.invoiceType !== '903'">{{ item.qcStatus || '-' }}</td>
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
            <td class="invoice__field-base--department">{{ getCostCenterName(item.department) }}</td>

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
import { ref, computed, inject, watch, onMounted, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultColumn, invoiceDpColumn, poCCColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import moment from 'moment'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { itemsPoGrType } from '../../types/invoicePoGr'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const poGrAutoFetchTick = inject<Ref<number>>('poGrAutoFetchTick', ref(0))
const columns = ref<string[]>([])
const pogrLsit = ref<itemsPoGrType[]>([])

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)
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

const formatGrDocumentDate = (value?: string | null) => {
  if (!value?.trim()) return '-'
  const parsed = moment(value)
  return parsed.isValid() ? parsed.format('YYYY/MM/DD') : '-'
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
  } else if (form?.invoiceType === '903') {
    sourceColumns = poCCColumn
  } else if (checkInvoiceDp()) {
    sourceColumns = invoiceDpColumn
  } else {
    sourceColumns = defaultColumn
  }

  const baseColumns = ['Line', ...sourceColumns]

  baseColumns.push('Qty Match', 'Unit Price Match', 'VAT Match', 'WHT Match')

  columns.value = baseColumns
}

const getCostCenterName = (costCenter: string) => {
  if (!costCenter?.trim()) return '-'
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return costCenter
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
  () => form?.invoicePoGr,
  () => {
    setPoGrList()
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => poGrAutoFetchTick.value,
  () => {
    void setPoGrList()
  },
)

onMounted(async () => {
  setColumn()
  if (form?.companyCode) {
    await invoiceMasterApi.getCostCenter(form.companyCode)
  }
})
</script>
