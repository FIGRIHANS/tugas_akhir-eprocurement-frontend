<template>
  <div>
    <p class="mb-[16px] font-semibold text-base">Invoice Header</p>
    <div v-if="form" :class="{ 'pointer-events-none': isCasView }">
      <div v-if="checkPo() || checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Type
          <span v-if="
            (form.status === 0 || form.status === -1 || form.status === 5) && !loginApi.isVendor
          " class="text-red-500 ml-[4px]">*</span>
        </label>
        <template v-if="checkIsNonPo()">
          <input v-if="isCasRoute || isCasView" v-model="form.invoiceTypeName" class="input" placeholder="" disabled />
          <select v-else v-model="form.invoiceType" class="select" :class="{
            'border-danger': form.invoiceTypeError,
          }">
            <option v-for="item of listInvoiceTypeNonPo" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </template>
        <template v-else>
          <input v-if="(form.status !== 0 && form.status !== -1) || loginApi.isVendor" v-model="form.invoiceTypeName"
            class="input" placeholder="" disabled />
          <select v-else v-model="form.invoiceType" class="select" :class="{ 'border-danger': form.invoiceTypeError }"
            @change="removeDpValue()">
            <option v-for="item of listInvoiceTypePo" :key="item.code" :value="item.code">
              {{ item.name }}
            </option>
          </select>
        </template>
      </div>
      <div v-if="checkIsNonPo() && !isPettyCash" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
      </div>
      <!-- <div v-if="isCasRoute || isCasView" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          CAS No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.casNoCode" class="input" placeholder="" disabled />
      </div> -->
      <div
        v-if="form.invoiceType === '901' && !isCasRoute"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          DP Option
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.invoiceDp"
          class="input" placeholder="" disabled />
        <select v-else v-model="form.invoiceDp" class="select" :class="{ 'border-danger': form.invoiceDpError }">
          <option v-for="item of dpTypeList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Company Code
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="(form.status !== 0 && form.status !== -1 && form.status !== 5) || isCasRoute || isCasView"
          v-model="form.companyCode" class="input" placeholder="" disabled />
        <select v-else v-model="form.companyCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
          <option v-for="item of companyCodeList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Submitted Document No. </label>
        <input v-model="form.invoiceNo" class="input" placeholder="Auto Generated Number" disabled />
      </div>

      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.invoiceVendorNo" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.invoiceVendorNoError }" />
      </div>

      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" format="yyyy/MM/dd" :error="form.invoiceDateError"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" class="w-full -ml-[15px]" teleport />
      </div>

      <div v-if="checkPo() && form.invoiceType != '903'"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Tax Document No. </label>
        <input v-model="form.taxNoInvoice" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.taxNoInvoiceError }" />
      </div>

      <div v-if="checkPo() && form.invoiceType != '903'"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Tax Document Date </label>
        <DatePicker v-model="form.taxDate" format="yyyy/MM/dd" :error="form.taxDateError"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" class="w-full -ml-[15px]" teleport />
      </div>

      <div v-if="isPettyCash && !isCasRoute" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Cash Journal </label>
        <v-select v-model="form.cashJournalCode" class="customSelect w-full -ml-[15px]" label="description"
          placeholder="Select" :reduce="(option: any) => option.cashJournalNo" :options="listCashJournal.map((item) => ({
            ...item,
            description: `${item.cashJournalNo} - ${item.cashJournalName}`,
          }))
            " :class="{ 'error-select': form.cashJournalCodeError }"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" appendToBody></v-select>
      </div>

      <div v-if="isPettyCash && !isCasRoute" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Petty Cash Period </label>
        <DatePicker v-model="form.pettyCashPeriod" format="yyyy/MM/dd" class="w-full -ml-[15px]" teleport :min-days="7"
          :range="true" />
      </div>

      <!-- <div
        v-if="isCAS || isLBA"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          CAS No.
          <span v-if="false" class="text-red-500 ml-[4px]">*</span>
        </label>

        <input
          v-if="isCAS"
          v-model="form.casNoCode"
          class="input"
          placeholder="Auto Generated Number"
          disabled
        />
        <v-select
          v-else-if="isLBA"
          v-model="form.casNoCode"
          class="customSelect w-full -ml-[15px]"
          label="description"
          placeholder="Select"
          :reduce="(option: any) => option.casNo"
          :options="
            casNoCode.map((item) => ({
              ...item,
              description: item.casNo,
            }))
          "
          :class="{ 'error-select': form.casNoCodeError }"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          @input="updateCasNoName"
          appendToBody
        ></v-select>
      </div> -->

      <div
        v-if="isCasRoute || isCasLike || isLBA"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          CAS No.
          <span v-if="false" class="text-red-500 ml-[4px]">*</span>
        </label>

        <input v-if="isCasRoute || isCasView" v-model="form.casNoCode" class="input" placeholder="Auto Generated Number"
          disabled />
        <select v-else v-model="form.casNoCode" class="select" :class="{ 'border-danger': form.companyCodeError }">
          <option v-for="item of mergedCasList" :key="item.casNo" :value="item.casNo">
            {{ item.casNo }}
          </option>
        </select>
      </div>

      <div
        v-if="isCasRoute || form?.invoiceType === '4'"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> HRIS Travel Request No. </label>
        <input
          v-if="isCasRoute"
          v-model="form.hrisTravelRequestNo"
          class="input"
          placeholder=""
          disabled
        />
        <select v-else v-model="form.hrisTravelRequestNo" class="select">
          <option v-for="item of hrisTravelRequestList" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>

      <div v-if="isReimbursementLike || isCreditCard || isLBA || isPettyCash"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Submitted Document No. </label>
        <input v-model="form.invoiceNo" class="input" placeholder="Auto Generated Number" disabled />
      </div>

      <div v-if="isCreditCard && !isCasRoute" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Proposal Amount
          <span class="text-red-500 ml-[4px]" v-if="
            (form.status === 0 || form.status === -1 || form.status === 5) && !loginApi.isVendor
          ">*</span>
        </label>
        <input v-model="proposalAmountDisplay" @input="onProposalInput" @blur="onProposalBlur"
          @paste.prevent="onProposalPaste" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" />
      </div>

      <div
        v-if="isReimbursementLike && !isCasRoute"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Invoice Vendor No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.invoiceVendorNo" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.invoiceVendorNoError }" />
      </div>

      <div
        v-if="isReimbursementLike && !isCasRoute"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          Invoice Date
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <DatePicker v-model="form.invoiceDate" format="yyyy/MM/dd" :error="form.invoiceDateError"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5" class="w-full -ml-[15px]" teleport />
      </div>

      <div v-if="isReimbursementLike || isCasLike || isLBA"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Tax Document No.
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.taxNoInvoice" class="input" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.taxNoInvoiceError }" />
      </div>

      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Currency </label>
        <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.currency" class="input"
          placeholder="" disabled />
        <select v-else v-model="form.currency" class="select" :class="{ 'border-danger': form.currencyError }">
          <option v-for="item of currencyList" :key="item.code" :value="item.code">
            {{ item.code }}
          </option>
        </select>
      </div>

      <div
        v-if="form.invoiceDp === '9013' && !isCasRoute"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label"> Remaining DP Amount </label>
        <input v-model="remainingDpAmountVal" class="input" placeholder="" disabled />
      </div>

      <div
        v-if="form.invoiceDp === '9013' && !isCasRoute"
        class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]"
      >
        <label class="form-label">
          DP Amount Deduction
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-model="form.dpAmountDeduction" class="input" placeholder="" type="number"
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.dpAmountDeductionError }" />
      </div>

      <div v-if="checkIsNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Requestor
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <v-select v-model="form.department" class="customSelect w-full -ml-[15px]" label="workflowDescription"
          placeholder="Select" :reduce="(option: any) => option.workflowCode" :options="listMatrixApproval"
          :class="{ 'error-select': form.departmentError }" appendToBody></v-select>
      </div>

      <div v-if="form.invoiceType != '903'" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label">
          Description
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <textarea v-model="form.description" class="textarea" placeholder=""
          :disabled="form.status !== 0 && form.status !== -1 && form.status !== 5"
          :class="{ 'border-danger': form.descriptionError }"></textarea>
      </div>

      <div v-if="checkPo() && !isCasRoute" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px]">
        <label class="form-label"> Invoice Source </label>
        <input v-if="form.status !== 0 && form.status !== -1 && form.status !== 5" v-model="form.invoiceSource"
          class="input" placeholder="" disabled />
        <select v-else v-model="form.invoiceSource" class="select">
          <option v-for="item of invoiceSourceList" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../../types/invoiceAddWrapper'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'
