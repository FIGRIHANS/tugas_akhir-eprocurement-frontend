<template>
  <div>
    <div class="flex align-items-center justify-between">
      <div class="input w-[250px] mb-[24px]">
        <i class="ki-filled ki-magnifier"></i>
        <input v-model="search" placeholder="Cari data" type="text" />
      </div>
      <button class="btn btn-primary" @click="openAddSourcingRequisition">
        Add Sourcing Requesition
      </button>
    </div>
    <div class="table-item__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="table-item__field-base !border-b-blue-500 !bg-blue-100 !text-blue-500"
              :class="{
                'table-item__field-base--action': index === 0,
                'table-item__field-base--description': item === 'Material Desc',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of dummyData" :key="data.id">
            <td>
              <input v-model="data.isSelected" class="checkbox" type="checkbox" />
            </td>
            <td>{{ data.materialNo }}</td>
            <td>{{ data.materialDesc }}</td>
            <td>{{ data.quantity }}</td>
            <td>{{ data.uom }}</td>
            <td>{{ useFormatUsd(data.totalAmountUsd) }}</td>
            <td>{{ useFormatUsd(data.pricePerUnitUsd) }}</td>
            <td>{{ data.currency }}</td>
            <td>{{ useFormatIdr(data.totalAmountIDR) }}</td>
            <td>{{ useFormatIdr(data.pricePerUnitIDR) }}</td>
            <td>{{ data.localCurrency }}</td>
            <td>{{ data.plant }}</td>
            <td>{{ data.vendorMaterialNo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-[24px] text-sm">
      Tampilkan {{ dummyData.length }} data dari total data
      {{ dummyData.length }}
    </div>
    <AddSourcingRequisitionModal @setData="setData" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { MaterialServiceItem } from '../types/materialServices'

const AddSourcingRequisitionModal = defineAsyncComponent(
  () => import('./TableItem/AddSourcingRequisitionModal.vue'),
)

const search = ref<string>('')

const columns = reactive<string[]>([
  '',
  'Material No',
  'Material Desc',
  'Qty',
  'UOM',
  'Total Amount',
  'Price per Unit',
  'Currency',
  'Total Amount',
  'Price per Unit',
  'Local Currency',
  'Plant',
  'Vendor Material No',
])

const dummyData = ref<MaterialServiceItem[]>([
  {
    id: 1,
    materialNo: 'AURM4',
    materialDesc: 'Aurum Product 4',
    quantity: 30,
    uom: 'Oz t',
    totalAmountUsd: 100861,
    pricePerUnitUsd: 3362,
    currency: 'USD',
    totalAmountIDR: 1613776000,
    pricePerUnitIDR: 53792533,
    localCurrency: 'IDR',
    plant: 'CH 2',
    vendorMaterialNo: 'AURM5X1',
    isSelected: false,
  },
  {
    id: 2,
    materialNo: 'AURM5',
    materialDesc: 'Aurum Product 5',
    quantity: 30,
    uom: 'Oz t',
    totalAmountUsd: 100861,
    pricePerUnitUsd: 3362,
    currency: 'USD',
    totalAmountIDR: 1613776000,
    pricePerUnitIDR: 53792533,
    localCurrency: 'IDR',
    plant: 'CH 2',
    vendorMaterialNo: 'AURM5X2',
    isSelected: false,
  },
  {
    id: 3,
    materialNo: 'AURM6',
    materialDesc: 'Aurum Product 6',
    quantity: 30,
    uom: 'Oz t',
    totalAmountUsd: 100861,
    pricePerUnitUsd: 3362,
    currency: 'USD',
    totalAmountIDR: 1613776000,
    pricePerUnitIDR: 53792533,
    localCurrency: 'IDR',
    plant: 'CH 2',
    vendorMaterialNo: 'AURM5X3',
    isSelected: false,
  },
])

const openAddSourcingRequisition = () => {
  const idModal = document.querySelector('#tender_add_sourcing_requisition_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const setData = (data: unknown[]) => {
  console.log(data)
}
</script>

<style lang="scss" scoped>
@use '../styles/purchaseRequisitionList.scss';
</style>
