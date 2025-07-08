<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <div class="flex items-center gap-[24px]">
      <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
      <input v-if="isNeedCheck" v-model="form.invoicePoGrCheck" class="checkbox" type="checkbox"/>
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
                'po__column--line': item.toLowerCase() === 'Line'.toLowerCase()
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="po__items">
            <td>{{ index + 1 }}</td>
            <td>{{ item.poNo || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">
              {{ moment(item.grDocumentDate).format('DD MMMM YYYY') || '-' }}
            </td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.itemAmount) || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.quantity) || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.uom || '-' }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText || '-' }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType || '-' }}</td>
            <td>{{ item.conditionTypeDesc || '-' }}</td>
            <td>{{ item.qcStatus || '-' }}</td>
            <td>{{ item.taxCode || '-' }}</td>
            <td>{{ item.whtType || '-' }}</td>
            <td>{{ item.whtCode || '-' }}</td>
            <td>{{ useFormatIdr(item.whtBaseAmount) || '-' }}</td>
            <td>{{ useFormatIdr(item.whtAmount) || '-' }}</td>
            <td>{{ item.department || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, onMounted } from 'vue'
import type { formTypes } from '../types/invoiceDetail'
import { defaultColumn } from '@/static/invoicePoGr'
import moment from 'moment'
import { useFormatIdr } from '@/composables/currency'

defineProps<{
  isNeedCheck: boolean
}>()

const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const checkInvoiceDp = () => {
  return form?.invoiceDPCode === 9011
}

const checkPoPib = () => {
  return form?.invoiceTypeCode === 902
}

const setColumn = () => {
  // if (false) columns.value = ['Line', ...PoPibColumn]
  // else if (form?.invoiceDPCode !== 9011) columns.value = ['Line', ...invoiceDpColumn]
  // else columns.value = ['Line', ...defaultColumn]
  columns.value = ['Line', ...defaultColumn]
}

watch(
  () => [form?.invoiceDPCode, form?.invoiceTypeCode],
  () => {
    setColumn()
  },
  {
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
