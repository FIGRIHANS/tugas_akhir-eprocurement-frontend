<template>
  <div>
    <BreadcrumbView
      title="Add New Employee"
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
                required
                :disabled="true"
                :model-value="employeePayload.employeeID"
                @update:model-value="(value: any) => (employeePayload.employeeID = value)"
              />
              <UiInput
                label="Employee Name"
                placeholder="Enter employee name"
                row
                required
                :model-value="employeePayload.employeeName"
                @update:model-value="(value: any) => (employeePayload.employeeName = value)"
              />
              <UiInput
                label="Employee Email"
                placeholder="Enter employee email"
                row
                required
                :model-value="employeePayload.employeeEmail"
                @update:model-value="(value: any) => (employeePayload.employeeEmail = value)"
              />
            </UiFormGroup>
            <UiFormGroup hide-border>
              <UiInput
                label="Position Name"
                placeholder="Enter position name"
                row
                required
                :model-value="employeePayload.positionName"
                @update:model-value="(value: any) => (employeePayload.positionName = value)"
              />
              <UiInput
                label="Company Code"
                placeholder="Enter company code"
                row
                required
                :model-value="employeePayload.companyCode"
                @update:model-value="(value: any) => (employeePayload.companyCode = value)"
              />
            </UiFormGroup>
          </div>
        </div>
      </div>
      <div class="mt-8 w-full flex justify-between items-center">
        <UiButton outline>
          <UiIcon variant="duotone" name="arrow-left"></UiIcon>
          Cancel</UiButton
        >
        <UiButton variant="primary">
          Save
          <UiIcon variant="duotone" name="arrow-right"></UiIcon>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { reactive } from 'vue'

const employeePayload = reactive({
  employeeID: 0,
  employeeName: '',
  employeeEmail: '',
  positionName: '',
  companyCode: '',
})
</script>
