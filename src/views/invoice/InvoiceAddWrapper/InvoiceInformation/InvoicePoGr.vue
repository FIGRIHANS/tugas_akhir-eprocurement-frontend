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
          <tr v-if="form.invoicePoGr.length === 0">
            <td colspan="11" class="text-center text-[13px]">No Data Available</td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
              <td class="flex items-center justify-around gap-[8px]">
                <button v-if="form.status === 0 || checkInvoiceDp()" class="btn btn-icon btn-primary" @click="item.isEdit = !item.isEdit">
                  <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                  <i v-else class="ki-duotone ki-check-circle"></i>
                </button>
                <button v-if="form.status === 0" class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                  <i class="ki-duotone ki-cross-circle"></i>
                </button>
              </td>
              <td>{{ item.poNo }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentNo }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentItem }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.grDocumentDate }}</td>
              <td>{{ item.taxCode }}</td>
              <td v-if="!checkInvoiceDp()">{{ useFormatIdr(item.itemAmount) }}</td>
              <td v-if="!checkInvoiceDp()">
                <span v-if="!item.isEdit">{{ item.quantity }}</span>
                <input v-else v-model="item.quantity" class="input" placeholder="" type="text"/>
              </td>
              <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.materialDescription }}</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
              <!-- <td v-if="checkInvoiceDp()">{{ item.amountInvoice }}</td> -->
              <!-- <td v-if="checkInvoiceDp()">{{ item.vatAmount }}</td> -->
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.department }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <SearchPoGr :is-invoice-dp="form?.invoiceDp" :is-po-pib="form?.invoiceType === 'pib'" @setItem="setItemPoGr" />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { KTModal } from '@/metronic/core'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import SearchPoGr from './InvoicePoGr/SearchPoGr.vue'
import type { PoGrSearchTypes, itemsPoGrType } from '../../types/invoicePoGr'
import { useFormatIdr } from '@/composables/currency'

const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const openAddItem = () => {
  const idModal = document.querySelector('#add_po_gr_item_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const checkInvoiceDp = () => {
  return form?.invoiceDp === 'IDP'
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
  else if (form?.invoiceDp === 'IDP') columns.value = ['Action', ...invoiceDpColumn]
  else columns.value = ['Action', ...defaultColumn]
}

const setItemPoGr = (items: PoGrSearchTypes[]) => {
  for (const item of items) {
    const data = {
      poNo: item.poNo,
      poItem: item.poItem,
      grDocumentNo: item.grDocumentNo,
      grDocumentItem: item.grDocumentItem,
      grDocumentDate: item.grDocumentDate,
      taxCode: item.taxCode,
      itemAmount: item.itemAmount,
      quantity: item.quantity,
      uom: item.uom,
      material: item.material,
      materialDescription: item.materialDescription,
      currency: item.currency,
      conditionType: item.conditionType,
      postingDate: item.postingDate,
      enteredOn: item.enteredOn,
      purchasingOrg: item.purchasingOrg,
      department: item.department,
      isEdit: false
    } as itemsPoGrType

    form?.invoicePoGr.push(data)
  }
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
