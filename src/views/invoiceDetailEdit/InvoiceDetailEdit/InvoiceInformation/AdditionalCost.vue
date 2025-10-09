<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <button v-if="!checkVerifikator1()" class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add Additional Cost
    </button>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__field-base"
              :class="{
                'cost__field-base--activity': item.toLowerCase() === 'activity / expense',
                'cost__field-base--tax': item.toLowerCase() === 'tax code',
                'cost__field-base--cost': item.toLowerCase() === 'cost center',
                'cost__field-base--wht-type': item.toLowerCase() === 'wht type',
                'cost__field-base--wht-code': item.toLowerCase() === 'wht code',
                'cost__field-base--description': item.toLowerCase() === 'description'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCosts" :key="index" class="cost__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button class="btn btn-outline btn-icon btn-primary" :disabled="checkIsEdit() && !item.isEdit" @click="goEdit(item)">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button class="btn btn-icon btn-outline btn-danger" @click="resetItem(item, index)">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getActivityName(item.activityId) }}</span>
              <v-select
                v-else
                v-model="formEdit.activityExpense"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.id"
                :options="listActivity"
                :error="{ 'error-select': formEdit.isActivityError }"
                appendToBody
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">
                {{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.itemAmount : item.itemAmount) : useFormatUsd(item.isEdit ? formEdit.itemAmount : item.itemAmount) }}
              </span>
              <input
                v-else
                v-model="formEdit.itemAmount"
                class="input"
                type="number"
                placeholder=""
                :class="{ 'border-danger': formEdit.isItemAmountError }"
                @change="formEdit.whtBaseAmount = formEdit.itemAmount"
              />
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.debitCredit }}</span>
              <select v-else v-model="formEdit.debitCredit" class="select" placeholder="" :class="{ 'border-danger': formEdit.isDebitCreditError }">
                <option value="D">
                  Debit
                </option>
                <option value="K">
                  Credit
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) }}</span>
              <v-select
                v-else
                v-model="formEdit.taxCode"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="listTaxCalculation"
                appendToBody
              ></v-select>
            </td>
            <td>
              {{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.vatAmount : item.vatAmount) : useFormatUsd(item.isEdit ? formEdit.vatAmount : item.vatAmount) }}
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getCostCenterName(item.costCenter) }}</span>
              <v-select
                v-else
                v-model="formEdit.costCenter"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="costCenterList"
                appendToBody
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.profitCenter }}</span>
              <select v-else v-model="formEdit.profitCenter" class="select" placeholder="">
                <option v-for="item of profitCenter" :key="item.code" :value="item.code">
                  {{ item.name }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.assignment }}</span>
              <input v-else v-model="formEdit.assignment" class="input" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getWhtTypeName(item.whtType) }}</span>
              <v-select
                v-else
                v-model="formEdit.whtType"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                :reduce="(option: any) => option.code"
                :options="whtTypeList"
                appendToBody
                @update:modelValue="callWhtCode(item)"
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ getWhtCodeName(item.whtCode, item) }}</span>
              <v-select
                v-else
                v-model="formEdit.whtCode"
                class="customSelect"
                placeholder="Select"
                :get-option-label="(option: any) => `${option.whtCode} - ${option.description}`"
                :reduce="(option: any) => option.whtCode"
                :options="whtCodeList"
                appendToBody
                @update:modelValue="setWhtAmount(item)"
              ></v-select>
            </td>
            <td>
              <span v-if="!item.isEdit">
                {{ form.currCode === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) }}
              </span>
              <input v-else v-model="formEdit.whtBaseAmount" class="input" type="number" placeholder="" @change="setWhtAmount(item)"/>
            </td>
            <td>
              <span v-if="!item.isEdit || (item.isEdit && !checkVerifikator2())">{{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.whtAmount : item.whtAmount) : useFormatUsd(item.isEdit ? formEdit.whtAmount : item.whtAmount) }}</span>
              <input v-if="(item.isEdit && !checkPoPib()) || (item.isEdit && checkVerifikator2() && checkPoPib())" v-model="formEdit.whtAmount" class="input" type="number" placeholder=""/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, inject, onMounted, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import type { itemsCostType } from '../../types/additionalCost'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useInvoiceVerificationStore } from '@/stores/views/invoice/verification'
