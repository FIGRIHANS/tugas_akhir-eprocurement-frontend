<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import ActionButtonView from '@/components/userManagement/ActionButtonView.vue'
import { useUserStore } from '@/stores/user-management/user'
import moment from 'moment'
import { onMounted, ref, computed } from 'vue' // Added computed
import { useRouter } from 'vue-router'

const search = ref('')

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.getAllUsers()
})

const handleShowUserForm = () => {
  router.push('/user-management/user/form')
}

const filteredUsers = computed(() => {
  if (!userStore.users || userStore.users.items.length === 0) {
    return []
  }
  const searchTerm = search.value.toLowerCase()
  return userStore.users.items.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm) ||
      user.employeeName.toLowerCase().includes(searchTerm),
  )
})
</script>

<template>
  <div>
    <BreadcrumbView
      title="List User"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'List User', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">List User</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Profile" />
            <UiButton :outline="true">
              <UiIcon variant="duotone" name="filter" />
              Filter</UiButton
            >
            <UiButton variant="primary" @click="handleShowUserForm">
              <UiIcon variant="duotone" name="plus" />
              Add User</UiButton
            >
          </div>
        </div>
      </div>
      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead>
            <tr>
              <th></th>
              <th class="text-nowrap">User Name</th>
              <th class="text-nowrap">Email</th>
              <th class="text-nowrap">Profile</th>
              <th class="text-nowrap">Position/Role</th>
              <th class="text-nowrap">Last Login</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-4">No users found.</td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <ActionButtonView :user-data="user" />
              </td>
              <td>{{ user.employeeName }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.profileId }}</td>
              <td>{{ user.employeeId }}</td>
              <td>{{ moment(user.lastLoginDate).format('DD MMMM YYYY') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
