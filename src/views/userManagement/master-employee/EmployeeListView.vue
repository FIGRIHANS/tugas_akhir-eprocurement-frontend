<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import IconPlusCircle from '@/assets/svg_icons/ic_plus_circle.svg'

import { ref } from 'vue'
import EmployeeMenuButton from '@/components/userManagement/EmployeeMenuButton.vue'
import LPagination from '@/components/pagination/LPagination.vue'

const searchKeyword = ref('')

const handleAddEmployee = () => {
  console.log('Add Employee')
}
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Employee"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Employee', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="w-full flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">List Employee</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="searchKeyword" placeholder="Search Employee" />
            <UiButton variant="primary" @click="handleAddEmployee">
              <img :src="IconPlusCircle" alt="Icon Plus" />
              Add Employee
            </UiButton>
          </div>
        </div>
      </div>
      <div class="card-body">
        <table class="table align-middle text-gray-700">
          <thead>
            <tr>
              <th></th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Position Name</th>
              <th>Company Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="flex items-center gap-[24px]">
                <EmployeeMenuButton id="1" />
              </td>
              <td>10001</td>
              <td>Eleanor Pena</td>
              <td>jvSjI@example.com</td>
              <td>Node JS Developer</td>
              <td>COMPANY123</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-800 text-sm font-medium"
      >
        <div>Showing 1 of 1 entries</div>
        <LPagination :total-items="Number(10)" :current-page="Number(1)" :page-size="Number(10)" />
      </div>
    </div>
  </div>
</template>
