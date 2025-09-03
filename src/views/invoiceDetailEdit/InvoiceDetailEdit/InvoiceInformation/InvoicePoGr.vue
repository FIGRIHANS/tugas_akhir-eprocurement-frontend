<template>
  <div id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice PO & GR Item</p>
    <div v-if="form?.invoiceTypeCode !== 902">
      <div v-if="form" class="overflow-x-auto pogr__table">
        <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
          <thead>
            <tr>
              <th
                v-for="(item, index) in setColumn(form?.invoiceTypeCode)"
                :key="index"
                class="pogr__field-base"
                :class="{
                  'pogr__field-base--po-item': item.toLowerCase() === 'item text',
                  'pogr__field-base--tax': item.toLowerCase() === 'tax code'
                }"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
              <td class="flex items-center justify-around gap-[8px]">
                <button class="btn btn-outline btn-icon btn-primary" :disabled="checkIsEdit() && !item.isEdit" @click="goEdit(item)">
                  <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                  <i v-else class="ki-duotone ki-check-circle"></i>
                </button>
                <button v-if="item.isEdit" class="btn btn-icon btn-outline btn-danger" @click="resetItem(item)">
                  <i class="ki-duotone ki-cross-circle"></i>
                </button>
              </td>
              <td>{{ item.poNo }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.grDocumentNo }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.grDocumentItem }}</td>
              <td v-if="!checkInvoiceDp()">{{ moment(item.grDocumentDate).format('YYYY/MM/DD') }}</td>
              <td v-if="!checkInvoiceDp()">{{ form.currCode === 'IDR' ? useFormatIdr(item.itemAmount) : useFormatUsd(item.itemAmount) }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.uom }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
              <td v-if="!checkInvoiceDp()">{{ item.conditionType }}</td>
              <td v-if="!checkInvoiceDp() && form?.invoiceTypeCode !== 903">{{ item.conditionTypeDesc }}</td>
              <td v-if="!checkInvoiceDp() && form?.invoiceTypeCode !== 903">{{ item.qcStatus }}</td>
              <td v-if="checkInvoiceDp()">
                <span v-if="!item.isEdit">{{ form.currCode === 'IDR' ? useFormatIdr(item.itemAmount) : useFormatUsd(item.itemAmount) }}</span>
                <input v-else v-model="formEdit.itemAmount" type="number" class="input" />
              </td>
              <td>
                <span v-if="!item.isEdit">{{ getTaxCodeName(item.taxCode) }}</span>
                <v-select
                  v-else
                  v-model="formEdit.taxCode"
                  class="customSelect"
                  :get-option-label="(option: any) => `${option.code} - ${option.name}`"
                  :reduce="(option: any) => option.code"
                  :options="listTaxCalculation"
                  appendToBody
                ></v-select>
              </td>
              <td v-if="!checkPoPib()">
                {{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.vatAmount : item.vatAmount) : useFormatUsd(item.isEdit ? formEdit.vatAmount : item.vatAmount) }}
              </td>
              <td>
                <span v-if="!item.isEdit">{{ item.whtType }}</span>
                <v-select
                  v-else
                  v-model="formEdit.whtType"
                  class="customSelect"
                  label="name"
                  :reduce="(option: any) => option.code"
                  :options="whtTypeList"
                  appendToBody
                  @update:modelValue="callWhtCode(item)"
                ></v-select>
              </td>
              <td>
                <span v-if="!item.isEdit">{{ item.whtCode }}</span>
                <v-select
                  v-else
                  v-model="formEdit.whtCode"
                  class="customSelect"
                  label="whtCode"
                  :reduce="(option: any) => option.whtCode"
                  :options="whtCodeList"
                  appendToBody
                  @update:modelValue="setWhtAmount(item)"
                ></v-select>
              </td>
              <td>
                <span v-if="!item.isEdit">{{ form.currCode === 'IDR' ? useFormatIdr(item.whtBaseAmount) : useFormatUsd(item.whtBaseAmount) }}</span>
                <input v-else v-model="formEdit.whtBaseAmount" class="input" type="number" placeholder=""/>
              </td>
              <td>
                <span>{{ form.currCode === 'IDR' ? useFormatIdr(item.isEdit ? formEdit.whtAmount : item.whtAmount) : useFormatUsd(item.isEdit ? formEdit.whtAmount : item.whtAmount) }}</span>
              </td>
              <td>{{ item.department }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Invoice PO & Gr Add Item Manual -->
    <div v-else>
      <div v-if="form" class="overflow-x-auto pogr__table">
        <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
          <thead>
            <tr>
              <th v-for="(item, index) in setColumn(form?.invoiceTypeCode)" :key="index" class="pogr__field-base" :class="{
                'pogr__field-base--po-number': item.toLowerCase() === 'po number',
                'pogr__field-base--po-item': item.toLowerCase() === 'po item',
              }">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="form.invoicePoGr.length === 0">
              <td colspan="11" class="text-center text-[13px]">No Data Available</td>
            </tr>
            <template v-else>
              <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
                <td class="flex items-center justify-around gap-[8px]">
                  <button class="btn btn-outline btn-icon btn-primary" @click="goEdit(item)">
                    <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                    <i v-else class="ki-duotone ki-check-circle"></i>
                  </button>
                  <button v-if="item.isEdit" class="btn btn-icon btn-outline btn-danger" @click="resetItem(item)">
                    <i class="ki-duotone ki-cross-circle"></i>
                  </button>
                </td>
                <td>
                  <span v-if="!item.isEdit">{{ item.poNo }}</span>
                  <input v-else v-model="item.poNo" class="input" placeholder=""
                    :class="{ 'border-danger': !item.poNo }"/>
                  <p v-if="!item.poNo && item.isEdit" class="text-danger text-[9px]">*PO Number must be at least 10 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.poItem }}</span>
                  <input v-else v-model="item.poItem" class="input" placeholder=""
                    :class="{ 'border-danger': !item.poItem }" />
                  <p v-if="!item.poItem && item.isEdit" class="text-danger text-[9px]">*PO Item must be at least 2 digits</p>
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.itemAmount }}</span>
                  <input v-else v-model="item.itemAmount" class="input" placeholder=""
                     />
                  <!-- <p v-if="!item.itemAmount && item.isEdit" class="text-danger text-[9px]">*Item Amount be at least 1 digits</p> -->
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.quantity }}</span>
                  <input v-else v-model="item.quantity" class="input" placeholder=""
                     />
                  <!-- <p v-if="!item.quantity && item.isEdit" class="text-danger text-[9px]">*Item Quantity be at least 1 digits</p> -->
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.uom || '-' }}</span>
                  <input v-else v-model="item.uom" class="input" placeholder=""
                     />
                  <!-- <p v-if="!item.uom && item.isEdit" class="text-danger text-[9px]">*Item Unit be at least 3 digits</p> -->
                </td>
                <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.itemText}}</span>
                  <input v-else v-model="item.itemText" class="input" placeholder=""
                     />
                  <!-- <p v-if="!item.itemText && item.isEdit" class="text-danger text-[9px]">*Item Quantity be at least 1 digits</p> -->
                </td>
                <!-- <td v-if="!checkInvoiceDp()">
                  <span v-if="!item.isEdit">{{ item.department || '-' }}</span>
                  
                  <select v-else v-model="item.department" class="select" name="select">
                    <option v-for="item of costCenterList" :key="item.code" :value="item.code">
                      {{ item.code }}
                    </option>
                  </select>
                </td> -->
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject, watch, onMounted, type Ref } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { defaultColumn, PoPibColumn, invoiceDpColumn, poCCColumn } from '@/static/invoicePoGr'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr, useFormatUsd } from '@/composables/currency'
import type { itemsPoGrType } from '../../types/invoicePoGr'
import moment from 'moment'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<Ref<formTypes>>('form')
const columns = ref<string[]>([])
const formEdit = reactive({
  itemAmount: 0,
  taxCode: '',
  vatAmount: 0,
  whtType: '',
  whtCode: '',
  whtBaseAmount: 0,
  whtAmount: 0
})

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)
const whtTypeList = computed(() => invoiceMasterApi.whtTypeList)
const whtCodeList = computed(() => invoiceMasterApi.whtCodeList)

