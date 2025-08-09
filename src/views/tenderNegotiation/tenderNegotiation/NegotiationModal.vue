<template>
  <div class="modal" data-modal="true" id="tender_negotiation_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-body p-[24px]">
        <div class="nego__table mt-[24px]">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in columns"
                  :key="index"
                  class="nego__field-base !border-b-blue-500"
                  :class="{
                    'nego__field-base--description': item === 'Material Desc'
                  }"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data of list" :key="data.tenderRequestNumber">
                <td>{{ data.tenderRequestNumber }}</td>
                <td>{{ data.type }}</td>
                <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
                <td>{{ data.plant }}</td>
                <td>{{ data.materialGroup }}</td>
                <td>{{ data.itemNo }}</td>
                <td>
                  <input v-model="data.tenderPrice" type="number" class="input" />
                </td>
                <td>{{ data.material }}</td>
                <td>{{ data.materialDescription }}</td>
                <td>{{ data.quantity }}</td>
                <td>{{ data.buttonPrice }}</td>
                <td>{{ data.uom }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row-reverse align-items-center gap-[8px] mt-[24px]">
          <button class="btn btn-primary" @click="saveUpdate">Confirm</button>
          <button class="btn btn-outline btn-primary" @click="hide">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { KTModal } from '@/metronic/core'
import type { TableNegotiationTypes } from '../types/tenderNegotiation'
import moment from 'moment'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  data: TableNegotiationTypes[]
}>()

const emits = defineEmits(['setNego'])

const list = ref<TableNegotiationTypes[]>([])

const columns = ref<string[]>([
  'Tender Request Number',
  'Type',
  'Delivery Date',
  'Plant',
  'Material Group',
  'Item No',
  'Prices Update',
  'Material',
  'Material Desc',
  'Quantity',
  'Button Price',
  'UOM'
])

const hide = () => {
  const idModal = document.querySelector('#tender_negotiation_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
}

const saveUpdate = () => {
  emits('setNego', list.value)
  hide()
}

watch(
  () => props.data,
  () => {
    list.value = cloneDeep(props.data)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