import { useLoginStore } from '@/stores/views/login'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'

const invoiceMasterApi = useInvoiceMasterDataStore()
const loginApi = useLoginStore()
const submissionApi = useInvoiceSubmissionStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

// const invoiceTypeNonPo = ref([
//   {
//     id: '1',
//     name: 'Non PO/Reimbursement',
//   },
//   {
//     id: '2',
//     name: 'Credit Card',
//   },
//   {
//     id: '3',
//     name: 'CAS',
//   },
//   {
//     id: '4',
//     name: 'LBA',
//   },
//   {
//     id: '5',
//     name: 'Petty Cash',
//   },
// ])

const currencyList = computed(() => {
  return invoiceMasterApi.currency
})
const companyCodeList = computed(() => invoiceMasterApi.companyCode)
const dpTypeList = computed(() => invoiceMasterApi.dpType)
const listInvoiceTypePo = computed(() => invoiceMasterApi.invoicePoType)
const listInvoiceTypeNonPo = computed(() => invoiceMasterApi.invoiceNonPoType)
const listMatrixApproval = computed(() => invoiceMasterApi.matrixApprovalList)
const listCashJournal = computed(() => invoiceMasterApi.cashJournalList)
const casNoCode = computed(() => submissionApi.casNoCode)
const invoiceSourceList = ref([
  { code: 'SRC1', name: '9801827192' },
  { code: 'SRC2', name: '9712648081' },
  { code: 'SRC3', name: '9312901872' },
])
const isReimbursement = computed(() => form?.invoiceType === '1')
const isCreditCard = computed(() => form?.invoiceType === '2')
const isCAS = computed(() => form?.invoiceType === '3')
const isLBA = computed(() => form?.invoiceType === '4')
const isPettyCash = computed(() => form?.invoiceType === '5')
const isCasRoute = computed(() => route.query.type === 'cas')
const isCasView = computed(() => route.query.type === 'non-po-view' && route.query.casType === 'cas')
const isReimbursementLike = computed(() => isReimbursement.value || isCasRoute.value)
const isCasLike = computed(() => isCAS.value && !isCasRoute.value)

