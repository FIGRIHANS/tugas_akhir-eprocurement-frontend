<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import type { ITabClosable } from '@/components/ui/atoms/tab-closable/types/tabClosable'
import UiTabClosable from '@/components/ui/atoms/tab-closable/UiTabClosable.vue'
import type { routeTypes } from '@/core/type/components/breadcrumb'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTab = ref<string>('administrative-data')
const bcRoutes = ref<routeTypes[]>([
  {
    name: 'Company Information',
    to: `/vendor/information/${route.params.id}`,
  },
  {
    name: currentTab.value,
    to: route.path,
  },
])

const tabsItem: ITabClosable[] = [
  {
    id: 'administrative-data',
    label: 'Administrative Data',
    isClosable: true,
  },
  {
    id: 'business-license-data',
    label: 'Business License Data',
    isClosable: true,
  },
  {
    id: 'payment-information-data',
    label: 'Payment Information Data',
    isClosable: true,
  },
]
</script>

<template>
  <BreadcrumbView title="Company Information" :routes="bcRoutes" />
  <UiTabClosable :tabs="tabsItem" v-model="currentTab" />
</template>
