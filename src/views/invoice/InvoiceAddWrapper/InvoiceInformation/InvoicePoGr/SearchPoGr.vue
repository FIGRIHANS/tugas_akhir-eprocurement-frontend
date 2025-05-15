<template>
  <div class="modal" data-modal="true" id="add_po_gr_item_modal">
    <div class="modal-content modal-center-y max-w-[1000px]">
      <div class="modal-header py-[20px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold p-[0px]">
          Add PO & GR Item
        </h3>
        <button class="btn btn-xs btn-clear btn-light" data-modal-dismiss="true">
          <i class="ki-outline ki-cross">
          </i>
        </button>
      </div>
      <div class="modal-body py-[16px] px-[16px] flex flex-col gap-[20px]">
        <div class="flex items-center justify-end gap-[8px]">
          <div class="relative">
            <label class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px]">
              Search By PO Number
            </label>
            <div class="input">
              <input v-model="search" placeholder=""/>
              <i class="ki-outline ki-magnifier"></i>
            </div>
          </div>
          <button class="btn btn-outline btn-primary">
            <i class="ki-filled ki-magnifier"></i>
            Search
          </button>
        </div>
        <div>
          <table class="table table-border text-sm" data-datatable-table="true">
            <thead>
              <tr>
                <th class="w-[120px]">
                  <input class="checkbox checkbox-sm" data-datatable-check="true" type="checkbox"/>
                  Select All
                </th>
                <th v-for="(item, index) in listColumn" :key="index">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in listItem" :key="index">
                <td>
                  <input v-model="item.active" class="checkbox checkbox-sm" data-datatable-row-check="true" type="checkbox"/>
                </td>
                <td>{{ item.poNumber }}</td>
                <td v-if="!props.isInvoiceDp && !props.isPoPib">{{ item.grNumber }}</td>
                <td v-if="!props.isInvoiceDp">{{ item.qty }}</td>
                <td v-if="!props.isInvoiceDp">{{ item.unit }}</td>
                <td v-if="!props.isInvoiceDp">{{ item.item }}</td>
                <td v-if="!props.isInvoiceDp">{{ item.itemAmount }}</td>
                <td v-if="props.isInvoiceDp">{{ item.amountInvoice }}</td>
                <td v-if="props.isInvoiceDp">{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" @click="cancelModal">
            Cancel
          </button>
          <button class="btn btn-primary">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { KTModal } from '@/metronic/core'
import { searchDefaultColumn, searchInvoiceDpColumn, searchPoPibColumn } from '@/static/invoicePoGr'

const props = defineProps<{
  isInvoiceDp?: boolean
  isPoPib?: boolean
}>()

const search = ref<string>('')
const listColumn = ref<string[]>([])

const listItem = ref([
  {
    id: 1,
    active: false,
    poNumber: '1100000001',
    grNumber: '1900000001',
    qty: 2,
    unit: 'Pcs',
    item: 'BOTOL ESK CG 50ML',
    itemAmount: '2.000.000',
    amountInvoice: '2.000.000',
    description: 'abc'
  },
  {
    id: 2,
    active: false,
    poNumber: '1100000001',
    grNumber: '1900000001',
    qty: 2,
    unit: 'Pcs',
    item: 'BOTOL ESK CG 50ML',
    itemAmount: '2.000.000',
    amountInvoice: '2.000.000',
    description: 'abc'
  },
  {
    id: 3,
    active: false,
    poNumber: '1100000001',
    grNumber: '1900000001',
    qty: 2,
    unit: 'Pcs',
    item: 'BOTOL ESK CG 50ML',
    itemAmount: '2.000.000',
    amountInvoice: '2.000.000',
    description: 'abc'
  }
])

const cancelModal = () => {
  const idModal = document.querySelector('#add_po_gr_item_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}

watch(
  () => [props.isInvoiceDp, props.isPoPib],
  () => {
    if (props.isInvoiceDp) listColumn.value = [...searchInvoiceDpColumn]
    else if (props.isPoPib) listColumn.value = [...searchPoPibColumn]
    else listColumn.value = [...searchDefaultColumn]
  },
  {
    immediate: true
  }
)
</script>