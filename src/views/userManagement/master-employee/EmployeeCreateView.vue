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
                v-model="employeeId"
                :hint-text="errors.employeeId"
              />

              <UiInput
                label="Employee Name"
                placeholder="Enter employee name"
                row
                required
                :model-value="EmployeeName"
                @update:model-value="(v: any) => (EmployeeName = v)"
                :hint-text="errors.EmployeeName"
              />

              <UiInput
                label="Employee Email"
                placeholder="Enter employee email"
                row
                required
                :model-value="EmployeeEmail"
                @update:model-value="(v: any) => (EmployeeEmail = v)"
                :hint-text="errors.EmployeeEmail"
              />
            </UiFormGroup>

            <UiFormGroup hide-border>
              <UiInput
                label="Position Name"
                placeholder="Enter position name"
                row
                required
                :model-value="PositionName"
                @update:model-value="(v: any) => (PositionName = v)"
                :hint-text="errors.PositionName"
              />

              <UiInput
                label="Company Code"
                placeholder="Enter company code (e.g. ABC01)"
                row
                required
                :model-value="CompanyCode"
                @update:model-value="onCompanyCodeInput"
                :hint-text="errors.CompanyCode"
              />
            </UiFormGroup>
          </div>
        </div>
      </div>

      <div class="mt-8 w-full flex justify-between items-center">
        <UiButton outline>
          <UiIcon variant="duotone" name="cross-circle" />
          Cancel
        </UiButton>

        <UiButton variant="primary" @click="onSubmit" :disabled="!meta.valid || isSubmitting">
          Save
          <UiIcon variant="duotone" name="file-save" />
        </UiButton>
      </div>
    </div>

    <!-- modal success -->
    <UiModal v-model="showModalSuccess" size="sm">
      <div class="text-center mb-6">
        <ModalSuccessLogo class="mx-auto" />
        <h3 class="text-center text-lg font-medium">Yeayyy</h3>
        <p class="text-center text-base text-gray-600 mb-5">Employee successfully created</p>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import ModalSuccessLogo from '@/assets/svg/ModalSuccessLogo.vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { useEmployeeStore } from '@/stores/user-management/employee'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

const router = useRouter()
const employeeStore = useEmployeeStore()

const showModalSuccess = ref(false)

const employeeSchema = yup.object({
  employeeId: yup.number().optional(),
  EmployeeName: yup
    .string()
    .trim()
    .required('Employee name is required')
    .max(100, 'Max 100 characters'),
  EmployeeEmail: yup
    .string()
    .trim()
    .required('Employee email is required')
    .email('Email format not valid'),
  PositionName: yup
    .string()
    .trim()
    .required('Position name is required')
    .max(100, 'Max 100 characters'),
  CompanyCode: yup
    .string()
    .transform((v) => (typeof v === 'string' ? v.toUpperCase().trim() : v))
    .required('Company code is required')
    .matches(/^[A-Z0-9\-_.]{3,10}$/, '3–10 chars, letters/numbers/-_. only'),
  CostCenter: yup.string().optional(),
  isActive: yup.boolean().optional(),
})

const { handleSubmit, meta, errors, isSubmitting, setFieldValue } = useForm({
  validationSchema: employeeSchema,
  initialValues: {
    employeeId: 0,
    EmployeeName: '',
    EmployeeEmail: '',
    PositionName: '',
    CompanyCode: '',
    CostCenter: '',
    isActive: true,
  },
})

const { value: employeeId } = useField<number>('employeeId')
const { value: EmployeeName } = useField<string>('EmployeeName')
const { value: EmployeeEmail } = useField<string>('EmployeeEmail')
const { value: PositionName } = useField<string>('PositionName')
const { value: CompanyCode } = useField<string>('CompanyCode')

function onCompanyCodeInput(v: string) {
  setFieldValue('CompanyCode', (v || '').toUpperCase(), true)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const { statusCode } = await employeeStore.storeEmployee(values)

    if (statusCode === 200) {
      showModalSuccess.value = true
      setTimeout(() => {
        router.push({ name: 'user-management-master-employee' })
      }, 800)
    }
  } catch (error) {
    console.error(error)
  }
})
</script>
