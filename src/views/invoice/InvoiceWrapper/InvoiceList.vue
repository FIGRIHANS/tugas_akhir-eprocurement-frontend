<template>
  <div class="p-[24px]">
    <div class="tabs mb-5">
      <button class="tab px-[10px]" :class="{ 'active': tabNow === 'po' }" @click="setTab('po')">
        PO
      </button>
      <button class="tab" :class="{ 'active': tabNow === 'nonPo' }" @click="setTab('nonPo')">
        Non PO
      </button>
      
      <div class="dropdown ml-auto" data-dropdown="true" data-dropdown-trigger="click">
        <button class="dropdown-toggle btn btn-primary">
          <i class="ki-duotone ki-plus-circle"></i>
          Add Invoice
        </button>
        <div class="dropdown-content w-full max-w-56 p-[10px]">
          <div class="flex flex-col gap-[4px]">
            <button class="btn btn-clear btn-light w-full" @click="goAdd(true)">
              <i class="ki-duotone ki-file-added"></i>
              Invoice PO
            </button>
            <button class="btn btn-clear btn-light w-full" @click="goAdd(false)">
              <i class="ki-duotone ki-file-deleted"></i>
              Invoice Non PO
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-[24px]">
      <Transition mode="out-in">
        <component :is="contentComponent" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineAsyncComponent, type Component } from 'vue'
import { useRouter } from 'vue-router'

const PoList = defineAsyncComponent(() => import('./invoiceList/PoList.vue'))
const NonPoList = defineAsyncComponent(() => import('./invoiceList/NonPoList.vue'))

const router = useRouter()
const tabNow = ref<string>('po')

const contentComponent = computed(() => {
  const components = {
    po: PoList,
    nonPo: NonPoList
  } as { [key: string]: Component }

  return components[tabNow.value]
})

const setTab = (name: string) => {
  tabNow.value = name
}

const goAdd = (isPo: boolean) => {
  router.push({
    name: 'invoiceAdd',
    query: {
      type: isPo ? 'po' : 'nonpo'
    }
  })
}
</script>

<style lang="scss" scoped>
@use '../styles/invoice-list.scss';
</style>
