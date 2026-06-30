<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
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
              <td :colspan="columns.length" class="text-center text-[13px]">No Data Available</td>
            </tr>
            <tr v-for="(item, index) in pogrLsit" v-else :key="index" class="invoice__field-items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">
              {{
                item.grDocumentDate
                  ? moment(item.grDocumentDate).isValid()
                    ? moment(item.grDocumentDate).format('YYYY/MM/DD')
                    : item.grDocumentDate
                  : '-'
              }}
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { defaultColumn, invoiceDpColumn, poCCColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import moment from 'moment'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { itemsPoGrType } from '../../types/invoicePoGr'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
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

const checkInvoiceDp = () => {
  return form?.invoiceDp === '9012'
}

const checkPoPib = () => {
  return form?.invoiceType === '902'
}

const setColumn = () => {
  if (form?.invoiceType === '902') columns.value = ['Line', ...PoPibColumn]
  else if (form?.invoiceType === '903') columns.value = ['Line', ...poCCColumn]
  else if (checkInvoiceDp()) columns.value = ['Line', ...invoiceDpColumn]
  else columns.value = ['Line', ...defaultColumn]
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
  () => form,
  () => {
    setPoGrList()
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(async () => {
  setColumn()
  if (form?.companyCode) {
    await invoiceMasterApi.getCostCenter(form.companyCode)
  }
})
</script>
