<template>
  <div class="modal" data-modal="true" id="tender_add_sourcing_requisition_modal">
    <div class="modal-content max-w-[1200px] modal-center-y">
      <div class="modal-body p-[24px]">
        <div class="flex align-items-center gap-[16px]">
          <div class="flex-1">
            <!-- Sourcing Type -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Sourcing Type
              </label>
              <select v-model="sourcingType" class="select">
                <option v-for="item of sourcingTypeOption" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <!-- PR No -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                PR No
              </label>
              <input v-model="purchaseRequisitionNo" class="input" placeholder=""/>
            </div>
            <!-- Plant -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Plant
              </label>
              <input v-model="plant" class="input" placeholder=""/>
            </div>
          </div>
          <div class="flex-1">
            <!-- Requestor -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Requestor
              </label>
              <input v-model="requestor" class="input" placeholder=""/>
            </div>
            <!-- Division -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Division
              </label>
              <select v-model="division" class="select">
                <option v-for="item of divisionOption" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <!-- Department -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Department
              </label>
              <input v-model="department" class="input" placeholder=""/>
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
                <!-- <th class="table-item__field-base !border-b-blue-500">
                  <input v-model="selectAll" class="checkbox" type="checkbox"/>
                </th> -->
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
              <tr v-for="data of list" :key="data.id">
                <td>
                  <input v-model="data.isSelected" class="checkbox" type="checkbox"/>
                </td>
                <td>{{ data.sourcingType }}</td>
                <td>{{ data.purchaseRequisitionNo }}</td>
                <td>{{ data.division }}</td>
                <td>{{ data.plant }}</td>
                <td>{{ data.department }}</td>
                <td>{{ data.requestor }}</td>
                <td>{{ data.materialGroup }}</td>
                <td>{{ data.itemNo }}</td>
                <td>{{ data.material }}</td>
                <td>{{ data.materialDescription }}</td>
                <td>{{ useFormatIdr(data.quantity) }}</td>
                <td>{{ data.uom }}</td>
                <td>{{ data.currency === 'IDR' ? useFormatIdr(data.bottomPrice) : useFormatUsd(data.bottomPrice) }}</td>
                <td>{{ data.currency }}</td>
                <td>{{ moment(data.deliveryDate).format('DD MMM YYYY') }}</td>
                <td>{{ data.type }}</td>
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
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { SourcingRequestitionTypes } from '../../../types/purchaseRequisitionList'
import moment from 'moment'
import { cloneDeep } from 'lodash'

const emits = defineEmits(['setData'])

const selectAll = ref<boolean>(false)
const sourcingType = ref<string>('')
const purchaseRequisitionNo = ref<string>('')
const plant = ref<string>('')
const requestor = ref<string>('')
const division = ref<string>('')
const department = ref<string>('')
const search = ref<string>('')

const originalList = ref<SourcingRequestitionTypes[]>([
  {
    id: '1',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM4',
    materialDescription: 'Aurum Product 4',
    quantity: 30,
    uom: 'Oz t',
    bottomPrice: 100000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '2',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM5',
    materialDescription: 'Aurum Product 5',
    quantity: 33,
    uom: 'Oz t',
    bottomPrice: 120000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '3',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM6',
    materialDescription: 'Aurum Product 6',
    quantity: 25,
    uom: 'Oz t',
    bottomPrice: 77000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '4',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1001',
    materialDescription: 'Conveyor Belt VA1',
    quantity: 5,
    uom: 'KG',
    bottomPrice: 5000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '5',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1002',
    materialDescription: 'Conveyor Belt VA2',
    quantity: 4,
    uom: 'KG',
    bottomPrice: 11000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '6',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1003',
    materialDescription: 'Conveyor Belt VA3',
    quantity: 3,
    uom: 'KG',
    bottomPrice: 3500,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  }
])