const hrisTravelRequestList = ref(
  Array.from({ length: 10 }, (_, index) => `HR-TVL-${String(index + 1).padStart(6, '0')}`),
)

const mergedCasList = computed(() => {
  const apiList = casNoCode.value || []
  return [...apiList]
})

const remainingDpAmountVal = computed(() => {
  if (form.currency === 'IDR') {
    return useFormatIdr(form.remainingDpAmount)
  } else {
    return useFormatUsd(form.remainingDpAmount)
  }
})

const proposalAmountDisplay = ref('')

const formatWithDots = (value: string | number) => {
  if (value === null || value === undefined || value === '') return ''
  const digits = String(value).replace(/\D+/g, '')
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const unformat = (value: string) => {
  if (!value) return ''
  return String(value).replace(/\./g, '')
}

const onProposalInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const onlyDigits = target.value.replace(/\D+/g, '')
  proposalAmountDisplay.value = formatWithDots(onlyDigits)
  if (form) form.proposalAmountVal = onlyDigits
}

const onProposalBlur = () => {
  proposalAmountDisplay.value = formatWithDots(unformat(proposalAmountDisplay.value))
}

const onProposalPaste = (e: ClipboardEvent) => {
  const pasted = e.clipboardData?.getData('text') || ''
  const digits = pasted.replace(/\D+/g, '')
  proposalAmountDisplay.value = formatWithDots(digits)
  if (form) form.proposalAmountVal = digits
}

