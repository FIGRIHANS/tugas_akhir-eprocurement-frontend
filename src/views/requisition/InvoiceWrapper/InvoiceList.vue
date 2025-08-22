<template>
  <div class="p-[24px]">
    <div class="tabs mb-5">
      <!-- <button class="tab px-[10px]" :class="{ active: tabNow === 'po' }" @click="setTab('po')">
        Invoice PO
      </button> -->

      <!-- <button class="btn btn-primary ml-auto" @click="goAdd(true)">
        <i class="ki-duotone ki-plus-circle"></i>
        Add Requisition
      </button> -->
    </div>
    <div class="mt-[24px]">
      <PoList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const PoList = defineAsyncComponent(() => import('./invoiceList/PoList.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const router = useRouter()
// const tabNow = ref<string>('po')

// const setTab = (name: string) => {
//   tabNow.value = name
// }

const goAdd = (isPo: boolean) => {
  router.push({
    name: 'requisitionAdd',
    query: {
      type: isPo ? 'po' : 'nonpo',
    },
  })
}

onMounted(() => {
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getCompanyCode()
})
</script>

<style lang="scss" scoped>
@use '../styles/invoice-list.scss';
</style>
