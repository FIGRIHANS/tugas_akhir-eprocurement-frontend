<template>
  <div id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice PO & GR Item</p>
    <button v-if="form?.status === 0" class="btn btn-outline btn-primary w-fit" @click="openAddItem">
      <i class="ki-filled ki-magnifier"></i>
      Search
    </button>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
              :class="{
                'pogr__field-base--po-item': item.toLowerCase() === 'item text'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button v-if="form.status === 0" class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>{{ item.poNumber }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentNo }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentDate }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.taxCode }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemAmount }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.unit }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
            <td v-if="checkInvoiceDp()">{{ item.amountInvoice }}</td>
            <td v-if="checkInvoiceDp()">{{ item.vatAmount }}</td>
            <td>{{ item.whtType }}</td>
            <td>{{ item.whtCode }}</td>
            <td>{{ item.whtBaseAmount }}</td>
            <td>{{ item.category }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.totalNetAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <SearchPoGr :is-invoice-dp="form?.invoiceDp" :is-po-pib="form?.invoiceType === 'pib'" />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { KTModal } from '@/metronic/core'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import SearchPoGr from './InvoicePoGr/SearchPoGr.vue'

const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const openAddItem = () => {
  const idModal = document.querySelector('#add_po_gr_item_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkInvoiceDp = () => {
  return form?.invoiceDp
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

const deleteItem = (index: number) => {
  if (form) {
    form.invoicePoGr.splice(index, 1)
  }
}

const setColumn = () => {
  if (form?.invoiceType === 'pib') columns.value = ['Action', ...PoPibColumn]
  else if (form?.invoiceDp) columns.value = ['Action', ...invoiceDpColumn]
  else columns.value = ['Action', ...defaultColumn]
}

watch(
  () => [form?.invoiceDp, form?.invoiceType],
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
@use '../../styles/invoice-po-gr.scss';
</style>
