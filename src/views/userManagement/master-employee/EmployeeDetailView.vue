<template>
  <div>
    <BreadcrumbView
      title="Detail Employee"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Employee', to: '#' },
      ]"
    />

    <div class="max-w-6xl mx-auto p-4">
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-bold text-gray-800">Detail Employee</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiFormGroup hide-border>
              <UiInput
                label="Employee ID"
                placeholder="Enter Employee ID"
                row
                :disabled="true"
                :model-value="employeeData?.employeeId ?? '-'"
              />
              <UiInput
                label="Employee Name"
                placeholder="Enter employee name"
                row
                :model-value="employeeData?.employeeName ?? '-'"
                disabled
              />
              <UiInput
                label="Employee Email"
                placeholder="Enter employee email"
                row
                :model-value="employeeData?.employeeEmail ?? '-'"
                disabled
              />
            </UiFormGroup>
            <UiFormGroup hide-border>
              <UiInput
                label="Position Name"
                placeholder="Enter position name"
                row
                :model-value="employeeData?.positionName ?? '-'"
                disabled
              />
              <UiInput
                label="Company Code"
                placeholder="Enter company code"
                row
                :model-value="employeeData?.companyCode ?? '-'"
                disabled
              />
            </UiFormGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { useEmployeeStore } from '@/stores/user-management/employee'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const employeeStore = useEmployeeStore()

const employeeData = computed(() => employeeStore.employee)

onMounted(async () => {
  await employeeStore.getEmployee(route.params.id as string)
})
</script>
