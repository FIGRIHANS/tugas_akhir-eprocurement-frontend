<template>
  <div v-if="form" class="flex flex-col gap-[24px]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div class="po__table">
      <table class="table table-xs table-border">
        <thead>
          <tr>
            <th 
              v-for="(item, index) in columns"
              :key="index"
              class="po__column"
              :class="{
                'po__column--desc': item.toLowerCase() === 'description',
                'po__column--aux': item.toLowerCase() === 'auxiliary part id',
                'po__column--medium': setMediumColumn(item)
              }"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.invoicePoGr" :key="index" class="po__items">
            <td>{{ item.line }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.uom }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.part }}</td>
            <td>{{ item.auxiliaryPartId }}</td>
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
  'Price',
  'Part',
  'Auxiliary Part ID',
  'Description',
  'Subtotal',
  'Tax Code',
  'VAT Amount',
  'WHT',
  'WHT Amount'
])

const setMediumColumn = (name: string) => {
  switch (name.toLowerCase()) {
    case 'price':
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
@use '../styles/invoice-po-gr.scss';
</style>
