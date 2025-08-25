<template>
  <div class="modal" data-modal="true" id="contract_reference_modal">
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
            <!-- Document Type -->
            <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
              <label class="form-label max-w-32">
                Document Type
              </label>
              <select v-model="documentType" class="select">
                <option v-for="item of documentTypeOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
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
              <tr v-for="data of list" :key="data.contractRequestId">
                <td>
                  <input v-model="selectedData" class="radio" name="radioContract" type="radio" :value="data.contractRequestId"/>
                </td>
                <td>{{ data.contractRequestId }}</td>
                <td>{{ data.contractStatus }}</td>
                <td>{{ data.sapOutlineAgreement }}</td>
                <td>{{ data.documentType }}</td>
                <td>{{ data.agreementType }}</td>
                <td>{{ moment(data.startDate).format('DD MMM YYYY') }}</td>
                <td>{{ moment(data.endDate).format('DD MMM YYYY') }}</td>
                <td>{{ data.currency === 'IDR' ? useFormatIdr(data.totalAmount) : useFormatUsd(data.totalAmount) }}</td>
                <td>{{ data.currency }}</td>
                <td>{{ data.companyCode }}</td>
                <td>{{ data.costType }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-row-reverse align-items-center gap-[8px] mt-[24px]">
          <button class="btn btn-primary" @click="saveUpdate">Adopt</button>
          <button class="btn btn-outline btn-primary" @click="hide">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { KTModal } from '@/metronic/core'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { ContractReferenceTypes } from '../../../types/headerInformation'
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
const documentType = ref<string>('')
const selectedData = ref<string>('')
const list = ref<ContractReferenceTypes[]>([])

const originalList = ref<ContractReferenceTypes[]>([
  {
    contractRequestId: '80000001',
    contractStatus: 'Active',
    sapOutlineAgreement: '3020000088',
    documentType: 'ZARP',
    agreementType: 'Contract Quantity',
    startDate: '2025-01-01',
    endDate: '9999-12-31',
    totalAmount: 2500000,
    currency: 'USD',
    companyCode: '1000',
    costType: 'Fixed Price',
    isSelected: false
  },
  {
    contractRequestId: '80000002',
    contractStatus: 'Active',
    sapOutlineAgreement: '3020000087',
    documentType: 'ZARP',
    agreementType: 'Contract Quantity',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalAmount: 2400000,
    currency: 'USD',
    companyCode: '1000',
    costType: 'Fixed Price',
    isSelected: false
  },
  {
    contractRequestId: '80000003',
    contractStatus: 'Active',
    sapOutlineAgreement: '3020000086',
    documentType: 'ZARP',
    agreementType: 'Contract Quantity',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    totalAmount: 2300000,
    currency: 'USD',
    companyCode: '1000',
    costType: 'Fixed Price',
    isSelected: false
  },
  {
    contractRequestId: '80000004',
    contractStatus: 'Expired',
    sapOutlineAgreement: '3020000085',
    documentType: 'ZARP',
    agreementType: 'Contract Quantity',
    startDate: '2022-01-01',
    endDate: '2022-12-31',
    totalAmount: 2200000,
    currency: 'USD',
    companyCode: '1000',
    costType: 'Fixed Price',
    isSelected: false
  },
  {
    contractRequestId: '80000005',
    contractStatus: 'Void',
    sapOutlineAgreement: '3020000084',
    documentType: 'ZARP',
    agreementType: 'Contract Quantity',
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    totalAmount: 2100000,
    currency: 'USD',
    companyCode: '1000',
    costType: 'Fixed Price',
    isSelected: false
  }
])

const columns = ref<string[]>([
  '',
  'Contract Request ID',
  'Contract Status',
  'SAP Outline Agreement',
  'Document Type',
  'Agreement Type',
  'Contract Start Date',
  'Contract End Date',
  'Total Amount',
  'Currency',
  'Compay Code',
  'Cost Type'
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

const documentTypeOptions = ref([
  {
    id: 'ZAAS',
    name: 'Asset'
  },
  {
    id: 'ZABL',
    name: 'Blanket'
  },
  {
    id: 'ZAHC',
    name: 'Ad Hoc'
  },
  {
    id: 'ZARP',
    name: 'Replenishment'
  },
  {
    id: 'ZASC',
    name: 'Subcontracting'
  },
  {
    id: 'ZASP',
    name: 'Special'
  },
  {
    id: 'ZAVH',
    name: 'VHS'
  },
  {
    id: 'ZEAS',
    name: 'Asset'
  },
  {
    id: 'ZEBL',
    name: 'Blanket'
  },
  {
    id: 'ZEHC',
    name: 'Ad Hoc'
  },
  {
    id: 'ZEPR',
    name: 'Project'
  }
])

const hide = () => {
  const idModal = document.querySelector('#contract_reference_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
  reset()
}

const saveUpdate = () => {
  const filterSelected = list.value.filter((item) => item.contractRequestId === selectedData.value)
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
  documentType.value = ''
}

const filterList = () => {
  let result = cloneDeep(originalList.value) as ContractReferenceTypes[]

  if (companyCode.value) {
    result = result.filter((item) => item.companyCode === companyCode.value)
  }

  if (contractId.value) {
    result = result.filter((item) => item.contractRequestId === contractId.value)
  }

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

  if (documentType.value) {
    result = result.filter((item) => item.documentType === documentType.value)
  }

  list.value = result
}

watch(
  () => [
    companyCode.value,
    contractId.value,
    department.value,
    commodity.value,
    materialGroup.value,
    vendor.value,
    documentType.value
  ],
  () => {
    filterList()
  }
)

onMounted(() => {
  list.value = cloneDeep(originalList.value)
})
</script>
