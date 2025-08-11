<template>
  <div class="border rounded-lg p-[24px]">
    <div class="flex flex-row-reverse align-items-center">
      <button class="btn btn-primary" @click="openNego">
        Negotiation
        <i class="ki-duotone ki-arrows-circle"></i>
      </button>
    </div>
    <div v-if="isChanged"
      class="mt-[24px] border border-[#B197FC] bg-[#F7F4FF] flex items-center gap-[16px] px-[14px] py-[16px] rounded-lg">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" class="mr-3">
        <circle cx="12" cy="12" r="12" fill="#B197FC" fill-opacity="0.2"/>
        <path d="M12 8V12" stroke="#B197FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="16" r="1" fill="#B197FC"/>
      </svg>
      <div>
        <p class="text-[15px] font-semibold text-[#000000]">Price Negotiation</p>
        <p class="text-[13px] font-medium text-[#6C4CF1]">
          The admin has sent you a price negotiation. Please check the latest price!
        </p>
      </div>
    </div>
    <div class="nego__table mt-[24px]">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" :key="index"
              class="nego__field-base !border-b-blue-500" :class="{
                'nego__field-base--description': item === 'Material Desc'
              }">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of dataDummy" :key="data.tenderRequestNumber">
            <td>{{ data.tenderRequestNumber }}</td>
            <td>{{ data.type }}</td>
            <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
            <td>{{ data.plant }}</td>
            <td>{{ data.materialGroup }}</td>
            <td>{{ data.itemNo }}</td>
            <td :class="{ 'bg-warning-light': isChanged }">{{ data.tenderPrice }}</td>
            <td>{{ data.material }}</td>
            <td>{{ data.materialDescription }}</td>
            <td>{{ data.quantity }}</td>
            <td>{{ data.buttonPrice }}</td>
            <td>{{ data.uom }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm mt-[24px]">Showing {{ dataDummy.length }} data from {{ dataDummy.length }}</p>
    <NegotiationModal :data="dataDummy" @setNego="saveUpdate" />
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    watch,
    defineAsyncComponent
  } from 'vue'
  import {
    KTModal
  } from '@/metronic/core'

  import type {
    TableNegotiationTypes
  } from '../types/tenderNegotiation'
  import moment from 'moment'

  const NegotiationModal = defineAsyncComponent(() => import('./NegotiationModal.vue'))

  const isChanged = ref < boolean > (false)

  const columns = ref < string[] > ([
    'Tender Request Number',
    'Type',
    'Delivery Date',
    'Plant',
    'Material Group',
    'Item No',
    'Tender Price',
    'Material',
    'Material Desc',
    'Quantity',
    'Button Price',
    'UOM'
  ])

  const dataDummy = ref < TableNegotiationTypes[] > ([{
      tenderRequestNumber: '10012525',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Macro Feltilizer Urea',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '2763746',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Material 123445',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '9384756',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Mate SA 2736',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '0192834',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Real BHG',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    }
  ])

  const backupList = ref < TableNegotiationTypes[] > ([{
      tenderRequestNumber: '10012525',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Macro Feltilizer Urea',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '2763746',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Material 123445',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '9384756',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Mate SA 2736',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    },
    {
      tenderRequestNumber: '0192834',
      type: 'R',
      deliveryDate: '2025-06-14',
      plant: 'CHIP2',
      materialGroup: '4',
      itemNo: '20',
      tenderPrice: 10000,
      material: 'CH-1062',
      materialDescription: 'Real BHG',
      quantity: '1000',
      buttonPrice: '97000',
      uom: 'KG'
    }
  ])

  const openNego = () => {
    const idModal = document.querySelector('#tender_negotiation_modal')
    const modal = KTModal.getInstance(idModal as HTMLElement)
    modal.show()
  }

  const saveUpdate = (data: TableNegotiationTypes[]) => {
    dataDummy.value = data
  }

  watch(
    () => dataDummy.value,
    () => {
      let status = false
      for (const data of dataDummy.value) {
        for (const backup of backupList.value) {
          if (data.tenderPrice !== backup.tenderPrice) status = true
        }
      }
      isChanged.value = status
    }, {
      deep: true,
      immediate: true
    }
  )
</script>
