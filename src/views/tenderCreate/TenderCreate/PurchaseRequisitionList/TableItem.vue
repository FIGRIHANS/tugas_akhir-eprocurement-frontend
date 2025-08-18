<template>
  <div>
    <div class="flex align-items-center justify-between">
      <div class="input w-[250px] mb-[24px]">
        <i class="ki-filled ki-magnifier"></i>
        <input v-model="search" placeholder="Cari data" type="text"/>
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
          <tr v-for="data of form?.requisitionList" :key="data.id">
            <td>
              <input v-model="data.isSelected" class="checkbox" type="checkbox"/>
            </td>
            <td>{{ data.purchaseRequisitionNo }}</td>
            <td>{{ data.sourcingType }}</td>
            <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
            <td>{{ data.plant }}</td>
            <td>{{ data.materialGroup }}</td>
            <td>{{ data.itemNo }}</td>
            <td>{{ data.material }}</td>
            <td>{{ data.materialDescription }}</td>
            <td>{{ useFormatIdr(data.quantity) }}</td>
            <td>{{ data.uom }}</td>
            <td>{{ data.currency === 'IDR' ? useFormatIdr(data.bottomPrice) : useFormatUsd(data.bottomPrice) }}</td>
            <td>{{ data.currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-[24px] text-sm">
      Tampilkan {{ form?.requisitionList.length }} data dari total data {{ form?.requisitionList.length }}
    </div>
    <AddSourcingRequisitionModal @setData="setData" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import moment from 'moment'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { FormTypes } from '../../types/tenderCreate'
import type { TableItemTypes } from '../../types/purchaseRequisitionList'
import type { SourcingRequestitionTypes } from '../../types/purchaseRequisitionList'

const AddSourcingRequisitionModal = defineAsyncComponent(() => import('./TableItem/AddSourcingRequisitionModal.vue'))

const form = inject<FormTypes>('form')
const search = ref<string>('')

const columns = reactive<string[]>([
  '',
  'PR NO',
  'Sourcing Type',
  'Delivery Date',
  'Plant',
  'Material Group',
  'Item No',
  'Material',
  'Material Desc',
  'Quantity',
  'UOM',
  'Bottom Price (LBMA)',
  'Currency'
])

const openAddSourcingRequisition = () => {
  const idModal = document.querySelector('#tender_add_sourcing_requisition_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const setData = (dataVendor: SourcingRequestitionTypes[]) => {
  if (!form) return
  for (const item of dataVendor) {
    const data = {
      id: (form.requisitionList.length + 1).toString(),
      purchaseRequisitionNo: item.purchaseRequisitionNo,
      sourcingType: item.sourcingType,
      deliveryDate: item.deliveryDate,
      plant: item.plant,
      materialGroup: item.materialGroup,
      itemNo: item.itemNo,
      material: item.material,
      materialDescription: item.materialDescription,
      quantity: item.quantity,
      bottomPrice: item.bottomPrice,
      uom: item.uom,
      currency: item.currency,
      isSelected: false
    } as TableItemTypes

    form.requisitionList.push(data)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/purchaseRequisitionList.scss';
</style>
