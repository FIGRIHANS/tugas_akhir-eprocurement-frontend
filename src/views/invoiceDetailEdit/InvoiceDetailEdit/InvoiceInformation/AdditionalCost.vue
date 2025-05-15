<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__field-base"
              :class="{
                'cost__field-base--description': item.toLowerCase() === 'description'
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCost" :key="index" class="cost__field-items">
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
              <span v-if="!item.isEdit">{{ item.activity }}</span>
              <select v-else v-model="item.activity" class="select" placeholder="">
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
              <span v-if="!item.isEdit">{{ item.itemAmount }}</span>
              <input v-else v-model="item.itemAmount" class="input" placeholder=""/>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.debitCredit }}</span>
              <select v-else v-model="item.debitCredit" class="select" placeholder="">
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
              <span v-if="!item.isEdit">{{ item.taxCode }}</span>
              <select v-else v-model="item.taxCode" class="select" placeholder="">
                <option v-for="(option, index) in listTaxCalculation" :key="index" :value="option.id">
                  {{ option.id }}
                </option>
              </select>
            </td>
            <td>
              <span v-if="!item.isEdit">{{ item.costCenter }}</span>
              <select v-else v-model="item.costCenter" class="select" placeholder="">
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
              <span v-if="!item.isEdit">{{ item.profitCenter }}</span>
              <select v-else v-model="item.profitCenter" class="select" placeholder="">
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
              <span v-if="!item.isEdit">{{ item.assignment }}</span>
              <input v-else v-model="item.assignment" class="input" placeholder=""/>
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
            <td>
              <span v-if="!item.isEdit">{{ item.amount }}</span>
              <input v-else v-model="item.amount" class="input" placeholder=""/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import type { formTypes } from '../../types/invoiceDetailEdit'
import { useInvoiceSubmissionStore } from '@/stores/views/invoice/submission'

const invoiceApi = useInvoiceSubmissionStore()
const form = inject<formTypes>('form')
const columns = ref([
  'Action',
  'Activity / Expense',
  'Item Amount',
  'Debit/Credit',
  'Tax Code',
  'Cost Center',
  'Profit Center',
  'Assignment',
  'WHT Type',
  'WHT Code',
  'WHT Base Amount',
  'Amount'
])

const listTaxCalculation = computed(() => invoiceApi.taxCalculationList)

const deleteItem = (index: number) => {
  form?.additionalCost.splice(index, 1)
}
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
