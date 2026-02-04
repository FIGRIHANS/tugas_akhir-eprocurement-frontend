<template>
  <div class="grid grid-cols-2 gap-12">
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">Role</h2>
          <UiInputSearch placeholder="Search role" v-model="searchKeyword" />
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Role ID</th>
              <th style="width: 80%">Role Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="role in filteredRoles"
              :key="role.roleId"
              @click="selectRole(role.roleId)"
              :class="{
                'cursor-pointer': true,
                'bg-blue-600 text-white': role.roleId === selectedRoleId,
              }"
            >
              <td>{{ role.roleId }}</td>
              <td>{{ role.roleName }}</td>
            </tr>
            <tr v-if="filteredRoles.length === 0">
              <td colspan="2" class="text-center">Tidak ada role ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">List of Auth Object</h2>
          <span v-if="selectedRoleName" class="text-sm text-gray-500">
            (Role: {{ selectedRoleName }})
          </span>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Auth Object</th>
              <th style="width: 80%">Auth Object Name</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredAuthObjects.length > 0">
              <tr v-for="auth in filteredAuthObjects" :key="auth.authObjectId">
                <td>{{ auth.authObjectId }}</td>
                <td>{{ auth.authObjectName }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="text-center">
                  {{
                    selectedRoleId
                      ? 'Tidak ada auth object untuk role ini.'
                      : 'Pilih role untuk melihat daftar auth object.'
                  }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref, computed, onMounted } from 'vue'
import { useUserRoleStore } from '@/stores/user-management/role'

const roleStore = useUserRoleStore()

// Dummy Menus Data as requested
// Dummy Auth Objects Data as requested (Company Codes)
const dummyAuthObjects = ref([
  { authObjectId: 'MF00', authObjectName: 'DATA CITRA MANDIRI', roleId: 1 },
  { authObjectId: 'GNLA', authObjectName: 'PT. Erha Medical', roleId: 1 },
  { authObjectId: 'GNOA', authObjectName: 'PT. Genero Omnicom Asia', roleId: 2 },
  { authObjectId: 'DELA', authObjectName: 'PT. Derma Lab Asia', roleId: 2 },
  { authObjectId: 'ECII', authObjectName: 'PT. Erha Clinic Indonesia', roleId: 3 },
  { authObjectId: 'ANDV', authObjectName: 'PT. Arya Noble Derma Ventura', roleId: 4 },
])

const searchKeyword = ref('')
const selectedRoleId = ref<number | null>(null)

// Computed property untuk memfilter role berdasarkan keyword pencarian
const filteredRoles = computed(() => {
  const items = roleStore.roles.items
  if (!searchKeyword.value) {
    return items
  }
  const lowerCaseKeyword = searchKeyword.value.toLowerCase()
  return items.filter(
    (role) =>
      role.roleName.toLowerCase().includes(lowerCaseKeyword) ||
      role.roleId.toString().includes(lowerCaseKeyword),
  )
})

// Computed property untuk memfilter auth object berdasarkan role yang dipilih
const filteredAuthObjects = computed(() => {
  if (selectedRoleId.value === null) {
    return []
  }
  // Simple simulation: Distribute auth objects based on simulated roleId match
  return dummyAuthObjects.value.filter((auth) => auth.roleId === (selectedRoleId.value! % 4) + 1)
})

// Computed property untuk mendapatkan nama role yang dipilih
const selectedRoleName = computed(() => {
  const role = roleStore.roles.items.find((r) => r.roleId === selectedRoleId.value)
  return role ? role.roleName : ''
})

// Fungsi untuk memilih role
const selectRole = (roleId: number) => {
  selectedRoleId.value = roleId
}

onMounted(async () => {
  // Fetch Roles
  if (roleStore.roles.items.length === 0) {
    await roleStore.getAllUserRoles({ page: 1, pageSize: 100 })
  }
})
</script>

<style scoped></style>