import { useLoginStore } from '@/stores/views/login'

const invoiceMasterApi = useInvoiceMasterDataStore()
const verificationApi = useInvoiceVerificationStore()
const loginApi = useLoginStore()
const form = inject<Ref<formTypes>>('form')
const columns = ref([
  'Action',
  'Activity / Expense',
  'Item Amount',
  'Debit/Credit',
  'Tax Code',
  'VAT Amount',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'WHT Amount'
])
const formEdit = reactive({
  activityExpense: null,
  itemAmount: 0,
  debitCredit: '',
  taxCode: '',
  vatAmount: 0,
  costCenter: '',
  profitCenter: '',
  assignment: '',
  whtType: '',
  whtCode: '',
  whtBaseAmount: 0,
  whtAmount: 0,
  isActivityError: false,
  isItemAmountError: false,
  isDebitCreditError: false
})

const listActivity = computed(() => invoiceMasterApi.activityList)
const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const costCenterList = computed(() => invoiceMasterApi.costCenterList)
const profitCenter = computed(() => invoiceMasterApi.profilCenterList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)
const userData = computed(() => loginApi.userData)

const checkIsEdit = () => {
  const result = form?.value.additionalCosts.findIndex((item) => item.isEdit)
  return result !== -1
}

const checkPoPib = () => {
  return form?.value.invoiceTypeCode === 902
}

const checkVerifikator1 = () => {
  return userData.value.profile.profileId === 3190
}

const checkVerifikator2 = () => {
  return userData.value.profile.profileId === 3002
}

const addNew = () => {
  if (form) {
    const data = {
      id: 0,
      activityId: null,
      activityExpense: '',
      activityName: '',
      itemAmount: 0,
      debitCredit: '',
      taxCode: '',
      vatAmount: 0,
      costCenter: '',
      profitCenter: '',
      assignment: '',
      whtType: '',
      whtCode: '',
      whtBaseAmount: 0,
      whtAmount: 0,
      whtCodeList: [],
      isEdit: false
    }
    form.value.additionalCosts.push(data)
  }
}

const resetFormEdit = () => {
  formEdit.activityExpense = null
  formEdit.itemAmount = 0
  formEdit.debitCredit = ''
  formEdit.taxCode = ''
  formEdit.vatAmount = 0
  formEdit.costCenter = ''
  formEdit.profitCenter = ''
  formEdit.assignment = ''
  formEdit.whtType = ''
  formEdit.whtCode = ''
  formEdit.whtBaseAmount = 0
  formEdit.whtAmount = 0
  formEdit.isActivityError = false
  formEdit.isItemAmountError = false
  formEdit.isDebitCreditError = false
}

const goEdit = (item: itemsCostType) => {
  if (item.isEdit) {
    if (!formEdit.activityExpense) formEdit.isActivityError = true
    else formEdit.isActivityError = false

    if (!formEdit.itemAmount || formEdit.itemAmount < 0) formEdit.isItemAmountError = true
    else formEdit.isItemAmountError = false

    if (!formEdit.debitCredit) formEdit.isDebitCreditError = true
    else formEdit.isDebitCreditError = false
  }
  if (
    formEdit.isActivityError ||
    formEdit.isItemAmountError ||
    formEdit.isDebitCreditError
  ) return
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.activityExpense = item.activityId
    formEdit.itemAmount = item.itemAmount
    formEdit.debitCredit = item.debitCredit
    formEdit.taxCode = item.taxCode
    formEdit.vatAmount = item.vatAmount
    formEdit.costCenter = item.costCenter
    formEdit.profitCenter = item.profitCenter
    formEdit.assignment = item.assignment
    formEdit.whtType = item.whtType
    formEdit.whtCode = item.whtCode
    formEdit.whtBaseAmount = item.whtBaseAmount
    formEdit.whtAmount = item.whtAmount
  } else {
    const itemIndex = listActivity.value.findIndex((sub) => sub.id === formEdit.activityExpense)
    item.activityId = formEdit.activityExpense
    item.activityExpense = listActivity.value[itemIndex].code
    item.activityName = listActivity.value[itemIndex].name
    item.itemAmount = formEdit.itemAmount
    item.debitCredit = formEdit.debitCredit
    item.taxCode = formEdit.taxCode
    item.vatAmount = formEdit.vatAmount
    item.costCenter = formEdit.costCenter
    item.profitCenter = formEdit.profitCenter
    item.assignment = formEdit.assignment
    item.whtType = formEdit.whtType
    item.whtCode = formEdit.whtCode
    item.whtBaseAmount = formEdit.whtBaseAmount
    item.whtAmount = formEdit.whtAmount
    resetFormEdit()
  }
}

