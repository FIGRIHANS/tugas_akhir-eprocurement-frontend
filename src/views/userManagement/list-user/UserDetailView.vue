<template>
  <div>
    <BreadcrumbView title="Detail" :routes="breadCrumbItems" />
    <hr class="-mx-[24px] mb-[24px]" />

    <!-- Tab Content: Detail User -->
    <div v-if="tabNow === 'detail'">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="card">
            <div class="card-header">
              <h2 class="font-bold text-base text-slate-700">User Detail</h2>
            </div>
            <div class="card-body">
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">User ID</p>
                <p class="text-sm font-medium text-slate-700">{{ userDetail?.profileId }}</p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Full Name</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ userDetail?.employeeName }}
                </p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Email</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ userDetail?.userName }}
                </p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Status</p>
                <p class="text-sm font-medium text-slate-700">-</p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Last Log In</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ formattedLastLogin }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Profile -->
    <div v-if="tabNow === 'profile'">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="card">
            <div class="card-header">
              <h2 class="font-bold text-base text-slate-700">Profile Information</h2>
            </div>
            <div class="card-body">
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Position</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ userDetail?.profile?.profileName }}
                </p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Full Name</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ userDetail?.employeeName }}
                </p>
              </div>
              <div class="card-group flex justify-between">
                <p class="text-sm font-medium text-slate-500">Email</p>
                <p class="text-sm font-medium text-slate-700">
                  {{ userDetail?.userName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Authorization -->
    <div v-if="tabNow === 'authorization'">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="card">
            <div class="card-header">
              <h3 class="text-base font-bold text-slate-700">Authorization</h3>
            </div>
            <div class="card-body">
              <table class="table align-middle text-gray-700 w-full">
                <thead>
                  <tr>
                    <th class="text-nowrap text-left">Auth Object Code</th>
                    <th class="text-nowrap text-left">Auth Object Name</th>
                  </tr>
                </thead>
                <tbody v-if="authRows.length">
                  <tr v-for="item in authRows" :key="item.authId">
                    <td class="py-2">{{ item.authValue }}</td>
                    <td class="py-2">{{ item.authName }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td class="py-3 text-center text-slate-500" colspan="2">
                      No authorization found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Role -->
    <div v-if="tabNow === 'role'">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="card">
            <div class="card-header">
              <h3 class="text-base font-bold text-slate-700">Role Detail</h3>
            </div>
            <div class="card-body">
              <table class="table align-middle text-gray-700 w-full">
                <thead>
                  <tr>
                    <th class="text-nowrap text-left">Role ID</th>
                    <th class="text-nowrap text-left">Position / Role</th>
                  </tr>
                </thead>
                <tbody v-if="roleRows.length">
                  <tr v-for="role in roleRows" :key="role.roleId">
                    <td class="py-2">{{ role.roleId }}</td>
                    <td class="py-2">{{ role.roleName }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td class="py-3 text-center text-slate-500" colspan="2">No role found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import { useUserStore } from '@/stores/user-management/user'
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const breadCrumbItems = [
  { name: 'User Management', to: '/user-management/user' },
  { name: 'List User', to: '/user-management/user' },
  { name: 'Detail', to: '#' },
]

const userStore = useUserStore()
const route = useRoute()
// follow InvoiceDetailEdit pattern: `tabNow` is a ref passed directly to the Tab component
const tabNow = ref<string>('detail')

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

const formattedLastLogin = computed(() => {
  const raw = userDetail.value?.lastLoginDate
  if (!raw) return '-'
  const m = moment(raw)
  if (!m.isValid() || m.year() <= 1900) return '-'
  return m.format('YYYY-MM-DD')
})

onMounted(async () => {
  await userStore.getUserDetail(route.params.userName as string)
})
</script>

<style scoped></style>
