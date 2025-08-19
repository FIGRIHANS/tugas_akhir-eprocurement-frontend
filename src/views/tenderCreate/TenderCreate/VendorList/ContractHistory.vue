<template>
  <div class="modal" data-modal="true" id="contract_history_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-body p-[24px]">
        <p>PT Walldorf Grosshandel Tbk</p>
        <p>Contract History</p>
        <div class="vendor-list__table mt-[24px]">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in columns"
                  :key="index"
                  class="vendor-list__field-base !border-b-blue-500"
                  :class="{
                    'vendor-list__field-base--desc': item === 'Desc'
                  }"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data of list" :key="data.id">
                <td>{{ data.year }}</td>
                <td>{{ data.material }}</td>
                <td>{{ data.materialDescription }}</td>
                <td>{{ data.quantity }}</td>
                <td>{{ data.uom }}</td>
                <td>{{ useFormatUsd(data.totalContractAmount) }}</td>
                <td>{{ data.discount + '%' }}</td>
                <td>{{ data.currency }}</td>
                <td>{{ useFormatUsd(data.contractPrice) }}</td>
                <td>{{ useFormatUsd(data.lbma) }}</td>
                <td>{{ data.var + '%' }}</td>
                <td>
                  <iconPDF />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row-reverse align-items-center gap-[8px] mt-[24px]">
          <button class="btn btn-outline btn-primary" @click="hide">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { KTModal } from '@/metronic/core'
import { useFormatUsd } from '@/composables/currency'
import type { ContractHistoryTypes } from '../../types/vendorList'
import iconPDF from '@/components/icons/iconPDF.vue'

const list = ref<ContractHistoryTypes[]>([
  {
    id: 1,
    year: '2024',
    material: 'AURM4',
    materialDescription: 'Aurum Product 4',
    quantity: 150,
    uom: 'Oz t',
    totalContractAmount: 495000,
    discount: 5,
    currency: 'USD',
    contractPrice: 3100,
    lbma: 3200,
    var: 3
  },
  {
    id: 2,
    year: '2024',
    material: 'AURM5',
    materialDescription: 'Aurum Product 5',
    quantity: 100,
    uom: 'Oz t',
    totalContractAmount: 330000,
    discount: 3,
    currency: 'USD',
    contractPrice: 3100,
    lbma: 3200,
    var: 3
  },
  {
    id: 3,
    year: '2023',
    material: 'AURM4',
    materialDescription: 'Aurum Product 4',
    quantity: 40,
    uom: 'Oz t',
    totalContractAmount: 132000,
    discount: 5,
    currency: 'USD',
    contractPrice: 2800,
    lbma: 2850,
    var: 2
  },
  {
    id: 4,
    year: '2023',
    material: 'AURM5',
    materialDescription: 'Aurum Product 5',
    quantity: 50,
    uom: 'Oz t',
    totalContractAmount: 165000,
    discount: 3,
    currency: 'USD',
    contractPrice: 2800,
    lbma: 2850,
    var: 2
  }
])

const columns = ref<string[]>([
  'Year',
  'Material',
  'Desc',
  'Qty',
  'UoM',
  'Total Contract Amount',
  'Disc',
  'Currency',
  'Contract Price',
  'LBMA',
  'Var',
  'Contract Document'
])

const hide = () => {
  const idModal = document.querySelector('#contract_history_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}
</script>
