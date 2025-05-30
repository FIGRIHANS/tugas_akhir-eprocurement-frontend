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
        <div class="overflow-x-auto pogr__table">
          <table class="table table-border text-sm" data-datatable-table="true">
            <thead>
              <tr>
                <th class="pogr__field-base--po-select">
                  <input v-model="selectAll" class="checkbox checkbox-sm" data-datatable-check="true" type="checkbox"/>
                  Select All
                </th>
                <th
                  v-for="(item, index) in listColumn"
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
              <tr v-for="(item, index) in listPoGrItem" :key="index" class="pogr__field-items">
                <td>
                  <input v-model="item.isActive" class="checkbox checkbox-sm" data-datatable-row-check="true" type="checkbox"/>
                </td>
                <td>{{ item.poNo }}</td>
                <td>{{ item.poItem }}</td>
                <td>{{ item.grDocumentNo }}</td>
                <td>{{ item.grDocumentItem }}</td>
                <td>{{ item.grDocumentDate }}</td>
                <td class="text-right">{{ useFormatIdr(item.itemAmount) }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.uom }}</td>
                <td>{{ item.materialDescription }}</td>
                <td>{{ item.conditionType }}</td>
                <td>{{ item.taxCode }}</td>
                <td>{{ item.department }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" @click="cancelModal">
            Cancel
          </button>
          <button class="btn btn-primary" @click="goAdd">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { KTModal } from '@/metronic/core'
import { searchDefaultColumn, searchInvoiceDpColumn, searchPoPibColumn } from '@/static/invoicePoGr'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import type { PoGrSearchTypes } from '../../../types/invoicePoGr'
import { useFormatIdr } from '@/composables/currency'

const props = defineProps<{
  isInvoiceDp?: string
  isPoPib?: boolean
  search: string
}>()

const emits = defineEmits(['setItem'])

const invoiceApi = useInvoiceSubmissionStore()
const listColumn = ref<string[]>([])
const listPoGrItem = ref<PoGrSearchTypes[]>([])
const selectAll = ref<boolean>(false)

const listItem = computed(() => {
  return invoiceApi.poGrList.map((item) => ({
    ...item,
    isActive: false
  }))
})

const resetActive = () => {
  for (const item of listPoGrItem.value) {
    item.isActive = false
  }
  for (const item of listItem.value) {
    item.isActive = false
  }
}

const hideModal = () => {
  resetActive()
  const idModal = document.querySelector('#add_po_gr_item_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}

const cancelModal = () => {
  hideModal()
}

const goAdd = () => {
  const filterActive = listItem.value.filter((item) => item.isActive)
  emits('setItem', filterActive)
  hideModal()
}

watch(
  () => [props.isInvoiceDp, props.isPoPib],
  () => {
    if (props.isInvoiceDp === 'IDP') listColumn.value = [...searchInvoiceDpColumn]
    else if (props.isPoPib) listColumn.value = [...searchPoPibColumn]
    else listColumn.value = [...searchDefaultColumn]
  },
  {
    immediate: true
  }
)

watch(
  () => props.search,
  () => {
    listPoGrItem.value = listItem.value.filter((item) => item.poNo.toLowerCase() === props.search.toLowerCase())
  },
  {
    immediate: true
  }
)

watch(
  () => selectAll.value,
  () => {
    for (const item of listPoGrItem.value) {
      item.isActive = !item.isActive
    }
  }
)

onMounted(() => {
  invoiceApi.getPoGr().then(() => {
    listPoGrItem.value = listItem.value
  })
})
</script>