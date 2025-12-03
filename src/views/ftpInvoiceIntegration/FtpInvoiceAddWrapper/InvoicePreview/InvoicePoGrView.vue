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
                'invoice__field-base--status':
                  item.toLowerCase().includes('status') || item.toLowerCase().includes('price'),
              }"
              class="invoice__field-base"
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

            <!-- FTP-specific verification status columns -->
            <td>
              <span class="badge" :class="getStatusBadgeClass(item.fpStatus)">
                {{ item.fpStatus || 'Not Verified' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(item.vatStatus)">
                {{ item.vatStatus || 'Error' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(item.whtStatus)">
                {{ item.whtStatus || 'Not Verified' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(item.poPrice)">
                {{ item.poPrice || 'Not Verified' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../../invoice/InvoiceAddWrapper/types/invoiceAddWrapper'
import { ftpDefaultColumn, ftpInvoiceDpColumn, ftpPoPibColumn } from '@/static/ftpInvoicePoGr'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import moment from 'moment'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import type { itemsPoGrType } from '../../../invoice/InvoiceAddWrapper/types/invoicePoGr'

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
  if (form?.invoiceType === '902') columns.value = ['Line', ...ftpPoPibColumn]
  else if (checkInvoiceDp()) columns.value = ['Line', ...ftpInvoiceDpColumn]
  else columns.value = ['Line', ...ftpDefaultColumn]
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

// Helper function to get badge class based on status
const getStatusBadgeClass = (status: string) => {
  if (status === 'Verified') return 'badge-success'
  if (status === 'Not Verified') return 'badge-warning'
  if (status === 'Error') return 'badge-danger'
  return 'badge-secondary'
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

<style lang="scss" scoped>
.invoice__field-base--status {
  min-width: 150px;
}
</style>
