<template>
  <UiModal v-model="visible" :title="modalTitle" size="md">
    <div class="p-4 flex flex-col gap-4">
      <!-- Company Code -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-600"
          >Company Code <span class="text-red-500">*</span></label
        >
        <!-- Mock Dropdown/Select for Company Code -->
        <select v-model="form.companyCode" class="input appearance-none">
          <option value="" disabled>Select Company Code</option>
          <option value="MF00">MF00</option>
          <option value="MB00">MB00</option>
        </select>
      </div>

      <!-- Company Name -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-600"
          >Company Name <span class="text-red-500">*</span></label
        >
        <UiInput v-model="form.companyName" placeholder="Enter Company Name" />
      </div>

      <!-- Status -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-600">Status</label>
        <div class="flex items-center gap-2">
          <label class="switch">
            <input type="checkbox" v-model="isActive" />
            <span class="slider round"></span>
          </label>
          <span class="text-sm">{{ isActive ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>

      <!-- Created Date -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-600">Created Date</label>
        <UiInput type="date" v-model="form.createdDate" placeholder="Select Date" />
      </div>

      <!-- Created By -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-gray-600">Created By</label>
        <UiInput v-model="form.createdBy" placeholder="Enter Creator Name" />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 pt-4 border-t">
        <UiButton variant="light" @click="visible = false">Cancel</UiButton>
        <UiButton variant="primary" @click="handleSubmit">Save</UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import type { Organization } from '../types'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'

const props = defineProps<{
  modelValue: boolean
  initialData?: Organization | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Organization): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const modalTitle = computed(() => (props.initialData ? 'Edit Organization' : 'Add Organization'))

const form = reactive<Organization>({
  companyCode: '',
  companyName: '',
  status: 'Active',
  createdDate: '',
  createdBy: '',
})

const isActive = ref(true)

watch(isActive, (val) => {
  form.status = val ? 'Active' : 'Inactive'
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal)
      isActive.value = newVal.status === 'Active'
    } else {
      // Reset form
      form.companyCode = ''
      form.companyName = ''
      form.status = 'Active'
      form.createdDate = ''
      form.createdBy = ''
      isActive.value = true
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  // Basic validation
  if (!form.companyCode || !form.companyName) {
    return
  }
  emit('submit', { ...form, id: props.initialData?.id })
  visible.value = false
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500;
}
</style>
