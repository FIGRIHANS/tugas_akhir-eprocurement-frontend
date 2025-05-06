<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <button v-if="form?.status === 0" class="btn btn-outline btn-primary w-fit" @click="addNew">
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
              <button v-if="form.status === 0" class="btn btn-icon btn-outline btn-danger">
                <i class="ki-duotone ki-cross-circle"></i>
              </button>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.activity" class="input" placeholder="" disabled/>
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
              <input v-model="item.itemAmount" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.debitCredit" class="input" placeholder="" disabled/>
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
              <input v-if="!item.isEdit" v-model="item.activity" class="input" placeholder="" disabled/>
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
              <input v-if="!item.isEdit" v-model="item.taxCode" class="input" placeholder="" disabled/>
              <select v-else v-model="item.taxCode" class="select" placeholder="">
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
              <input v-if="!item.isEdit" v-model="item.costCenter" class="input" placeholder="" disabled/>
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
              <input v-if="!item.isEdit" v-model="item.profitCenter" class="input" placeholder="" disabled/>
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
              <input v-model="item.assignment" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-if="!item.isEdit" v-model="item.whtType" class="input" placeholder="" disabled/>
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
              <input v-if="!item.isEdit" v-model="item.whtCode" class="input" placeholder="" disabled/>
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
              <input v-model="item.whtBaseAmount" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
            <td>
              <input v-model="item.amount" class="input" placeholder="" :disabled="!item.isEdit"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

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

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      activity: '',
      itemAmount: '',
      debitCredit: '',
      taxCode: '',
      costCenter: '',
      profitCenter: '',
      assignment: '',
      whtType: '',
      whtCode: '',
      whtBaseAmount: '',
      amount: '',
      isEdit: false
    }
    form.additionalCost.push(data)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
