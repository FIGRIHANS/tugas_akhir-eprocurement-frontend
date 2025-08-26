<template>
  <div class="p-[24px]">
    <div class="tabs mb-5" v-if="checkPo()">
      <button class="tab px-[10px]" :class="{ active: tabNow === 'po' }" @click="setTab('po')">
        Invoice PO
      </button>

      <button class="btn btn-primary ml-auto" @click="goAdd(true)">
        <i class="ki-duotone ki-plus-circle"></i>
        Add Invoice
      </button>
    </div>
    <div class="mt-[24px]">
      <PoList v-if="checkPo()" />
      <NoPoList v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInvoiceMasterDataStore } from '@/stores/master-data/invoiceMasterData'

const route = useRoute()

const NoPoList = defineAsyncComponent(() => import('./invoiceList/noPoList.vue'))
const PoList = defineAsyncComponent(() => import('./invoiceList/PoList.vue'))

const invoiceMasterApi = useInvoiceMasterDataStore()
const router = useRouter()
const tabNow = ref<string>('po')

const setTab = (name: string) => {
  tabNow.value = name
}

const goAdd = (isPo: boolean) => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: isPo ? 'po' : 'nonpo',
    },
  })
}

onMounted(() => {
  invoiceMasterApi.getInvoicePoType()
  invoiceMasterApi.getCompanyCode()
})

const checkPo = () => {
  console.log(route.name)

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