watch(
  () => form?.proposalAmountVal,
  (val) => {
    proposalAmountDisplay.value = formatWithDots(val || '')
  },
  { immediate: true },
)

const checkPo = () => {
  return typeForm.value === 'po' || typeForm.value === 'po-view'
}

const checkIsNonPo = () => {
  return route.query.type === 'nonpo' || route.query.type === 'non-po-view' || route.query.type === 'cas'
}

const removeDpValue = () => {
  if (form && form?.invoiceType !== '901') {
    form.invoiceDp = ''
  }
}

watch(
  () => form,
  () => {
    if (form?.invoiceType) {
      if (checkIsNonPo()) {
        const getIndex = listInvoiceTypeNonPo.value.findIndex(
          (item) => item.code === form.invoiceType,
        )
        if (getIndex !== -1) form.invoiceTypeName = listInvoiceTypeNonPo.value[getIndex].name
        if (isCasRoute.value) {
          form.invoiceTypeName = 'CAS Realization'
        }
      } else {
        const getIndex = listInvoiceTypePo.value.findIndex((item) => item.code === form.invoiceType)
        if (getIndex !== -1) form.invoiceTypeName = listInvoiceTypePo.value[getIndex].name
      }
    }

    if (form?.companyCode) {
      const getIndex = companyCodeList.value.findIndex((item) => item.code === form.companyCode)
      if (getIndex !== -1) form.companyName = companyCodeList.value[getIndex].name.split(' - ')[1]
    }

    if (form?.cashJournalCode && listCashJournal.value.length > 0) {
      const getIndex = listCashJournal.value.findIndex(
        (item) => item.cashJournalNo === form.cashJournalCode,
      )
      if (getIndex !== -1)
        form.cashJournalName = `${listCashJournal.value[getIndex].cashJournalNo} - ${listCashJournal.value[getIndex].cashJournalName}`
    }

    if (form?.casNoCode && mergedCasList.value.length > 0) {
      const getIndex = mergedCasList.value.findIndex((item) => item.casNo === form.casNoCode)
      if (getIndex !== -1) form.casNoName = mergedCasList.value[getIndex].casNo
    }
  },
  {
    deep: true,
  },
)

const loadCasItems = async (casNo: string) => {
  if (!form) return
  const response = await submissionApi.getCasItem(casNo)
  if (response.result && response.result.content) {
    // Map response to invoiceItemTypes
    const newItems = response.result.content.map((item, index: number) => {
      const itemAmount = Number(item.itemAmount || 0)
      const realizationAmount = 0
      const variance = itemAmount - realizationAmount
      return {
        id: index + 1, // Temporary ID or based on logic
        activity: item.activityId || null,
        activityCode: item.activityExpenses || '',
        activityName: item.activityName || '',
        itemAmount: itemAmount,
        itemText: item.itemText || '',
        debitCredit: item.debitCredit || '',
        taxCode: item.taxCode || '',
        vatAmount: item.vatAmount || 0,
        costCenter: item.costCenter || '',
        profitCenter: item.profitCenter || '',
        assignment: item.assignment || '',
        whtType: item.whtType || '',
        whtCode: item.whtCode || '',
        whtBaseAmount: String(item.whtBaseAmount || 0),
        whtAmount: String(item.whtAmount || 0),
        realizationAmount: realizationAmount,
        variance: variance,
        hasRealizationInput: true,
        isEdit: false,
      }
    })

    form.invoiceItem = newItems
  }
}

