<template>
  <div>
    <BreadcrumbView title="Detail" :routes="breadCrumbItems" />
    <hr class="-mx-[24px] mb-[24px]" />

    <div class="grid grid-cols-12 gap-4">
      <!-- Left Column - User Detail (Extended) -->
      <div class="col-span-12 lg:col-span-6">
        <div class="card h-full">
          <div class="card-header">
            <h2 class="font-bold text-base text-slate-700">User Detail</h2>
          </div>
          <div class="card-body">
            <div class="card-group flex justify-between">
              <p class="text-sm font-medium text-slate-500">Employee Name</p>
              <p class="text-sm font-medium text-slate-700">{{ userDetail?.employeeName || '-' }}</p>
            </div>
            <div class="card-group flex justify-between">
              <p class="text-sm font-medium text-slate-500">Email</p>
              <p class="text-sm font-medium text-slate-700">{{ userDetail?.userName || '-' }}</p>
            </div>
            <div class="card-group flex justify-between">
              <p class="text-sm font-medium text-slate-500">Profile Id</p>
              <p class="text-sm font-medium text-slate-700">{{ userDetail?.profileId || '-' }}</p>
            </div>
            <div class="card-group flex justify-between">
              <p class="text-sm font-medium text-slate-500">Employee Id</p>
              <p class="text-sm font-medium text-slate-700">{{ userDetail?.employeeId || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Authorization & Role Detail (Shrunk) -->
      <div class="col-span-12 lg:col-span-6">
        <!-- Role Detail Section -->
        <div class="card mb-6">
          <div class="card-header">
            <h3 class="text-base font-bold text-slate-700">Role Detail</h3>
          </div>
          <div class="card-body">
            <table class="table align-middle text-gray-700 w-full" v-if="roleRows.length > 0">
              <thead>
                <tr>
                  <th class="text-nowrap text-left">Role ID</th>
                  <th class="text-nowrap text-left">Position / Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in roleRows" :key="role.roleId">
                  <td class="py-2">{{ role.roleId }}</td>
                  <td class="py-2">{{ role.roleName }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="py-6 text-center">
              <p class="text-sm text-slate-500">No role found</p>
            </div>
          </div>
        </div>

        <!-- Authorization Section -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-base font-bold text-slate-700">Authorization Detail</h3>
          </div>
          <div class="card-body">
            <table class="table align-middle text-gray-700 w-full" v-if="authRows.length > 0">
              <thead>
                <tr>
                  <th class="text-nowrap text-left">Auth Object Code</th>
                  <th class="text-nowrap text-left">Auth Object Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in authRows" :key="item.authId">
                  <td class="py-2">{{ item.authValue }}</td>
                  <td class="py-2">{{ item.authName }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="py-6 text-center">
              <p class="text-sm text-slate-500">No authorization found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Section - Full Width -->
      <div class="col-span-12">
        <div class="card">
          <div class="card-header">
            <h3 class="text-base font-bold text-slate-700">Menu</h3>
          </div>
          <div class="card-body">
            <table class="table align-middle text-gray-700 w-full">
              <thead>
                <tr>
                  <th class="text-nowrap text-left">Profile Id</th>
                  <th class="text-nowrap text-left">Profile Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2">{{ userDetail?.profileId || '-' }}</td>
                  <td class="py-2">{{ userDetail?.profile?.profileName || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-start items-center mt-8 mb-8">
      <UiButton :disabled="false" @click="handleBack" outline>
        <span class="ki-outline ki-arrow-left mr-2 align-middle inline-block"></span>
        Back
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { useUserStore } from '@/stores/user-management/user'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const breadCrumbItems = [
  { name: 'User Management', to: '/user-management/user' },
  { name: 'List User', to: '/user-management/user' },
  { name: 'Detail', to: '#' },
]

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const handleBack = () => {
  router.push('/user-management/user')
}

const userDetail = computed(() => userStore.userDetail)

const authRows = computed(() => {
  const roleAuths = userDetail.value?.roleAuths ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return roleAuths.flatMap((ra: any) => ra?.auths ?? [])
})

const roleRows = computed(() => {
  const roleAuths = userDetail.value?.roleAuths ?? []
  return (
    roleAuths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((ra: any) => ra?.role)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((r: any) => r && (r.roleId !== undefined || r.roleName !== undefined))
  )
})

onMounted(async () => {
  const userName = route.params.userName as string
  console.log('Loading user detail for:', userName)
  await userStore.getUserDetail(userName)
  console.log('User detail loaded:', userStore.userDetail)
})
</script>

<style scoped></style>
