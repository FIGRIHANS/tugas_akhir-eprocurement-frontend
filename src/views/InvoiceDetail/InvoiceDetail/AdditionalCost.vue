<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Additional Cost</p>
    <div class="cost__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th
              v-for="(item, index) in columns"
              :key="index"
              class="cost__column"
              :class="{
                'cost__column--desc': item.toLowerCase() === 'description',
                'cost__column--medium': setMediumColumn(item)
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.additionalCost" :key="index" class="cost__items">
            <td>{{ item.line }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.uom }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.costType }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.subTotal }}</td>
            <td>{{ item.taxCode }}</td>
            <td>{{ item.vatAmount }}</td>
            <td>{{ item.wht }}</td>
            <td>{{ item.whtAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { formTypes } from '../types/invoiceDetail'

const form = inject<formTypes>('form')

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

const setMediumColumn = (name: string) => {
  switch (name.toLowerCase()) {
    case 'amount':
      return true
    case 'cost type':
      return true
    case 'vat amount':
      return true
    case 'tax code':
      return true
    case 'wht amount':
      return true
    default:
      return false
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/additional-cost.scss';
</style>
