<template>
  <div class="modal" data-modal="true" id="add_vendor_tender_modal">
    <div class="modal-content modal-center-y max-w-[1000px]">
      <div class="modal-header py-[20px] px-[16px]">
        <h3 class="modal-title text-lg font-semibold p-[0px]">Select Vendor</h3>
        <div class="input w-[250px]">
          <i class="ki-filled ki-magnifier"></i>
          <input v-model="search" placeholder="Search" type="text" />
        </div>
      </div>
      <div class="modal-body py-[16px] px-[16px] flex flex-col gap-[20px]">
        <div class="vendor-list__table">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in listColumn"
                  :key="index"
                  class="vendor-list__field-base !border-b-blue-500"
                  :class="{
                    'vendor-list__field-base--action': index === 0,
                    'vendor-list__field-base--name': item === 'Vendor Name',
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
                <tr v-for="(item, index) in listItem" :key="index" class="vendor-list__field-items">
                  <td>
                    <input v-model="item.isSelected" class="checkbox checkbox-sm" type="checkbox" />
                  </td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-primary">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.vendorCode }}</td>
                  <td>
                    <span class="badge badge-pill badge-outline" :class="colorRank(item.rank)">
                      {{ item.rank }}
                    </span>
                  </td>
                  <td>{{ item.vendorName }}</td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-warning">
                      {{ item.totalScore }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-primary">
                      {{ item.productQuality }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-success">
                      {{ item.leadTimeSupply }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-primary">
                      {{ item.afterSalesWarranty }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-pill badge-outline badge-primary">
                      {{ item.orderAbsorption }}
                    </span>
                  </td>
                  <td>{{ item.totalPo }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-if="listItem.length !== 0" class="mt-[24px] text-sm">
          Tampilkan {{ listItem.length }} data dari total data {{ listItem.length }}
        </div>
        <div class="flex items-center justify-end gap-[8px]">
          <button class="btn btn-outline btn-primary" @click="cancelModal">Cancel</button>
          <button class="btn btn-primary" @click="goAdd">Add Vendor</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { KTModal } from '@/metronic/core'
import type { TableItemTypes } from '../../types/vendorList'

const emits = defineEmits(['setItem'])

const search = ref<string>('')

const listColumn = ref<string[]>([
  '',
  'Status',
  'Vendor Code',
  'Rank',
  'Vendor Name',
  'Total Score',
  'Product Quality',
  'Lead Time Supply',
  'After Sales Warranty',
  'Order Absorption',
  'Total PO',
])

const listItem = ref<TableItemTypes[]>([
  {
    id: '2',
    status: 'Open',
    vendorCode: '1060',
    rank: '3',
    vendorName: 'PT Somper GmbH Tbk',
    totalScore: '50',
    productQuality: '79',
    leadTimeSupply: '35',
    afterSalesWarranty: '75',
    orderAbsorption: '86',
    totalPo: '90000',
    yearlySpanding: '25,000',
    currency: 'USD',
    existingContract: '9',
    isSelected: false,
  },
  {
    id: '3',
    status: 'Open',
    vendorCode: '1070',
    rank: '2',
    vendorName: 'PT Kreuzschmid Kgaa Tbk',
    totalScore: '56',
    productQuality: '20',
    leadTimeSupply: '60',
    afterSalesWarranty: '50',
    orderAbsorption: '50',
    totalPo: '23',
    yearlySpanding: '80,000',
    currency: 'USD',
    existingContract: '5',
    isSelected: false,
  },
])

const colorRank = (rank: string) => {
  const lib = {
    '1': 'badge-success',
    '2': 'badge-primary',
    '3': 'badge-warning',
    '4': 'badge-danger',
  } as { [key: string]: string }
  return lib[rank]
}

const resetActive = () => {
  for (const item of listItem.value) {
    item.isSelected = false
  }
}

const hideModal = () => {
  resetActive()
  const idModal = document.querySelector('#add_vendor_tender_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}

const cancelModal = () => {
  hideModal()
}

const goAdd = () => {
  const filterActive = listItem.value.filter((item) => item.isSelected)
  emits('setItem', filterActive)
  hideModal()
}
</script>
