<template>
  <div>
    <PKPTableView :data="vendorLicenseData.data" />
    <OtherDocTableView />
  </div>
</template>

<script setup lang="ts">
import OtherDocTableView from '@/components/vendor/businessLicenseData/OtherDocTableView.vue'
import PKPTableView from '@/components/vendor/businessLicenseData/PKPTableView.vue'
import { useVendorIzinUsahaStore } from '@/stores/vendor/vendor'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const vendorLicenseData = useVendorIzinUsahaStore()

const route = useRoute()
console.log(vendorLicenseData.data)

onMounted(() => {
  vendorLicenseData.getData(route.params.id as string)
})
</script>
