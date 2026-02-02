<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-xl font-bold text-gray-800">Detail User</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-[24px]">
        <UiFormGroup hide-border>
          <UiSearchSelect
            label="Employee"
            placeholder="Pilih"
            :options="employeeStore.employees.items"
            row
            required
            value-key="employeeId"
            text-key="employeeName"
            :model-value="userPayload.employeeId"
            @search="getEmployeAfter"
            @update:model-value="
              (value: any) => emit('update:userPayload', { ...userPayload, employeeId: value })
            "
            searchable
          />
          <UiSearchSelect
            label="Profile"
            placeholder="Pilih"
            :options="userProfileStore.profiles.items"
            row
            required
            value-key="profileId"
            text-key="profileName"
            :model-value="userPayload.profileId"
            @search="getProfileAfter"
            @update:model-value="
              (value: any) => emit('update:userPayload', { ...userPayload, profileId: value })
            "
            searchable
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
// import { computed } from 'vue'
import { useUserProfileStore } from '@/stores/user-management/profile'
// import logger from '@/utils/logger'
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

// const profile = ref('')

let profileTimeoutId: ReturnType<typeof setTimeout>

const getProfileAfter = (query: string) => {
  // 1. Batalkan timer sebelumnya jika user mengetik lagi sebelum waktu habis
  clearTimeout(profileTimeoutId)

  // 2. Buat timer baru
  profileTimeoutId = setTimeout(() => {
    // Logic Anda dijalankan di sini setelah delay selesai
    if (query.length > 3) {
      const body = {
        page: 1,
        pageSize: 10,
        searchText: query,
      }
      userProfileStore.getAllUserProfiles(body)
    }
  }, 500)
}

const getEmployeAfter = (query: string) => {
  // 1. Batalkan timer sebelumnya jika user mengetik lagi sebelum waktu habis
  clearTimeout(profileTimeoutId)

  // 2. Buat timer baru
  profileTimeoutId = setTimeout(() => {
    // Logic Anda dijalankan di sini setelah delay selesai
    if (query.length > 3) {
      const body = {
        page: 1,
        pageSize: 10,
        searchText: query,
      }
      employeeStore.getEmployees(body)
    }
  }, 500)
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
  return (
    props.userPayload.employeeId > 0 &&
    props.userPayload.profileId > 0 &&
    props.userPayload.userName?.trim() !== '' &&
    props.userPayload.userPassword?.trim() !== '' &&
    props.userPayload.userPasswordConfirm?.trim() !== '' &&
    props.userPayload.userPassword === props.userPayload.userPasswordConfirm
  )
})

watch(
  isFormValid,
  (newVal) => {
    emit('update:isFormValid', newVal)
  },
  { immediate: true },
)

onMounted(() => {
  const body = {
    page: 1,
    pageSize: 10,
    searchText: '',
  }
  employeeStore.getEmployees(body)
  userProfileStore.getAllUserProfiles(body)
})
</script>

<style scoped></style>
