<template>
  <div v-if="form">
    <p class="text-base font-semibold mb-[20px]">General Data</p>
    <div class="flex flex-col gap-[20px]">
      <div>
        <p class="text-xs font-normal text-gray-700">Vendor</p>
        <p class="text-sm font-medium">{{ getVendorName() || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">NPWP</p>
        <p class="text-sm font-medium">{{ form.npwp || '-' }}</p>
      </div>
      <div>
        <p class="text-xs font-normal text-gray-700">Address</p>
        <p class="text-sm font-medium">{{ form.address || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { formTypes } from '../../types/invoiceAddWrapper'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const invoiceMasterApi = useInvoiceMasterDataStore()
const form = inject<formTypes>('form')
const route = useRoute()
const typeForm = ref<string>('')

const vendorList = computed(() => invoiceMasterApi.vendorList)

const getVendorName = () => {
  const getIndex = vendorList.value.findIndex((item) => item.vendorId === Number(form?.vendorId))
  if (getIndex !== -1) return vendorList.value[getIndex].vendorName
}

onMounted(() => {
  typeForm.value = route.query.type?.toString().toLowerCase() || 'po'
})
</script>
