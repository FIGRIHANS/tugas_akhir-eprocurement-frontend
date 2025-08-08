<template>
  <div v-if="form" class="border rounded-md p-[24px]">
    <div class="flex align-items-center justify-between mb-[24px]">
      <div class="input w-[250px]">
        <i class="ki-filled ki-magnifier"></i>
        <input v-model="search" placeholder="Cari data" type="text"/>
      </div>
      <div>
        <button class="btn btn-primary" @click="showAddVendor">
          Add vendor
          <i class="ki-duotone ki-questionnaire-tablet"></i>
        </button>
      </div>
    </div>
    <div v-if="form.vendorList.length === 0" class="text-sm h-[120px] text-center text-gray-800">
      <p>
        You must add the vendor first.
      </p>
      <p>
        The vendor will be displayed here.
      </p>
    </div>
    <div v-else class="vendor-list__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="vendor-list__field-base !border-b-blue-500"
              :class="{
                'vendor-list__field-base--action': index === 0,
                'vendor-list__field-base--name': item === 'Vendor Name'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in form.vendorList" :key="data.id">
            <td>
              <button class="btn btn-icon btn-outline btn-danger w-[32px] h-[32px]" @click="deleteItem(index)">
                <i class="ki-duotone ki-trash !text-lg"></i>
              </button>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.status }}
              </span>
            </td>
            <td>{{ data.vendorCode }}</td>
            <td>
              <span class="badge badge-pill badge-outline" :class="colorRank(data.rank)">
                {{ data.rank }}
              </span>
            </td>
            <td>{{ data.vendorName }}</td>
            <td>
              <span class="badge badge-pill badge-outline badge-warning">
                {{ data.totalScore }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.productQuality }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-success">
                {{ data.leadTimeSupply }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.afterSalesWarranty }}
              </span>
            </td>
            <td>
              <span class="badge badge-pill badge-outline badge-primary">
                {{ data.orderAbsorption }}
              </span>
            </td>
            <td>{{ data.totalPo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="form.vendorList.length !== 0" class="mt-[24px] text-sm">
      Tampilkan {{ form.vendorList.length }} data dari total data {{ form.vendorList.length }}
    </div>
    <AddVendorModal @setItem="setItemVendor" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import type { FormTypes } from '../types/tenderCreate'
import type { TableItemTypes } from '../types/vendorList'

const AddVendorModal = defineAsyncComponent(() => import('./VendorList/AddVendor.vue'))

const form = inject<FormTypes>('form')
const search = ref<string>('')

const columns = reactive<string[]>([
  'Action',
  'Status',
  'Vendor Code',
  'Rank',
  'Vendor Name',
  'Total Score',
  'Product Quality',
  'Lead Time Supply',
  'After Sales Warranty',
  'Order Absorption',
  'Total PO'
])

const colorRank = (rank: string) => {
  const lib = {
    '1': 'badge-success',
    '2': 'badge-primary',
    '3': 'badge-warning',
    '4': 'badge-danger'
  } as { [key: string]: string }
  return lib[rank]
}

const deleteItem = (index: number) => {
  form?.vendorList.splice(index, 1)
}

const showAddVendor = () => {
  const idModal = document.querySelector('#add_vendor_tender_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const setItemVendor = (items: TableItemTypes[]) => {
  for (const data of items) {
    form?.vendorList.push({ ...data, isSelected: false })
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/vendorList.scss';
</style>
