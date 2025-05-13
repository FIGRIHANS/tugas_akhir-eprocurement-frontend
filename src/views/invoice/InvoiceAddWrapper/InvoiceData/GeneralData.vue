<template>
  <div class="card flex-1">
    <div class="card-header justify-start gap-[8px] px-[16px] py-[22px]">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div v-if="form" class="card-body py-[8px] px-[50px]">
      <!-- Invoice Type -->
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Invoice Type
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0" v-model="form.invoiceType" class="input" placeholder="" disabled />
        <select v-else v-model="form.invoiceType" class="select" :class="{ 'border-danger': form.invoiceTypeError }">
          <option value="po">
            PO
          </option>
          <option value="pib">
            PO - PIB
          </option>
          <option value="cc">
            PO - CC
          </option>
        </select>
      </div>
      <!-- Vendor Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Name
          <span class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="form.status !== 0" v-model="form.vendorId" class="input" placeholder="" disabled />
        <select v-else v-model="form.vendorId" class="select" :class="{ 'border-danger': form.vendorIdError }">
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
      </div>
      <!-- Business Field -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Business Field
        </label>
        <input v-model="form.businessField" class="input" placeholder="" disabled/>
      </div>
      <!-- Sub Business Field -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Sub Business Field
        </label>
        <input v-model="form.subBusinessField" class="input" placeholder="" disabled/>
      </div>
      <!-- Address -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Address
        </label>
        <textarea v-model="form.address" class="textarea" placeholder="" rows="6" disabled></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceAddWrapper'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

// const checkNonPo = () => {
//   return typeForm.value === 'nonpo'
// }

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
