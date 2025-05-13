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
        </label>
        <input v-model="form.invoiceType" class="input" placeholder="" disabled />
      </div>
      <!-- Vendor Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Name
        </label>
        <input v-model="form.vendorId" class="input" placeholder="" disabled />
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
import type { formTypes } from '../../types/invoiceDetailEdit'

const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const checkPo = () => {
  return typeForm.value === 'po'
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
