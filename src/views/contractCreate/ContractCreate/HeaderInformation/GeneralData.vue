<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="font-semibold text-lg">General Data</p>
    <div class="w-[80%] flex gap-[24px] self-center">
      <!-- left -->
      <div class="flex-1">
        <!-- Title -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Title
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.title" class="input" placeholder="" :class="{ 'border-danger': form.titleError }"/>
        </div>
        <!-- Contract Overview -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Contract Overview
          </label>
          <input v-model="form.contractOverview" class="input" placeholder="" disabled/>
        </div>
        <!-- Contract Reference -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] align-items-center">
          <label class="form-label max-w-32">
            Contract Reference
          </label>
          <input v-model="form.contractReference" class="input" placeholder="" disabled/>
          <button class="btn btn-icon btn-primary mt-auto" @click="openContractReference">
            <i class="ki-duotone ki-magnifier"></i>
          </button>
        </div>
        <!-- Language -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Language
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.language" class="select" :class="{ 'border-danger': form.languageError }">
            <option v-for="item of languageList" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <!-- Tender ID Ref -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Tender ID Ref
          </label>
          <input v-model="form.tenderIdReference" class="input" placeholder="" disabled/>
          <button class="btn btn-icon btn-primary" @click="openTenderReference">
            <i class="ki-duotone ki-magnifier"></i>
          </button>
        </div>
        <!-- Binding Type -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Binding Type
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.bindingType" class="select" :class="{ 'border-danger': form.bindingTypeError }">
            <option v-for="item of bindingTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Supplier -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Supplier
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.supplier" class="select" :class="{ 'border-danger': form.supplierError }">
            <option v-for="item of supplierList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Total Amount -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Total Amount
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.totalAmount" class="input" placeholder="" :class="{ 'border-danger': form.totalAmountError }"/>
        </div>
        <!-- Commodity -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Commodity
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.commodity" class="select" :class="{ 'border-danger': form.commodityError }">
            <option v-for="item of commodityList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Department -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Department
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.department" class="select" :class="{ 'border-danger': form.departmentError }">
            <option v-for="item of departmentList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Agreement Type -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Agreement Type
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.agrementType" class="select" :class="{ 'border-danger': form.agrementTypeError }">
            <option v-for="item of aggrementTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Agreement Date -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Agreement Date
          </label>
          <DatePicker v-model="form.agreementDate" format="dd MMM yyyy" />
        </div>
      </div>
      <!-- right -->
      <div class="flex-1">
        <!-- Cost Type -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Cost Type
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <select v-model="form.costType" class="select" :class="{ 'border-danger': form.costTypeError }">
            <option v-for="item of costTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Relation Type -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Relation Type
          </label>
          <select v-model="form.relationType" class="select">
            <option v-for="item of relationTypeList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Risk Allocation -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Risk Allocation
          </label>
          <select v-model="form.riskAllocation" class="select">
            <option v-for="item of riskAllocationList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <!-- Effective Date -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Effective Date
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <DatePicker v-model="form.effectiveDate" format="dd MMM yyyy" :error="form.effectiveDateError" />
        </div>
        <!-- Expiration Date -->
        <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Expiration Date
          </label>
          <DatePicker v-model="form.expirationDate" format="dd MMM yyyy" />
        </div>
        <!-- Notice Period (in days) -->
        <div v-if="form.effectiveDate && form.expirationDate" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
          <label class="form-label max-w-32">
            Notice Period (in days)
            <span class="text-red-500 ml-[4px]">*</span>
          </label>
          <input v-model="form.noticePeriod" class="input" placeholder="" :class="{ 'border-danger': form.noticePeriodError }"/>
        </div>
      </div>
    </div>
    <ContractReferenceModal @setData="setDataContractRef" />
    <TenderIdReferenceModal @setData="setDataTenderRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, defineAsyncComponent } from 'vue'
// import { useFormatUsd } from '@/composables/currency'
import { KTModal } from '@/metronic/core'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import type { FormTypes } from '../../types/contractCreate'
import type { defaultTypes, ContractReferenceTypes, TenderIdReferenceTypes } from '../../types/headerInformation'

const ContractReferenceModal = defineAsyncComponent(() => import('./GeneralData/ContractReferenceModal.vue'))
const TenderIdReferenceModal = defineAsyncComponent(() => import('./GeneralData/TenderIdReferenceModal.vue'))

const form = inject<FormTypes>('form')

const languageList = ref<string[]>(['Bahasa', 'Englist'])
const bindingTypeList = ref<defaultTypes[]>([
  {
    id: 1,
    name: 'Stand-alone Agreement'
  },
  {
    id: 2,
    name: 'Master Agreement'
  },
  {
    id: 3,
    name: 'Sub Agreement'
  }
])
const supplierList = ref<defaultTypes[]>([
  {
    id: '1',
    name: 'Supplier 1'
  },
  {
    id: '2',
    name: 'Supplier 2'
  },
  {
    id: '3',
    name: 'Supplier 3'
  }
])
const commodityList = ref<defaultTypes[]>([
  {
    id: '1',
    name: 'Commodity 1'
  },
  {
    id: '2',
    name: 'Commodity 2'
  },
  {
    id: '3',
    name: 'Commodity 3'
  }
])
const departmentList = ref<defaultTypes[]>([
  {
    id: '1',
    name: 'Department 1'
  },
  {
    id: '2',
    name: 'Department 2'
  },
  {
    id: '3',
    name: 'Department 3'
  }
])
const aggrementTypeList = ref<defaultTypes[]>([
  {
    id: 1,
    name: 'Contract Quantity'
  },
  {
    id: 2,
    name: 'Contract Value'
  },
  {
    id: 3,
    name: 'Project Based'
  }
])
const costTypeList = ref<defaultTypes[]>([
  {
    id: 1,
    name: 'Fixed-Price'
  },
  {
    id: 2,
    name: 'Cost-Plus'
  },
  {
    id: 3,
    name: 'Time & Materials (T&M)'
  }
])
const relationTypeList = ref<defaultTypes[]>([
  {
    id: 1,
    name: 'Contract of Sale'
  },
  {
    id: 2,
    name: 'Service Contract'
  },
  {
    id: 3,
    name: 'Employment Contract'
  }
])
const riskAllocationList = ref<defaultTypes[]>([
  {
    id: 1,
    name: 'Guaranteed Maximum Price (GMP)'
  },
  {
    id: 2,
    name: 'Indefinite Delivery, Indefinite Quantity (IDIQ)'
  },
  {
    id: 3,
    name: 'Incentive Based'
  }
])

// const inputAmount = (e: Event) => {
//   if (form) {
//     const target = e.target as HTMLInputElement
//     const nominal = target.value.replace(/\D/g, '')
//     console.log(nominal)
//     console.log(useFormatUsd(nominal))
//     form.totalAmount = useFormatUsd(nominal)
//   }
// }

const openContractReference = () => {
  const idModal = document.querySelector('#contract_reference_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openTenderReference = () => {
  const idModal = document.querySelector('#tender_id_reference_modal')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const setDataContractRef = (data: ContractReferenceTypes) => {
  if (form) form.contractReference = data.contractRequestId
}

const setDataTenderRef = (data: TenderIdReferenceTypes) => {
  if (form) form.tenderIdReference = data.tenderRequestId
}
</script>