const checkIsEdit = () => {
  const result = form?.value.invoicePoGr.findIndex((item) => item.isEdit)
  return result !== -1
}

const checkInvoiceDp = () => {   
  return form?.value.invoiceDPCode === 9012 
}

const checkPoPib = () => {
  return form?.value.invoiceTypeCode === 902
}

const resetFormEdit = () => {
  formEdit.itemAmount = 0
  formEdit.taxCode = ''
  formEdit.vatAmount = 0
  formEdit.whtType = ''
  formEdit.whtCode = ''
  formEdit.whtBaseAmount = 0
  formEdit.whtAmount = 0
}

const goEdit = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.itemAmount = item.itemAmount
    formEdit.taxCode = item.taxCode
    formEdit.vatAmount = item.vatAmount
    formEdit.whtType = item.whtType
    formEdit.whtCode = item.whtCode
    formEdit.whtBaseAmount = item.whtBaseAmount
    formEdit.whtAmount = item.whtAmount
  } else {
    item.itemAmount = formEdit.itemAmount
    item.taxCode = formEdit.taxCode
    item.vatAmount = formEdit.vatAmount
    item.whtType = formEdit.whtType
    item.whtCode = formEdit.whtCode
    item.whtBaseAmount = formEdit.whtBaseAmount
    item.whtAmount = formEdit.whtAmount
    resetFormEdit()
  }
}

