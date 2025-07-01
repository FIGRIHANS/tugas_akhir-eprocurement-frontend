<template>
  <div>
    <BreadcrumbView
      title="Report User Authorization"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Report User Authorization', to: '#' },
      ]"
    />
    <UiTab :items="tabs" v-model="currentTab" @update:model-value="handleChange" />
    <RouterView v-slot="{ Component }">
      <Transition>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentTab = ref('')

const tabs = [
  {
    label: 'Report Profile',
    value: 'report-authorization-profile',
  },
  {
    label: 'Report Role',
    value: 'report-authorization-role',
  },
]

const handleChange = (value: string) => {
  router.push({ name: value })
}


onMounted(() => {
  currentTab.value = route.name as string
})
</script>

<style scoped></style>
