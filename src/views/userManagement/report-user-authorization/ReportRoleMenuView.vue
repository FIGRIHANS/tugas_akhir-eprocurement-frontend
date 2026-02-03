<template>
  <div class="grid grid-cols-2 gap-12">
    <!-- Left Card: List of Role -->
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">List of Role</h2>
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

    <!-- Right Card: List of Menu -->
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-semibold">List of Menu</h2>
          <span v-if="selectedRoleName" class="text-sm text-gray-500">
            (Role: {{ selectedRoleName }})
          </span>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Menu Id</th>
              <th style="width: 80%">Menu Name</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredMenus.length > 0">
              <tr v-for="menu in filteredMenus" :key="menu.menuId">
                <td>{{ menu.menuId }}</td>
                <td>{{ menu.menuName }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="text-center">
                  {{
                    selectedRoleId
                      ? 'Tidak ada menu untuk role ini.'
                      : 'Pilih role untuk melihat daftar menu.'
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
const dummyMenus = ref([
  { menuId: 1, menuName: 'Analytic Dashboard', roleId: 1 },
  { menuId: 2, menuName: 'Vendor Management', roleId: 1 },
  { menuId: 3, menuName: 'Invoice', roleId: 2 },
  { menuId: 4, menuName: 'Dashboard', roleId: 2 },
  { menuId: 5, menuName: 'Bill / Invoice', roleId: 3 },
  { menuId: 6, menuName: 'User Profile', roleId: 3 },
  { menuId: 7, menuName: 'Vendor Manage', roleId: 4 },
  { menuId: 8, menuName: 'Reporting', roleId: 4 },
])

const searchKeyword = ref('')
const selectedRoleId = ref<number | null>(null)

// Computeds
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

const filteredMenus = computed(() => {
  if (selectedRoleId.value === null) {
    return []
  }
  return dummyMenus.value.filter((menu) => menu.roleId === (selectedRoleId.value! % 4) + 1)
})

const selectedRoleName = computed(() => {
  const role = roleStore.roles.items.find((r) => r.roleId === selectedRoleId.value)
  return role ? role.roleName : ''
})

const selectRole = (roleId: number) => {
  selectedRoleId.value = roleId
}

onMounted(async () => {
  if (roleStore.roles.items.length === 0) {
    await roleStore.getAllUserRoles({ page: 1, pageSize: 100 })
  }
})
</script>

<style scoped></style>