const resetItem = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit
  resetFormEdit()
}

const setColumn = (type: number) => {  
  if (type === 902) columns.value = ['Action', ...PoPibColumn]
  else if (type === 903) columns.value = ['Action', ...poCCColumn]
  else if (checkInvoiceDp()) columns.value = ['Action', ...invoiceDpColumn]
  else columns.value = ['Action', ...defaultColumn]

  return columns.value
}

const getWhtCode = (data: itemsPoGrType, whtType: string) => {
  invoiceMasterApi.getWhtCode(whtType).then(() => {
    data.whtCodeList = whtCodeList.value
  })
}


const callWhtCode = (data: itemsPoGrType) => {
  formEdit.whtCode = ''
  data.whtCodeList = []
  if (formEdit.whtType && formEdit.whtType !== '-') getWhtCode(data, formEdit.whtType)
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
  const checkIsEdit = form.value.invoicePoGr.findIndex((item) => item.isEdit)
  if (checkIsEdit !== -1) {
    const percentTax = getPercentTax(formEdit.taxCode) || 0
    const itemAmount = formEdit.itemAmount
    const result = percentTax * itemAmount
    formEdit.vatAmount = result
  } else {
    for (const item of form.value.invoicePoGr) {
      const percentTax = getPercentTax(item.taxCode) || 0
      const itemAmount = item.itemAmount
      const result = percentTax * itemAmount
      item.vatAmount = result
    }
  }
}

const setWhtAmount = (data: itemsPoGrType) => {
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

const getTaxCodeName = (taxCode: string) => {
  const index = listTaxCalculation.value.findIndex((item) => item.code === taxCode)
  if (index !== -1) {
    const data = listTaxCalculation.value[index]
    return `${data.code} - ${data.name}`
  }
  return '-'
}

watch(
  () => [form?.value.invoiceDPCode, form?.value.invoiceTypeCode],
  () => {
    setColumn(form?.value.invoiceTypeCode || 0)
  },
  {
    immediate: true
  }
)

watch(
  () => [form?.value.invoicePoGr, form?.value.currCode, formEdit],
  () => {
    if (!checkPoPib()) getVatAmount()
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  if (form) {
    setColumn(form.value.invoiceTypeCode || 0)
  
    for (const item of form.value.invoicePoGr) {
      if (item.whtType && item.whtType !== '-') getWhtCode(item, item.whtType)
      item.whtBaseAmount = item.itemAmount
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
