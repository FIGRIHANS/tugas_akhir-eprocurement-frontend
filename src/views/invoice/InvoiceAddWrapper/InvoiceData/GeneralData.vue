<template>
  <div class="card flex-1">
    <div class="card-header justify-start gap-[8px] px-[16px] py-[22px]">
      <i class="ki-duotone ki-document text-gray-600 text-xl"></i>
      <span class="font-medium">General Data</span>
    </div>
    <div v-if="form" class="card-body py-[8px] px-[50px]">
      <!-- Vendor Name -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          Vendor Name
          <span v-if="(form.status === 0 || form.status === -1 || form.status === 5) && !loginApi.isVendor" class="text-red-500 ml-[4px]">*</span>
        </label>
        <input v-if="(form.status !== 0 && form.status !== -1 && form.status !== 5) || loginApi.isVendor" v-model="form.vendorName" class="input" placeholder="" disabled />
        <select v-else v-model="form.vendorId" class="select" :class="{ 'border-danger': form.vendorIdError }">
          <option v-for="item of vendorList" :key="item.vendorId" :value="item.vendorCode">
            {{ item.vendorName }}
          </option>
        </select>
      </div>
      <!-- NPWP -->
      <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 py-[8px] px-[16px]">
        <label class="form-label max-w-32">
          NPWP
        </label>
        <input v-model="form.npwp" class="input" placeholder="" disabled/>
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
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useLoginStore } from '@/stores/views/login'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const loginApi = useLoginStore()
const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const vendorList = computed(() => invoiceMasterApi.vendorList)
const userData = computed(() => loginApi.userData)
const isVendor = computed(() => loginApi.isVendor)

watch(
  () => [form?.vendorId, vendorList.value],
  () => {
    if (form) {
      const getIndex = vendorList.value.findIndex((item) => item.vendorCode === form.vendorId)
      if (getIndex !== -1) {
        form.address = vendorList.value[getIndex].address
        form.npwp = vendorList.value[getIndex].npwp
        form.vendorName = vendorList.value[getIndex].vendorName
      }
    }
  }
)

watch(
  () => isVendor.value,
  () => {
    if (isVendor.value && form) {
      form.vendorId = userData.value?.profile.vendorCode || ''
      form.vendorName = userData.value?.profile.vendorName || ''
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
