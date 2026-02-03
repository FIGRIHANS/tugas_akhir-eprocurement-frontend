<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-xl font-bold text-gray-800">Detail User</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-[24px]">
        <UiFormGroup hide-border>
          <UiSearchSelect
            label="Employee Name"
            placeholder="Pilih"
            :options="employeeStore.employees.items"
            row
            required
            value-key="employeeId"
            text-key="employeeName"
            :model-value="userPayload.employeeId"
            @search="getEmployeAfter"
            @select="handleEmployeeSelect"
            searchable
          />
          <UiSearchSelect
            label="Profile Id"
            placeholder="Pilih"
            :options="profileDisplayOptions"
            row
            required
            value-key="profileId"
            text-key="displayName"
            :model-value="userPayload.profileId"
            @update:model-value="
              (value: string | number) =>
                emit('update:userPayload', {
                  ...userPayload,
                  profileId: typeof value === 'string' ? parseInt(value, 10) : value,
                })
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
              (value: string | number) =>
                emit('update:userPayload', { ...userPayload, isActive: value === 'active' })
            "
          />
        </UiFormGroup>
        <UiFormGroup hide-border>
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
          <div class="relative">
            <UiInput
              label="Password"
              :type="passwordType"
              placeholder="Enter password"
              row
              required
              :model-value="userPayload.userPassword"
              @update:model-value="
                (value: any) => emit('update:userPayload', { ...userPayload, userPassword: value })
              "
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <span v-if="showPassword" class="ki-outline ki-eye-slash text-lg"></span>
              <span v-else class="ki-outline ki-eye text-lg"></span>
            </button>
          </div>
          <div class="relative">
            <UiInput
              label="Confirm Password"
              :type="confirmPasswordType"
              placeholder="Enter password"
              row
              required
              :model-value="userPayload.userPasswordConfirm"
              @update:model-value="
                (value: any) =>
                  emit('update:userPayload', { ...userPayload, userPasswordConfirm: value })
              "
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span v-if="showConfirmPassword" class="ki-outline ki-eye-slash text-lg"></span>
              <span v-else class="ki-outline ki-eye text-lg"></span>
            </button>
          </div>
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
import UiSearchSelect from '@/components/ui/atoms/select/UiSearchSelect.vue'
import { onMounted, computed, watch, ref } from 'vue'
import { useUserProfileStore } from '@/stores/user-management/profile'
import { useEmployeeStore } from '@/stores/user-management/employee'

const userProfileStore = useUserProfileStore()

const employeeStore = useEmployeeStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
const confirmPasswordType = computed(() => (showConfirmPassword.value ? 'text' : 'password'))

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const profileDisplayOptions = computed(() => {
  return userProfileStore.profiles.items.map((profile) => ({
    ...profile,
    displayName: `${profile.profileId} - ${profile.profileName}`,
  }))
})

let profileTimeoutId: ReturnType<typeof setTimeout>

const getEmployeAfter = (query: string) => {
  // 1. Batalkan timer sebelumnya jika user mengetik lagi sebelum waktu habis
  clearTimeout(profileTimeoutId)

  // 2. Buat timer baru
  profileTimeoutId = setTimeout(() => {
    // Logic Anda dijalankan di sini setelah delay selesai
    const body = {
      page: 1,
      pageSize: 500,
      searchText: query,
    }
    employeeStore.getEmployees(body)
  }, 500)
}
// Handle employee selection with full object from @select event
const handleEmployeeSelect = (employee: { employeeId: number; employeeName: string }) => {
  if (employee) {
    emit('update:userPayload', {
      ...props.userPayload,
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
    })
  }
}

// const filteredProfiles = computed(() => {
//   if (!userProfileStore.profiles?.items) {
//     return []
//   }

//   const searchTerm = searchKeyword.value.toLowerCase()

//   if (searchTerm) {
//     return userProfileStore.profiles.items.filter((profile) =>
//       profile.profileName.toLowerCase().includes(searchTerm),
//     )
//   }

//   return userProfileStore.profiles.items
// })

interface UserPayloadInterface {
  userName: string
  userPassword: string
  userPasswordConfirm: string
  employeeName: string
  isActive: boolean
  employeeId: number
  profileId: number
  selectedRoleIds: string[]
}

const props = defineProps<{
  userPayload: UserPayloadInterface
}>()

const emit = defineEmits<{
  'update:userPayload': [payload: UserPayloadInterface]
  'update:isFormValid': [isValid: boolean]
}>()

const isFormValid = computed(() => {
  // employee selection is optional — Next should be enabled even if employee wasn't changed,
  // as long as required fields (profile, username, matching passwords) are valid.
  const passwordsFilled =
    props.userPayload.userPassword?.trim() !== '' &&
    props.userPayload.userPasswordConfirm?.trim() !== ''
  const passwordMatch =
    passwordsFilled && props.userPayload.userPassword === props.userPayload.userPasswordConfirm

  return (
    props.userPayload.profileId > 0 && props.userPayload.userName?.trim() !== '' && passwordMatch
  )
})

watch(
  isFormValid,
  (newVal) => {
    emit('update:isFormValid', newVal)
  },
  { immediate: true },
)

// Watch employeeId changes to sync employeeName
watch(
  () => props.userPayload.employeeId,
  (newEmployeeId) => {
    if (newEmployeeId && newEmployeeId > 0) {
      // Find the employee name from store
      const selectedEmployee = employeeStore.employees.items.find(
        (emp) => emp.employeeId === newEmployeeId,
      )
      if (selectedEmployee && props.userPayload.employeeName !== selectedEmployee.employeeName) {
        emit('update:userPayload', {
          ...props.userPayload,
          employeeName: selectedEmployee.employeeName,
        })
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  console.log('UserDetailStep mounted - loading initial data')
  const body = {
    page: 1,
    pageSize: 500, // Load more profiles initially
    searchText: '',
  }
  Promise.all([employeeStore.getEmployees(body), userProfileStore.getAllUserProfiles(body)]).then(
    () => {
      console.log(
        'Initial data loaded - employees:',
        employeeStore.employees.items.length,
        'profiles:',
        userProfileStore.profiles.items.length,
      )
    },
  )
})
</script>

<style scoped></style>
