<template>
  <div id="table-invoice-po-gr" class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Invoice PO & GR Item</p>
    <div v-if="form" class="overflow-x-auto pogr__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form?.invoicePoGrError }">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="pogr__field-base"
              :class="{
                'pogr__field-base--po-item': item.toLowerCase() === 'item text'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="pogr__field-items">
            <td class="flex items-center justify-around gap-[8px]">
              <button v-if="form.status === 0" class="btn btn-outline btn-icon btn-primary" @click="goEdit(item)">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button v-if="item.isEdit" class="btn btn-icon btn-outline btn-danger" @click="resetItem(item)">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>{{ item.poNumber }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentNo }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentDate }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemAmount }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.unit }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
            <td>
              <span v-if="!item.isEdit">{{ item.taxCode }}</span>
              <select v-else v-model="formEdit.taxCode" class="select" placeholder="">
                <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.code">
                  {{ option.code }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtType }}</span>
              <select v-else v-model="formEdit.whtType" class="select" placeholder="">
                <option value="1">
                  Option 1
                </option>
                <option value="2">
                  Option 2
                </option>
                <option value="3">
                  Option 3
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtCode }}</span>
              <select v-else v-model="formEdit.whtCode" class="select" placeholder="">
                <option value="1">
                  Option 1
                </option>
                <option value="2">
                  Option 2
                </option>
                <option value="3">
                  Option 3
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ useFormatIdr(item.whtBaseAmount) }}</span>
              <input v-else v-model="formEdit.whtBaseAmount" class="input" type="number" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ useFormatIdr(item.whtAmount) }}</span>
              <input v-else v-model="formEdit.whtAmount" class="input" type="number" placeholder=""/>
            </td>
            <td>{{ item.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'
import { useFormatIdr } from '@/composables/currency'
import type { itemsPoGrType } from '../../types/invoicePoGr'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const columns = ref<string[]>([])
const formEdit = reactive({
  taxCode: '',
  whtType: '',
  whtCode: '',
  whtBaseAmount: '',
  whtAmount: ''
})

const listTaxCalculation = computed(() => invoiceMasterApi.taxList)

const checkInvoiceDp = () => {
  return form?.invoiceDp === 'IDP'
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

const resetFormEdit = () => {
  formEdit.taxCode = ''
  formEdit.whtType = ''
  formEdit.whtCode = ''
  formEdit.whtBaseAmount = ''
  formEdit.whtAmount = ''
}

const goEdit = (item: itemsPoGrType) => {
  item.isEdit = !item.isEdit

  if (item.isEdit) {
    formEdit.taxCode = item.taxCode
    formEdit.whtType = item.whtType
    formEdit.whtCode = item.whtCode
    formEdit.whtBaseAmount = item.whtBaseAmount
    formEdit.whtAmount = item.whtAmount
  } else {
    item.taxCode = formEdit.taxCode
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

const setColumn = () => {
  if (form?.invoiceType === 'pib') columns.value = ['Action', ...PoPibColumn]
  else if (form?.invoiceDp === 'IDP') columns.value = ['Action', ...invoiceDpColumn]
  else columns.value = ['Action', ...defaultColumn]
}

watch(
  () => [form?.invoiceDp, form?.invoiceType],
  () => {
    setColumn()
  },
  {
    immediate: true
  }
)

onMounted(() => {
  setColumn()
})
</script>

<style lang="scss" scoped>
@use '../../styles/invoice-po-gr.scss';
</style>