watch(
  () => isCasRoute.value,
  () => {
    if (isCasRoute.value && form) {
      form.companyCode = 'MF00'
      form.invoiceType = '4'
      form.invoiceTypeName = 'CAS Realization'
      if (route.query.casNo) {
        const casNo = String(route.query.casNo)
        form.casNoCode = casNo
        loadCasItems(casNo)
      }
      if (route.query.totalGrossAmount) {
        form.totalGrossAmount = Number(route.query.totalGrossAmount)
      }
      if (route.query.totalNetAmount) {
        form.totalNetAmount = Number(route.query.totalNetAmount)
      }
    }
  },
  { immediate: true },
)

watch(
  () => form?.invoiceType,
  (newType, oldType) => {
    if (newType === '3' && oldType !== '3') {
      form.casNoCode = ''
      form.invoiceVendorNo = ''
    }
    if (newType === '4' && oldType !== '4') {
      form.casNoCode = ''
      form.invoiceVendorNo = ''
    }
  },
)

watch(
  () => [form?.companyCode, form?.vendorId, form.invoiceType],
  () => {
    if (form.companyCode) {
      invoiceMasterApi.getActivity(form.companyCode || '')
      invoiceMasterApi.getCostCenter(form.companyCode || '')
    }
    if (form.companyCode && form.invoiceType)
      invoiceMasterApi.getMatrixApproval(form.invoiceType || '', form.companyCode || '')
    if (form.vendorId && form.companyCode) {
      const vendorIdStr = String(form.vendorId).trim()
      const companyCodeStr = String(form.companyCode).trim()
      if (
        vendorIdStr &&
        vendorIdStr !== '' &&
        vendorIdStr !== '0' &&
        companyCodeStr &&
        companyCodeStr !== ''
      ) {
        submissionApi.getCasNo(vendorIdStr, companyCodeStr).catch((error) => {
          if (error.response?.status !== 422) {
            console.error('Failed to fetch CAS No:', error)
          }
        })
      }
    }
    if (form.companyCode && form.invoiceType === '5') {
      invoiceMasterApi.getCashJournal(form.companyCode || '')
    }
    if (form?.companyCode) {
      const getIndex = companyCodeList.value.findIndex((item) => item.code === form.companyCode)
      if (getIndex !== -1) form.companyName = companyCodeList.value[getIndex].name.split(' - ')[1]
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => form?.casNoCode,
  async (newVal) => {
    if (newVal) {
      await loadCasItems(newVal)
    }
  },
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
  invoiceMasterApi.getCurrency()
  invoiceMasterApi.getCompanyCode()
  invoiceMasterApi.getDpTypes()
  if (form?.vendorId && form?.companyCode) {
    const vendorIdStr = String(form.vendorId).trim()
    const companyCodeStr = String(form.companyCode).trim()
    if (
      vendorIdStr &&
      vendorIdStr !== '' &&
      vendorIdStr !== '0' &&
      companyCodeStr &&
      companyCodeStr !== ''
    ) {
      submissionApi.getCasNo(vendorIdStr, companyCodeStr).catch((error) => {
        if (error.response?.status !== 422) {
          console.error('Failed to fetch CAS No:', error)
        }
      })
    }
  }
  if (form?.companyCode && form?.invoiceType === '5') {
    invoiceMasterApi.getCashJournal(form.companyCode || '')
  }
  if (form?.companyCode) {
    const getIndex = companyCodeList.value.findIndex((item) => item.code === form.companyCode)
    if (getIndex !== -1) form.companyName = companyCodeList.value[getIndex].name.split(' - ')[1]
  }

  console.log(form)
})
</script>
