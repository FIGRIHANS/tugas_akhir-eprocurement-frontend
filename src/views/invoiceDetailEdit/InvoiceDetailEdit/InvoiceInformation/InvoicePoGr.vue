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
              <button v-if="form.status === 0" class="btn btn-icon btn-primary" @click="item.isEdit = !item.isEdit">
                <i v-if="!item.isEdit" class="ki-duotone ki-notepad-edit"></i>
                <i v-else class="ki-duotone ki-check-circle"></i>
              </button>
              <button v-if="form.status === 0" class="btn btn-icon btn-outline btn-danger" @click="deleteItem(index)">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <div v-if="checkInvoiceDp()">
                <span v-if="!item.isEdit">{{ item.poNumber }}</span>
                <input v-else v-model="item.poNumber" class="input" placeholder=""/>
              </div>
              <span v-else>{{ item.poNumber }}</span>
            </td>
            <td v-if="!checkInvoiceDp()">{{ item.poItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentNo }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentItem }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.GrDocumentDate }}</td>
            <td>
              <span v-if="!item.isEdit">{{ item.taxCode }}</span>
              <select v-else v-model="item.taxCode" class="select" placeholder="">
                <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.id">
                  {{ option.id }}
                </option>
              </select>
            </td>
            <td v-if="!checkInvoiceDp()">
              <span v-if="!item.isEdit">{{ item.itemAmount }}</span>
              <input v-else v-model="item.itemAmount" class="input" placeholder=""/>
            </td>
            <td v-if="!checkInvoiceDp()">{{ item.quantity }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.unit }}</td>
            <td v-if="!checkInvoiceDp()">{{ item.itemText }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.conditionType }}</td>
            <td v-if="checkInvoiceDp()">
              <span v-if="!item.isEdit">{{ item.amountInvoice }}</span>
              <input v-else v-model="item.amountInvoice" class="input" placeholder=""/>
            </td>
            <td v-if="checkInvoiceDp()">
              <span v-if="!item.isEdit">{{ item.vatAmount }}</span>
              <input v-else v-model="item.vatAmount" class="input" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.whtType }}</span>
              <select v-else v-model="item.whtType" class="select" placeholder="">
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
              <select v-else v-model="item.whtCode" class="select" placeholder="">
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
              <span v-if="!item.isEdit">{{ item.whtBaseAmount }}</span>
              <input v-else v-model="item.whtBaseAmount" class="input" placeholder=""/>
            </td>
            <td>{{ item.category }}</td>
            <td v-if="!checkInvoiceDp() && !checkPoPib()">{{ item.totalNetAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { defaultColumn, invoiceDpColumn, PoPibColumn } from '@/static/invoicePoGr'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'

const invoiceApi = useInvoiceSubmissionStore()
const form = inject<formTypes>('form')
const columns = ref<string[]>([])

const listTaxCalculation = computed(() => invoiceApi.taxCalculationList)

const checkInvoiceDp = () => {
  return form?.invoiceDp
}

const checkPoPib = () => {
  return form?.invoiceType === 'pib'
}

const deleteItem = (index: number) => {
  if (form) {
    form.invoicePoGr.splice(index, 1)
  }
}

const setColumn = () => {
  if (form?.invoiceType === 'pib') columns.value = ['Action', ...PoPibColumn]
  else if (form?.invoiceDp) columns.value = ['Action', ...invoiceDpColumn]
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
