<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Interface for Menu Data
interface IMenuDetail {
  id: number
  menuName: string
  menuIcon: string
  menuUrl: string
  parentId: number
  sequential: number
  tier: string
}

const menuData = ref<IMenuDetail>({
  id: 0,
  menuName: '',
  menuIcon: '',
  menuUrl: '',
  parentId: 0,
  sequential: 0,
  tier: '',
})

onMounted(() => {
  // Simulate fetching data based on route.params.id
  const id = Number(route.params.id)
  menuData.value = {
    id: id,
    menuName: 'Dashboard', // Dummy value
    menuIcon: 'element-11',
    menuUrl: 'usermanagement.dashboard.user',
    parentId: 18,
    sequential: 5,
    tier: 'pages/master/*',
  }
})
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Menu Detail"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Menu', to: '/user-management/master-menu' },
        { name: 'Detail', to: '#' },
      ]"
    />

    <div class="max-w-6xl mx-auto p-4">
      <div class="card">
        <div class="card-header">
          <div class="flex w-full justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800">Menu Detail</h2>
          </div>
        </div>
        <div class="card-body space-y-5">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UiInput label="Menu Name" v-model="menuData.menuName" disabled :row="true" />
            <UiInput label="Menu URL" v-model="menuData.menuUrl" disabled :row="true" />

            <UiInput
              label="Parent ID"
              :model-value="String(menuData.parentId)"
              disabled
              :row="true"
            />
            <UiInput
              label="Sequential"
              :model-value="String(menuData.sequential)"
              disabled
              :row="true"
            />

            <UiInput label="Tier" v-model="menuData.tier" disabled :row="true" />
            <div class="flex flex-col gap-2">
              <UiInput label="Menu Icon" v-model="menuData.menuIcon" disabled :row="true" />
              <!-- Icon Preview helper -->
              <div class="flex items-center gap-3 ml-[40%]">
                <span class="text-xs text-gray-500">Preview:</span>
                <div class="p-2 border rounded bg-gray-50">
                  <UiIcon
                    :name="menuData.menuIcon || 'unknown'"
                    variant="duotone"
                    class="text-xl text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 w-full flex justify-end">
        <UiButton outline @click="router.back()">
          <UiIcon name="black-left-line" />
          Back
        </UiButton>
      </div>
    </div>
  </div>
</template>
