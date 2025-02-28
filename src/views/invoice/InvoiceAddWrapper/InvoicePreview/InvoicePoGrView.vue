<template>
  <div v-if="form" class="flex flex-col gap-[24px] w-[80%]">
    <p class="text-lg font-semibold m-[0px]">Invoice PO & GR Item</p>
    <div v-for="(item, index) in form.invoicePoGr" :key="index" class="flex flex-col gap-[24px]">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-normal text-gray-700">Line</p>
          <p class="text-sm font-medium">{{ item.line }}</p>
        </div>
        <div class="w-[89px]">
          <p class="text-xs font-normal text-gray-700">Quantity</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ item.quantity }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-normal text-gray-700">UOM</p>
          <p class="text-sm font-medium">{{ item.uom }}</p>
        </div>
        <div class="w-[89px]">
          <p class="text-xs font-normal text-gray-700">Price</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ item.price }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-normal text-gray-700">Part</p>
          <p class="text-sm font-medium">{{ item.part }}</p>
        </div>
        <div class="w-[89px]">
          <p class="text-xs font-normal text-gray-700">Auxiliary Part ID</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ item.auxiliaryPartId }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-normal text-gray-700">Subtotal</p>
          <p class="text-sm font-medium">{{ item.subTotal }}</p>
        </div>
        <div class="w-[89px]">
          <p class="text-xs font-normal text-gray-700">Tax Code</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ item.taxCode }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-normal text-gray-700">VAT Amount</p>
          <p class="text-sm font-medium">{{ item.vatAmount }}</p>
        </div>
        <div class="w-[89px]">
          <p class="text-xs font-normal text-gray-700">WHT</p>
          <p class="text-sm font-medium whitespace-nowrap">{{ item.wht }}</p>
        </div>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">WHT Amount</p>
        <p class="text-sm font-medium">{{ item.whtAmount }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Description</p>
        <p class="text-sm font-medium">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
</script>
