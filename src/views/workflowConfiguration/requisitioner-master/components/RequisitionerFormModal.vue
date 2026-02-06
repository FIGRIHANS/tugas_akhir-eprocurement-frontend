<template>
  <UiModal v-model="visible" :title="isEdit ? 'Edit Requisitioner' : 'Add Requisitioner'" size="sm">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700"
          >Company Code <span class="text-red-500">*</span></label
        >
        <select
          v-model="form.companyCode"
          class="select select-sm w-full border-gray-300"
          @change="onCompanyChange"
          required
        >
          <option value="" disabled>Select Company Code</option>
          <option v-for="item in companyOptions" :key="item.value" :value="item.value">
            {{ item.value }} - {{ item.label }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Company Name</label>
        <input
          v-model="form.companyName"
          type="text"
          class="input input-sm w-full bg-gray-100"
          disabled
          placeholder="Auto-filled"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700"
          >Department <span class="text-red-500">*</span></label
        >
        <select v-model="form.department" class="select select-sm w-full border-gray-300" required>
          <option value="" disabled>Select Department</option>
          <option v-for="dept in departmentOptions" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700"
          >Requisitioner Code <span class="text-red-500">*</span></label
        >
        <input
          v-model="form.requisitionerCode"
          type="text"
          class="input input-sm w-full border-gray-300"
          placeholder="Enter Requisitioner Code"
          required
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700"
          >Requisitioner Name <span class="text-red-500">*</span></label
        >
        <input
          v-model="form.requisitionerName"
          type="text"
          class="input input-sm w-full border-gray-300"
          placeholder="Enter Requisitioner Name"
          required
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Status</label>
        <div class="form-check form-switch">
          <input v-model="statusBool" class="form-check-input cursor-pointer" type="checkbox" />
          <label class="form-check-label text-gray-700">
            {{ form.status }}
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <UiButton type="button" variant="light" @click="visible = false">Cancel</UiButton>
        <UiButton type="submit" variant="primary">Save</UiButton>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import type { Requisitioner } from '../types'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'

interface Props {
  modelValue: boolean
  initialData?: Requisitioner | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.initialData?.id)

const form = reactive<Requisitioner>({
  companyCode: '',
  companyName: '',
  department: '',
  requisitionerCode: '',
  requisitionerName: '',
  status: 'Active',
})

const statusBool = computed({
  get: () => form.status === 'Active',
  set: (val) => {
    form.status = val ? 'Active' : 'Inactive'
  },
})

// Mock Data Options
const companyOptions = [
  { value: 'MF00', label: 'Petrosea' },
  { value: 'MF01', label: 'Other Company' },
]

const departmentOptions = ['Tax', 'IT Infrastructure', 'HR', 'Finance']

const onCompanyChange = () => {
  const company = companyOptions.find((c) => c.value === form.companyCode)
  form.companyName = company ? company.label : ''
}

const handleSubmit = () => {
  // Basic validation handled by HTML5 'required' attribute,
  // but in a real app better validation would be good.
  emit('submit', { ...form, id: props.initialData?.id })
  visible.value = false
}

const resetForm = () => {
  form.companyCode = ''
  form.companyName = ''
  form.department = ''
  form.requisitionerCode = ''
  form.requisitionerName = ''
  form.status = 'Active'
}

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      Object.assign(form, val)
    } else {
      resetForm()
    }
  },
)
</script>
