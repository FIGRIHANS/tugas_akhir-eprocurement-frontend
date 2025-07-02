<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import ActionButtonView from '@/components/userManagement/ActionButtonView.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const search = ref('')

const router = useRouter()

const handleShowUserForm = () => {
  router.push('/user-management/user/form')
}

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
          <thead class="">
            <tr>
              <th></th>
              <th class="text-nowrap">User Name</th>
              <th class="text-nowrap">Email</th>
              <th class="text-nowrap">Proile</th>
              <th class="text-nowrap">Position/Role</th>
              <th class="text-nowrap">Last Login</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ActionButtonView />
              </td>
              <td>Darlene Robertson</td>
              <td>dolores.chambers@example.com</td>
              <td>Department Head</td>
              <td>Deputy Chief Financial Officer</td>
              <td>Fri 19 Jun, 2020 09:35 am</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
