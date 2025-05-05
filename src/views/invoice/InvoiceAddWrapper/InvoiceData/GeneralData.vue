<template>
  <div class="flex-1">
    <div class="border-b border-gray-200 gap-[8px] p-[10px] flex items-center">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div v-if="form" class="py-[8px] px-[16px]">
      <!-- Name -->
      <div v-if="checkNonPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Name
        </label>
        <input v-model="form.name" class="input" placeholder="" :disabled="form.status !== 0" :class="{ 'border-danger': form.nameError }" />
      </div>
      <!-- Vendor Name -->
      <div v-if="checkPo()" class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Name
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
        <input v-if="checkPo() || form.status !== 0" v-model="form.businessField" class="input" placeholder="" disabled/>
        <select v-if="checkNonPo() && form.status === 0" v-model="form.businessField" class="select" :class="{ 'border-danger': form.businessFieldError }">
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
      <!-- Sub Business Field -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Sub Business Field
        </label>
        <input v-if="checkPo() || form.status !== 0" v-model="form.subBusinessField" class="input" placeholder="" disabled/>
        <select v-if="checkNonPo() && form.status === 0" v-model="form.subBusinessField" class="select" :class="{ 'border-danger': form.subBusinessFieldError }">
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
      <!-- Address -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Address
        </label>
        <textarea v-model="form.address" class="textarea" placeholder="" rows="6" :disabled="checkPo() || form.status !== 0"></textarea>
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

const checkNonPo = () => {
  return typeForm.value === 'nonpo'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
