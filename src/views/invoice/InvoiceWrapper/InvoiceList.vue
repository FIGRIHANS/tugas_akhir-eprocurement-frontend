<template>
  <div class="p-[24px]">
    <PoList v-if="checkPo()" />
    <NoPoList v-else />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const route = useRoute()

const NoPoList = defineAsyncComponent(() => import('./invoiceList/noPoList.vue'))
const PoList = defineAsyncComponent(() => import('./invoiceList/PoList.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()

onMounted(() => {
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getCompanyCode()
})

const checkPo = () => {
  if (route.name === 'invoice-list') {
    return true
  } else {
    return false
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-list.scss';
</style>
