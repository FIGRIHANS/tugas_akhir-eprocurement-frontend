<template>
  <div>
    <div class="table-item__table">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="table-item__field-base !border-b-blue-500"
              :class="{
                'table-item__field-base--action': index === 0,
                'table-item__field-base--description': item === 'Material Desc'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of items" :key="data.id">
            <td>
              <input v-model="data.isSelected" class="checkbox" type="checkbox"/>
            </td>
            <td>{{ data.purchaseRequisitionNo }}</td>
            <td>{{ data.type }}</td>
            <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
            <td>{{ data.plant }}</td>
            <td>{{ data.materialGroup }}</td>
            <td>{{ data.itemNo }}</td>
            <td>{{ data.material }}</td>
            <td>{{ data.materialDescription }}</td>
            <td>{{ data.quantity }}</td>
            <td>{{ data.buttomPrice }}</td>
            <td>{{ data.uom }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-[24px] text-sm">
      Tampilkan {{ items.length }} data dari total data {{ items.length }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import moment from 'moment'
import type { TableItemTypes } from '../../types/purchaseRequisitionList'

const columns = reactive<string[]>([
  '',
  'PR NO',
  'Type',
  'Delivery Date',
  'Plant',
  'Material Group',
  'Item No',
  'Material',
  'Material Desc',
  'Quantity',
  'Buttom Price',
  'UOM'
])

const items = reactive<TableItemTypes[]>([
  {
    id: '1',
    purchaseRequisitionNo: '10012525',
    type: 'R',
    deliveryDate: '2025-10-29',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    material: 'CH-1062',
    materialDescription: 'Macro Feltilizer Urea',
    quantity: '1000',
    buttomPrice: '97000',
    uom: 'KG',
    isSelected: false
  },
  {
    id: '2',
    purchaseRequisitionNo: '10012525',
    type: 'R',
    deliveryDate: '2025-10-29',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    material: 'CH-1062',
    materialDescription: 'Macro Feltilizer Urea',
    quantity: '1000',
    buttomPrice: '97000',
    uom: 'KG',
    isSelected: false
  },
  {
    id: '3',
    purchaseRequisitionNo: '10012525',
    type: 'R',
    deliveryDate: '2025-10-29',
    plant: 'CHIP2',
    materialGroup: '4',
    itemNo: '20',
    material: 'CH-1062',
    materialDescription: 'Macro Feltilizer Urea',
    quantity: '1000',
    buttomPrice: '97000',
    uom: 'KG',
    isSelected: false
  }
])
</script>

<style lang="scss" scoped>
@use '../../styles/purchaseRequisitionList.scss';
</style>