const resetItem = (item: itemsCostType, index: number) => {
  if (item.isEdit) {
    item.isEdit = !item.isEdit
    resetFormEdit()
  } else {
    if (form) {
      verificationApi.additionalCostTempDelete?.push(form.value.additionalCosts[index].id)
      form.value.additionalCosts.splice(index, 1)
    }
  }
}

const callWhtCode = (data: itemsCostType) => {
  formEdit.whtCode = ''
  formEdit.whtAmount = 0
  data.whtCodeList = []
  invoiceMasterApi.getWhtCode(formEdit.whtType).then(() => {
    data.whtCodeList = whtCodeList.value
  })
}

const getPercentTax = (code: string) => {
  if (code === 'V0') return 0
  const getIndex = listTaxCalculation.value.findIndex((item) => item.code === code)
  if (getIndex !== -1) {
    const splitName = listTaxCalculation.value[getIndex].name.split(' - ')
    return parseFloat(splitName[1].replace(',', '.').replace('%','')) / 100
  }
}

const getVatAmount = () => {
  if (!form) return
  const checkIsEdit = form.value.additionalCosts.findIndex((item) => item.isEdit)
  if (checkIsEdit !== -1) {
    const percentTax = getPercentTax(formEdit.taxCode) || 0
    const itemAmount = formEdit.itemAmount
    const result = percentTax * itemAmount
    formEdit.vatAmount = result
  } else {
    for (const item of form.value.additionalCosts) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = item.itemAmount
      const result = percentTax * itemAmount
      item.vatAmount = result
    }
  }
}

const getCostCenterName = (costCenter: string) => {
  const index = costCenterList.value.findIndex((item) => item.code === costCenter)
  if (index !== -1) {
    const data = costCenterList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getActivityName = (id: number) => {
  const getIndex = listActivity.value.findIndex((item) => item.id === id)
  if (getIndex !== -1) return `${listActivity.value[getIndex].code} - ${listActivity.value[getIndex].name}`
}

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getWhtTypeName = (code: string) => {
  const index = whtTypeList.value.findIndex((item) => item.code === code)
  if (index !== -1) {
    const data = whtTypeList.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

const getWhtCodeName = (code: string, data: itemsCostType) => {
  const index = data.whtCodeList.findIndex((item) => item.whtCode === code)
  if (index !== -1) {
    const detailData = data.whtCodeList[index]
    return `${detailData.whtCode} - ${detailData.description}`
  }
  return '-'
}

const setWhtAmount = (data: itemsCostType) => {
  if (formEdit.whtCode) {
    const whtlist = data.whtCodeList || []
    const indexWht = whtlist.findIndex((item) => item.whtCode === formEdit.whtCode)
    if (indexWht !== -1) {
      const tarif = whtlist[indexWht].tarif / 100
      formEdit.whtAmount = tarif * formEdit.whtBaseAmount
    }
  } else {
    formEdit.whtAmount = 0
  }
}

watch(
  () => [form?.value.additionalCosts, form?.value.invoiceItem, form?.value.currCode, formEdit],
  () => {
    getVatAmount()
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  for (const item of form.value.additionalCosts) {
    if (item.whtCode) {
      invoiceMasterApi.getWhtCode(item.whtType).then(() => {
        item.whtCodeList = whtCodeList.value
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
