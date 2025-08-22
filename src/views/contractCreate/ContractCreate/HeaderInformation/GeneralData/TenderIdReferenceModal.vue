<template>
  <div class="modal" data-modal="true" id="tender_id_reference_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-body p-[24px]">
        <div class="flex align-items-center gap-[16px]">
          <div class="flex-1">
            <!-- Company Code -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Company Code
              </label>
              <input v-model="companyCode" class="input" placeholder=""/>
            </div>
            <!-- Contract ID -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Contract ID
              </label>
              <input v-model="contractId" class="input" placeholder=""/>
            </div>
            <!-- Department -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Department
              </label>
              <select v-model="department" class="select">
                <option v-for="item of departmentOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <!-- Commodity -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Commodity
              </label>
              <select v-model="commodity" class="select">
                <option v-for="item of commodityOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex-1">
            <!-- Material Group -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Material Group
              </label>
              <input v-model="materialGroup" class="input" placeholder=""/>
            </div>
            <!-- Vendor -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Vendor
              </label>
              <input v-model="vendor" class="input" placeholder=""/>
            </div>
          </div>
        </div>
        <div class="mt-[24px]">
          <div class="input w-[250px]">
            <i class="ki-filled ki-magnifier"></i>
            <input v-model="search" placeholder="Cari data" type="text"/>
          </div>
        </div>
        <div class="table-item__table mt-[24px]">
          <table class="table text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th
                  v-for="(item, index) in columns"
                  :key="index"
                  class="table-item__field-base !border-b-blue-500"
                  :class="{
                    'table-item__field-base--description': item === 'Material Desc' || item === 'Department' || item === 'Division'
                  }"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data of list" :key="data.tenderRequestId">
                <td>
                  <input v-model="selectedData" class="radio" name="radioContract" type="radio" :value="data.tenderRequestId"/>
                </td>
                <td>{{ data.tenderRequestId }}</td>
                <td>{{ data.tenderStatus }}</td>
                <td>{{ data.purchaseRequisitionCategory }}</td>
                <td>{{ data.evaluationObject }}</td>
                <td>{{ moment(data.startDate).format('DD MMM YYYY') }}</td>
                <td>{{ moment(data.endDate).format('DD MMM YYYY') }}</td>
                <td>{{ data.plant }}</td>
                <td>{{ data.companyCode }}</td>
                <td>{{ data.method }}</td>
                <td>{{ data.picTender }}</td>
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
import { onMounted, ref, watch } from 'vue'
import { KTModal } from '@/metronic/core'
import type { TenderIdReferenceTypes } from '../../../types/headerInformation'
import moment from 'moment'
import { cloneDeep } from 'lodash'

const emits = defineEmits(['setData'])

const search = ref<string>('')
const companyCode = ref<string>('')
const contractId = ref<string>('')
const department = ref<string>('')
const commodity = ref<string>('')
const materialGroup = ref<string>('')
const vendor = ref<string>('')
const selectedData = ref<string>('')
const list = ref<TenderIdReferenceTypes[]>([])

const originalList = ref<TenderIdReferenceTypes[]>([
  {
    tenderRequestId: '10000101',
    tenderStatus: 'Closed',
    purchaseRequisitionCategory: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    picTender: 'Ralph Edwards',
    isSelected: false
  },
  {
    tenderRequestId: '10000102',
    tenderStatus: 'Closed',
    purchaseRequisitionCategory: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    picTender: 'Guy Hawkins',
    isSelected: false
  },
  {
    tenderRequestId: '10000103',
    tenderStatus: 'Closed',
    purchaseRequisitionCategory: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    picTender: 'Guy Hawkins',
    isSelected: false
  },
  {
    tenderRequestId: '10000104',
    tenderStatus: 'Closed',
    purchaseRequisitionCategory: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    picTender: 'Guy Hawkins',
    isSelected: false
  },
  {
    tenderRequestId: '10000105',
    tenderStatus: 'Closed',
    purchaseRequisitionCategory: 'MRP',
    evaluationObject: 'E1',
    startDate: '2025-10-25',
    endDate: '2025-11-14',
    plant: 'CHP2',
    companyCode: '1000',
    method: '1',
    picTender: 'Guy Hawkins',
    isSelected: false
  }
])

const columns = ref<string[]>([
  '',
  'Tender Request ID',
  'Tender Status',
  'PR Category',
  'Evaluation Object',
  'Tender Start Date',
  'Tender End Date',
  'Plant',
  'Compay Code',
  'Method',
  'PIC Tender'
])

const departmentOptions = ref([
  {
    id: 1,
    name: 'department 1'
  },
  {
    id: 2,
    name: 'department 2'
  },
  {
    id: 3,
    name: 'department 3'
  }
])

const commodityOptions = ref([
  {
    id: 1,
    name: 'commodity 1'
  },
  {
    id: 2,
    name: 'commodity 2'
  },
  {
    id: 3,
    name: 'commodity 3'
  }
])

const hide = () => {
  const idModal = document.querySelector('#tender_id_reference_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  reset()
}

const saveUpdate = () => {
  const filterSelected = list.value.filter((item) => item.tenderRequestId === selectedData.value)
  emits('setData', filterSelected[0])
  hide()
}

const reset = () => {
  for (const item of originalList.value) {
    item.isSelected = false
  }
  list.value = originalList.value
  search.value = ''
  companyCode.value = ''
  contractId.value = ''
  department.value = ''
  commodity.value = ''
  materialGroup.value = ''
  vendor.value = ''
}

const filterList = () => {
  let result = cloneDeep(originalList.value) as TenderIdReferenceTypes[]

  if (companyCode.value) {
    result = result.filter((item) => item.companyCode === companyCode.value)
  }

  // if (contractId.value) {
  //   result = result.filter((item) => item.contractRequestId === contractId.value)
  // }

  // if (department.value) {
  //   result = result.filter((item) => item.department === department.value)
  // }

  // if (commodity.value) {
  //   result = result.filter((item) => item.commodity === commodity.value)
  // }

  // if (materialGroup.value) {
  //   result = result.filter((item) => item.materialGroup === materialGroup.value)
  // }

  // if (vendor.value) {
  //     result = result.filter((item) => item.vendor === vendor.value)
  // }

  list.value = result
}

watch(
  () => [
    companyCode.value,
    contractId.value,
    department.value,
    commodity.value,
    materialGroup.value,
    vendor.value
  ],
  () => {
    filterList()
  }
)

onMounted(() => {
  list.value = cloneDeep(originalList.value)
})
</script>