const list = ref<SourcingRequestitionTypes[]>([
  {
    id: '1',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM4',
    materialDescription: 'Aurum Product 4',
    quantity: 30,
    uom: 'Oz t',
    bottomPrice: 100000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '2',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM5',
    materialDescription: 'Aurum Product 5',
    quantity: 33,
    uom: 'Oz t',
    bottomPrice: 120000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '3',
    sourcingType: 'PR',
    purchaseRequisitionNo: '10012525',
    division: 'Production',
    plant: 'CHP2',
    department: 'Services Area',
    requestor: 'Budi',
    materialGroup: '4',
    itemNo: '20',
    material: 'AURM6',
    materialDescription: 'Aurum Product 6',
    quantity: 25,
    uom: 'Oz t',
    bottomPrice: 77000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '4',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1001',
    materialDescription: 'Conveyor Belt VA1',
    quantity: 5,
    uom: 'KG',
    bottomPrice: 5000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '5',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1002',
    materialDescription: 'Conveyor Belt VA2',
    quantity: 4,
    uom: 'KG',
    bottomPrice: 11000,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  },
  {
    id: '6',
    sourcingType: 'RFQ',
    purchaseRequisitionNo: '50000342',
    division: 'Asset Management',
    plant: 'CHP2',
    department: 'Asset Planning',
    requestor: 'Anton',
    materialGroup: '4',
    itemNo: '20',
    material: 'KA-1003',
    materialDescription: 'Conveyor Belt VA3',
    quantity: 3,
    uom: 'KG',
    bottomPrice: 3500,
    currency: 'USD',
    deliveryDate: '2025-08-24',
    type: 'R',
    isSelected: false
  }
])

const columns = ref<string[]>([
  '',
  'Sourcing Type',
  'PR No',
  'Division',
  'Plant',
  'Department',
  'Requestor',
  'Material Group',
  'Item No',
  'Material',
  'Material Desc',
  'Quantity',
  'UoM',
  'Bottom Price (LBMA)',
  'Currency',
  'Delivery Date',
  'Type'
])

const sourcingTypeOption = ref([
  {
    id: 'RFI',
    name: 'RFI'
  },
  {
    id: 'PR',
    name: 'PR'
  },
  {
    id: 'RFQ',
    name: 'RFQ'
  },
  {
    id: 'RFP',
    name: 'RFP'
  }
])

const divisionOption = ref([
  {
    id: 'Production',
    name: 'Production'
  },
  {
    id: 'Finance & Accounting',
    name: 'Finance & Accounting'
  },
  {
    id: 'Asset Management',
    name: 'Asset Management'
  },
  {
    id: 'RFP',
    name: 'RFP'
  }
])

const hide = () => {
  const idModal = document.querySelector('#tender_add_sourcing_requisition_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  reset()
}

const saveUpdate = () => {
  const filterSelected = list.value.filter((item) => item.isSelected)
  emits('setData', filterSelected)
  hide()
}

const reset = () => {
  for (const item of originalList.value) {
    item.isSelected = false
  }
  list.value = originalList.value
  selectAll.value = false
  sourcingType.value = ''
  purchaseRequisitionNo.value = ''
  plant.value = ''
  requestor.value = ''
  division.value = ''
  department.value = ''
  search.value = ''
}

const filterList = () => {
  let result = cloneDeep(originalList.value) as SourcingRequestitionTypes[]

  if (sourcingType.value) {
    result = result.filter((item) => item.sourcingType === sourcingType.value)
  }

  if (purchaseRequisitionNo.value) {
    result = result.filter((item) => item.purchaseRequisitionNo.includes(purchaseRequisitionNo.value))
  }

  if (plant.value) {
    result = result.filter((item) => item.plant.includes(plant.value))
  }

  if (requestor.value) {
    result = result.filter((item) => item.requestor.includes(requestor.value))
  }

  if (division.value) {
    result = result.filter((item) => item.division === division.value)
  }

  if (department.value) {
    result = result.filter((item) => item.department.includes(department.value))
  }

  list.value = result
}

watch(
  () => [
    sourcingType.value,
    purchaseRequisitionNo.value,
    plant.value,
    requestor.value,
    division.value,
    department.value
  ],
  () => {
    filterList()
  }
)

watch(
  () => selectAll.value,
  () => {
    for (const item of list.value) {
      item.isSelected = !item.isSelected
      const getIndexOri = originalList.value.findIndex((data) => data.id === item.id)
      if (getIndexOri !== -1) {
        originalList.value[getIndexOri].isSelected = item.isSelected
      }
    }
  }
)
</script>
