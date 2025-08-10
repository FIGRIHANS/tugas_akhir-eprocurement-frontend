<template>
  <div class="border rounded-lg p-[24px]">
    <div class="flex flex-row-reverse align-items-center">
      <button class="btn btn-primary" @click="openNego">
        Negotiation
        <i class="ki-duotone ki-arrows-circle"></i>
      </button>
    </div>
    <div
      v-if="isChanged"
      class="mt-[24px] border border-warning border-dashed bg-warning-light flex align-items-center gap-[16px] px-[14px] py-[16px] rounded-lg"
    >
      <i class="ki-duotone ki-information-1 text-[34px] text-warning"></i>
      <div>
        <p class="text-[15px] font-semibold">Price Negotiation</p>
        <p class="text-[13px] font-medium text-gray-600">
          You have successfully changed the price, please continue to send the price negotiation to
          the vendor.
        </p>
      </div>
    </div>
    <div class="nego__table mt-[24px]">
      <table class="table text-gray-700 font-medium text-sm">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="nego__field-base !border-b-blue-500"
              :class="{
                'nego__field-base--description': item === 'Material Desc',
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data of dummyHistory" :key="data.historyId">
            <td>{{ data.iteration }}</td>
            <td>
              <span
                class="badge badge-pill badge-outline"
                :class="{
                  'badge-success': data.status === 'Closed',
                  'badge-danger': data.status === 'Open',
                }"
              >
                {{ data.status }}
              </span>
            </td>
            <td>{{ data.type }}</td>
            <td>{{ data.expectedDisc }}</td>
            <td>{{ data.vendorPurposedDisc }}</td>
            <td>{{ data.totalAmount }}</td>
            <td>{{ data.totalCurrency }}</td>
            <td>{{ data.discAmount }}</td>
            <td>{{ data.discCurrency }}</td>
            <td>
              <span
                class="badge badge-pill badge-outline"
                :class="{
                  'badge-success': data.technicalNegotiation === 'No',
                  'badge-danger': data.technicalNegotiation === 'Yes',
                }"
              >
                {{ data.technicalNegotiation }}
              </span>
            </td>
            <td>{{ data.finalAmount }}</td>
            <td>{{ data.finalCurrency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm mt-[24px]">
      Showing {{ dummyHistory.length }} data from {{ dummyHistory.length }}
    </p>
    <NegotiationModal :historyData="dummyHistory[0]" :data="entitiesData" @setNego="saveUpdate" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineAsyncComponent } from 'vue'
import { KTModal } from '@/metronic/core'
import {
  type NegotiationEntitiesTypes,
  type TableNegotiationTypes,
  type tableNegotiationHistoryTypes,
} from '../types/tenderNegotiation'

const NegotiationModal = defineAsyncComponent(() => import('./NegotiationModal.vue'))

const isChanged = ref<boolean>(false)

const columns = ref<string[]>([
  'Iteration',
  'Status',
  'Type',
  'Expected Discount',
  'Vendor Purposed Discount',
  'Total Amount',
  'Currency',
  'Disc Amount',
  'Currency',
  'Technicaol Negotiation',
  'Final Amount',
  'Currency',
])

const dummyHistory = ref<tableNegotiationHistoryTypes[]>([
  {
    historyId: 2,
    iteration: 'Iteration 2',
    status: 'Open',
    type: 'Volume Disc',
    expectedDisc: '30%',
    vendorPurposedDisc: '25%',
    totalAmount: '20,000',
    totalCurrency: 'USD',
    discAmount: '5,000',
    discCurrency: 'USD',
    technicalNegotiation: 'No',
    finalAmount: '15,000',
    finalCurrency: 'USD',
  },
  {
    historyId: 1,
    iteration: 'Iteration 1',
    status: 'Closed',
    type: 'Itemized Disc',
    expectedDisc: '40%',
    vendorPurposedDisc: '20%',
    totalAmount: '20,000',
    totalCurrency: 'USD',
    discAmount: '4,000',
    discCurrency: 'USD',
    technicalNegotiation: 'Yes',
    finalAmount: '16,000',
    finalCurrency: 'USD',
  },
])

const entitiesData = ref<NegotiationEntitiesTypes[]>([
  {
    prNo: '10012525',
    ItemNo: 1,
    Material: 'CH-1062',
    MaterialDesc: 'Macro Fertilizer Urea',
    Quantity: 30,
    UoM: 'TON',
    UnitPrice: 1000,
    unitCurrency: 'USD',
    ExpDisc: '30%',
    ExpectedDisc: 300,
    ExpPricePerUnit: 700,
    TotalGrossAmount: 30000,
    TotalDisc: 7500,
    TotalNettAmount: 22500,
    VendorPurposeDisc: '25%',
    VendorDiscAmount: 250,
    VendorPricePerUnit: 750,
    vendorTotalGross: 30000,
    vendorTotalDisc: 7500,
    vendorTOtalNett: 22500,
    VarNettAmount: 1500,
    varNettCurrency: 'USD',
  },
  {
    prNo: '10012525',
    ItemNo: 2,
    Material: 'CH-1064',
    MaterialDesc: 'Macro Fertilizer NPK',
    Quantity: 33,
    UoM: 'TON',
    UnitPrice: 2000,
    unitCurrency: 'USD',
    ExpDisc: '30%',
    ExpectedDisc: 600,
    ExpPricePerUnit: 1400,
    TotalGrossAmount: 66000,
    TotalDisc: 19800,
    TotalNettAmount: 22500,
    VendorPurposeDisc: '25%',
    VendorDiscAmount: 250,
    VendorPricePerUnit: 750,
    vendorTotalGross: 30000,
    vendorTotalDisc: 7500,
    vendorTOtalNett: 22500,
    VarNettAmount: 1500,
    varNettCurrency: 'USD',
  },
  {
    prNo: '10012525',
    ItemNo: 3,
    Material: 'CH-1066',
    MaterialDesc: 'Macro Fertilizer CaCO3',
    Quantity: 35,
    UoM: 'TON',
    UnitPrice: 3000,
    unitCurrency: 'USD',
    ExpDisc: '30%',
    ExpectedDisc: 900,
    ExpPricePerUnit: 2100,
    TotalGrossAmount: 70000,
    TotalDisc: 7500,
    TotalNettAmount: 22500,
    VendorPurposeDisc: '25%',
    VendorDiscAmount: 250,
    VendorPricePerUnit: 750,
    vendorTotalGross: 30000,
    vendorTotalDisc: 7500,
    vendorTOtalNett: 22500,
    VarNettAmount: 1500,
    varNettCurrency: 'USD',
  },
])

const dataDummy = ref<TableNegotiationTypes[]>([
  {
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
    uom: 'KG',
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
    uom: 'KG',
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
    uom: 'KG',
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
    uom: 'KG',
  },
])

const backupList = ref<TableNegotiationTypes[]>([
  {
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
    uom: 'KG',
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
    uom: 'KG',
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
    uom: 'KG',
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
    uom: 'KG',
  },
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
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
