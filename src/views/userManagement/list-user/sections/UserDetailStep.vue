<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-xl font-bold text-gray-800">Detail User</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-[24px]">
        <UiFormGroup hide-border>
          <UiInput
            label="Full Name"
            placeholder="Enter full name"
            row
            required
            :model-value="userPayload.employeeName"
            @update:model-value="
              (value: any) =>
                emit('update:userPayload', {
                  ...userPayload,
                  employeeName: value,
                })
            "
          />
          <UiInput
            label="User Email"
            placeholder="Enter email"
            row
            required
            :model-value="userPayload.userName"
            @update:model-value="
              (value: any) => emit('update:userPayload', { ...userPayload, userName: value })
            "
          />
          <UiSelect
            label="Status"
            placeholder="Pilih"
            :options="statusOptions"
            row
            required
            value-key="value"
            text-key="label"
            :model-value="userPayload.isActive ? 'active' : 'inactive'"
            @update:model-value="
              (value: any) => emit('update:userPayload', { ...userPayload, isReactive: value })
            "
          />
        </UiFormGroup>
        <UiFormGroup hide-border>
          <UiInput
            label="Password"
            placeholder="Enter password"
            row
            required
            :model-value="userPayload.userPassword"
            @update:model-value="
              (value: any) => emit('update:userPayload', { ...userPayload, userPassword: value })
            "
          />
          <UiInput label="Confirm Password" placeholder="Enter password" row required />
          <div class="text-sm text-gray-700">
            <p>The password must contain</p>
            <ul class="list-disc list-inside">
              <li>Upper case</li>
              <li>Minimum 8 character</li>
              <li>At least one symbol</li>
              <li>At least one number</li>
            </ul>
          </div>
        </UiFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import { defineProps, defineEmits } from 'vue'

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const props = defineProps({
  userPayload: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:userPayload'])
</script>

<style scoped></style>
