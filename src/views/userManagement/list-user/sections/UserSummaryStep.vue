<template>
  <div class="grid grid-cols-12 gap-4">
    <!-- Left Column - User Detail -->
    <div class="col-span-12 lg:col-span-6 left-column">
      <div class="card">
        <div class="card-header">
          <h2 class="font-bold text-base text-slate-700">User Detail</h2>
        </div>
        <div class="card-body">
          <div class="card-group flex justify-between">
            <p class="text-sm font-medium text-slate-500">Employee Name</p>
            <p class="text-sm font-medium text-slate-700">{{ userPayload.employeeName || '-' }}</p>
          </div>
          <div class="card-group flex justify-between">
            <p class="text-sm font-medium text-slate-500">Email</p>
            <p class="text-sm font-medium text-slate-700">{{ userPayload.userName || '-' }}</p>
          </div>
          <div class="card-group flex justify-between">
            <p class="text-sm font-medium text-slate-500">Status</p>
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded',
              userPayload.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            ]">
              {{ userPayload.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column - Authorization & Role Detail -->
    <div class="col-span-12 lg:col-span-6">
      <!-- Authorization Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h3 class="text-base font-bold text-slate-700">Authorization</h3>
        </div>
        <div class="card-body">
          <div v-if="assignedAuths.length > 0">
            <table class="table align-middle text-gray-700 w-full">
              <thead>
                <tr>
                  <th class="text-nowrap text-left">Auth Object Code</th>
                  <th class="text-nowrap text-left">Auth Object Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="auth in assignedAuths" :key="auth.code">
                  <td class="py-2">{{ auth.code }}</td>
                  <td class="py-2">{{ auth.name }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="assignedObjectValues.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-slate-500 mb-2">Object Code Values</h4>
              <table class="table align-middle text-gray-700 w-full">
                <thead>
                  <tr>
                    <th class="text-nowrap text-left">Object Code Value</th>
                    <th class="text-nowrap text-left">Object Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="val in assignedObjectValues" :key="val">
                    <td class="py-2">{{ val }}</td>
                    <td class="py-2">{{ getObjectValueName(val) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="py-6 text-center">
            <p class="text-sm text-slate-500">No authorization found</p>
          </div>
        </div>
      </div>

      <!-- Role Detail Section -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-bold text-slate-700">Role Detail</h3>
        </div>
        <div class="card-body">
          <table class="table align-middle text-gray-700 w-full" v-if="rolePayload.selectedRoleIds.length > 0">
            <thead>
              <tr>
                <th class="text-nowrap text-left">Role ID</th>
                <th class="text-nowrap text-left">Position / Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(roleId, index) in rolePayload.selectedRoleIds" :key="index">
                <td class="py-2">{{ roleId }}</td>
                <td class="py-2">{{ roleId }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="py-6 text-center">
            <p class="text-sm text-slate-500">No role found</p>
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
                <th class="text-nowrap text-left">Menu Id</th>
                <th class="text-nowrap text-left">Menu Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-2">{{ profilePayload.profileId || '-' }}</td>
                <td class="py-2">{{ profilePayload.profileName || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'

interface UserPayload {
  userName: string
  userPassword: string
  userPasswordConfirm: string
  employeeName: string
  isActive: boolean
  employeeId: number
  profileId: number
  selectedRoleIds: string[]
}

interface ProfilePayload {
  profileId: number
  profileName: string
  isActive: boolean
}

interface RolePayload {
  selectedRoleIds: string[]
}

interface AuthObject {
  code: string
  name: string
}

const assignedObjectValues = ref<string[]>([])

defineProps<{
  userPayload: UserPayload
  profilePayload: ProfilePayload
  rolePayload: RolePayload
}>()

const assignedAuths = ref<AuthObject[]>([])

// Injected from parent form for authorization data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allFormData = inject<Record<string, any>>('allFormData')

watch(
  () => allFormData?.['authorization-step'],
  (authData) => {
    if (authData && authData.selectedAuthObjects) {
      // Map auth codes to auth objects
      assignedAuths.value = authData.selectedAuthObjects.map((code: string) => ({
        code,
        name: getAuthName(code),
      }))
      // Map object values (codes) if present
      assignedObjectValues.value = authData.selectedObjectValues || []
    }
  },
  { deep: true },
)

const getAuthName = (code: string): string => {
  const authMap: Record<string, string> = {
    CC001: 'General Category',
    CC002: 'Customer Data Access',
    CC003: 'Product Management',
    CC004: 'Order Processing',
    CC005: 'Reporting Access',
    CC006: 'Admin Tools',
    CC007: 'User Management',
    CC008: 'Financial Records',
  }
  return authMap[code] || 'Unknown'
}

const getObjectValueName = (code: string): string => {
  const map: Record<string, string> = {
    MF00: 'Globalindo Express',
    MF01: 'Globalindo EV',
    MF02: 'Globalindo Retails',
  }
  return map[code] || 'Unknown'
}
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-body {
  padding: 1.5rem;
}

.card-group {
  margin-bottom: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #4a5568;
}

.sticky {
  position: sticky;
}

/* Make left column card stretch to match right column total height */
.left-column .card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.left-column .card-body {
  flex: 1 1 auto;
}
</style>
