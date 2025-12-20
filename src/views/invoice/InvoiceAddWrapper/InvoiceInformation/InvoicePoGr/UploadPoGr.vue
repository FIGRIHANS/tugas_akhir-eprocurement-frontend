<template>
  <div class="modal" data-modal="true" id="upload_po_gr_item_modal">
    <div class="modal-content modal-center-y max-w-[70%]">
      <div class="modal-header py-[20px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold p-[0px]">Upload Invoice</h3>
        <button class="btn btn-xs btn-clear btn-light" data-modal-dismiss="true">
          <i class="ki-outline ki-cross"> </i>
        </button>
      </div>
      <div class="modal-body py-[16px] px-[16px] flex flex-col gap-[20px]">
        <div class="upper-section flex flex-col gap-2">
          <div class="upload-section mt-2 flex flex-col gap-2">
            <h3 class="font-bold">Excel Template</h3>
            <button class="btn btn-outline btn-primary w-[20%]">
              <i class="ki-outline ki-exit-down"> </i>Download Excel Template
            </button>
            <div>
              <p class="text-gray-500 text-[12px]">
                Download the Excel template before uploading <br />
                Please fill out the data according the provided format
              </p>
            </div>
          </div>
          <div class="upload-section mt-2 flex flex-col gap-2">
            <h3 class="font-bold">Upload Excel</h3>
            <UiFileUpload
              name="Name"
              :max-size="16000000"
              placeholder="Upload file Here"
              accepted-files=".jpg,.jpeg,.png,.pdf,application/zip"
              class="h-10"
              :disabled="false"
            />
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="card-wrapper">
            <div class="flex gap-4 mt-6">
              <!-- Total -->
              <div class="flex-1 rounded-lg border border-gray-200 bg-white p-4 text-center">
                <p class="text-sm text-gray-500">Total Rows</p>
                <p class="text-2xl font-semibold text-gray-800">1</p>
              </div>

              <!-- Valid -->
              <div class="flex-1 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p class="text-sm text-green-600">Valid Rows</p>
                <p class="text-2xl font-semibold text-green-700">0</p>
              </div>

              <!-- Invalid -->
              <div class="flex-1 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p class="text-sm text-red-600">Invalid Rows</p>
                <p class="text-2xl font-semibold text-red-700">1</p>
              </div>
            </div>
          </div>

          <div class="overflow-x-scroll overflow-y-scroll max-h-[500px] pogr__table">
            <table class="table table-border text-sm" data-datatable-table="true">
              <thead>
                <tr>
                  <th class="pogr__field-base--po-select">
                    <input
                      v-model="selectAll"
                      class="checkbox checkbox-sm"
                      data-datatable-check="true"
                      type="checkbox"
                    />
                    Select All
                  </th>
                  <th
                    v-for="(item, index) in listColumn"
                    :key="index"
                    class="pogr__field-base"
                    :class="{
                      'pogr__field-base--po-item': item.toLowerCase() === 'item text',
                    }"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="listItem.length === 0">
                  <td colspan="11" class="text-center text-[13px]">No Data Available</td>
                </tr>
                <template v-else>
                  <tr v-for="(item, index) in listItem" :key="index" class="pogr__field-items">
                    <td>
                      <input
                        v-model="item.isActive"
                        class="checkbox checkbox-sm"
                        data-datatable-row-check="true"
                        type="checkbox"
                      />
                    </td>
                    <td>{{ item.poNo || '-' }}</td>
                    <td>{{ item.poItem || '-' }}</td>
                    <td>{{ item.grDocumentNo || '-' }}</td>
                    <td>{{ item.grDocumentItem || '-' }}</td>
                    <td>{{ item.grDocumentDate || '-' }}</td>
                    <td class="text-right">
                      {{
                        currency === item.currency
                          ? useFormatIdr(item.itemAmount)
                          : useFormatUsd(item.itemAmount)
                      }}
                    </td>
                    <td>{{ item.quantity || '-' }}</td>
                    <td>{{ item.uom || '-' }}</td>
                    <td>{{ item.materialDescription || '-' }}</td>
                    <td>{{ item.conditionType || '-' }}</td>
                    <td>{{ item.conditionTypeDesc || '-' }}</td>
                    <td>{{ item.qcStatus || '-' }}</td>
                    <td>{{ item.taxCode || '-' }}</td>
                    <td>{{ item.department || '-' }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" @click="cancelModal">Cancel</button>
          <button class="btn btn-primary" @click="goAdd">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { KTModal } from '@/metronic/core'
import { searchDefaultColumn, searchInvoiceDpColumn, searchPoPibColumn } from '@/static/invoicePoGr'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import UiFileUpload from '@/components/ui/atoms/file-upload/UiFileUpload.vue'

const props = defineProps<{
  isInvoiceDp?: string
  isPoPib?: boolean
  currency: string
}>()

const emits = defineEmits(['setItem'])

const invoiceApi = useInvoiceSubmissionStore()
const listColumn = ref<string[]>([])
const selectAll = ref<boolean>(false)

const listItem = computed(() => {
  return invoiceApi.poGrList.map((item) => ({
    ...item,
    isActive: false,
  }))
})

const resetActive = () => {
  selectAll.value = false
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
    immediate: true,
  },
)

watch(
  () => selectAll.value,
  () => {
    const listIsActive = listItem.value.filter((item) => item.isActive)
    for (const item of listItem.value) {
      if (listIsActive.length !== listItem.value.length) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    }
  },
)
</script>
