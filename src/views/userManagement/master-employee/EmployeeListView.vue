<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import IconPlusCircle from '@/assets/svg_icons/ic_plus_circle.svg'

import { onMounted, ref } from 'vue'
import EmployeeMenuButton from '@/components/userManagement/EmployeeMenuButton.vue'
// import LPagination from '@/components/pagination/LPagination.vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/user-management/employee'

const searchKeyword = ref('')
const router = useRouter()

const employeeStore = useEmployeeStore()

onMounted(async () => {
  await employeeStore.getEmployees()
})

const handleAddEmployee = () => {
  router.push({
    name: 'user-management-master-employee-create',
  })
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
            <tr v-for="item in employeeStore.employees" :key="item.id">
              <td class="flex items-center gap-[24px]">
                <EmployeeMenuButton :employee-data="item" />
              </td>
              <td>{{ item?.employeeId ?? '-' }}</td>
              <td>{{ item?.employeeName ?? '-' }}</td>
              <td>{{ item?.employeeEmail ?? '-' }}</td>
              <td>{{ item?.positionName ?? '-' }}</td>
              <td>{{ item?.companyCode ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div
        class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-800 text-sm font-medium"
      >
        <div>Showing 1 of 1 entries</div>
        <LPagination :total-items="Number(10)" :current-page="Number(1)" :page-size="Number(10)" />
      </div> -->
    </div>
  </div>
</template>
