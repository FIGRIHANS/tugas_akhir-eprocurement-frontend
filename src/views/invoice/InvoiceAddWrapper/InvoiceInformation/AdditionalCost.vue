<template>
  <div class="flex flex-col gap-[16px]">
    <p class="text-base font-semibold">Additional Cost</p>
    <button class="btn btn-outline btn-primary w-fit" @click="addNew">
      <i class="ki-duotone ki-plus-circle"></i>
      Add Additional Cost
    </button>
    <div v-if="form" class="overflow-x-auto cost__table">
      <table class="table table-xs table-border" :class="{ 'border-danger': form.additionalCostError }">
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
            <td>
              <input v-model="item.line" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.quantity" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.uom" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.amount" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <select v-model="item.costType" class="select" placeholder="">
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
              <input v-model="item.description" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.subTotal" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.taxCode" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.vatAmount" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.wht" class="input" placeholder="" type="text"/>
            </td>
            <td>
              <input v-model="item.whtAmount" class="input" placeholder="" type="text"/>
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
  'Line',
  'Quantity',
  'UOM',
  'Amount',
  'Cost Type',
  'Description',
  'Subtotal',
  'Tax Code',
  'VAT Amount',
  'WHT',
  'WHT Amount'
])

const form = inject<formTypes>('form')

const addNew = () => {
  if (form) {
    const data = {
      line: '',
      quantity: '',
      uom: '',
      amount: '',
      costType: '',
      subTotal: '',
      taxCode: '',
      vatAmount: '',
      wht: '',
      whtAmount: '',
      description: ''
    }
    form.additionalCost.push(data)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/additional-cost.scss';
</style>
