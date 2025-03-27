<template>
  <div v-if="form">
    <p class="text-base font-semibold mb-[20px]">General Data</p>
    <div class="flex flex-col gap-[20px]">
      <div v-if="checkPo()">
        <p class="text-xs font-normal text-gray-700">Vendor</p>
        <p class="text-sm font-medium">{{ form.vendorId || '-' }}</p>
      </div>
      <div v-if="checkNonPo()">
        <p class="text-xs font-normal text-gray-700">Name</p>
        <p class="text-sm font-medium">{{ form.name || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Business Field</p>
        <p class="text-sm font-medium">{{ form.businessField || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Sub Business Field</p>
        <p class="text-sm font-medium">{{ form.subBusinessField || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Address</p>
        <p class="text-sm font-medium">{{ form.address || '-' }}</p>
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
