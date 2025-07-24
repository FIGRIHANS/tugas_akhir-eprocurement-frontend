<template>
  <div>
    <div class="w-full border-b border-slate-200 py-4">
      <h2 class="text-xl font-bold text-gray-800">Add Role</h2>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] gap-6 mt-4 items-start">
      <div class="card">
        <div class="card-header">
          <div class="w-full justify-between items-center flex">
            <p>Select Role</p>
            <UiInputSearch placeholder="Search Code" v-model="searchCodeKeyword" />
          </div>
        </div>
        <div class="card-body">
          <table class="table align-middle text-gray-700 w-full">
            <thead>
              <tr>
                <th class="text-nowrap">Role ID</th>
                <th class="text-nowrap">Position/Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="userRoleStore.loading">
                <td colspan="2" class="text-center text-gray-500 py-4">Loading roles...</td>
              </tr>
              <tr v-else-if="userRoleStore.error">
                <td colspan="2" class="text-center text-red-500 py-4">{{ userRoleStore.error }}</td>
              </tr>
              <tr v-else-if="filteredAvailableRoles.length === 0">
                <td colspan="2" class="text-center text-gray-500 py-4">
                  No available role objects.
                </td>
              </tr>
              <tr
                v-else
                v-for="role in filteredAvailableRoles"
                :key="role.code"
                @click="toggleAvailableSelection(role.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAvailableSelected(role.code) }"
              >
                <td>{{ role.code }}</td>
                <td>{{ role.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex flex-col gap-4 justify-center items-center h-full pt-10">
        <UiButton
          variant="primary"
          @click="addSelectedAuths"
          :disabled="selectedAvailableRoles.length === 0"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.7929 11.2071C14.1834 10.8166 14.8166 10.8166 15.2071 11.2071C15.5976 11.5976 15.5976 12.2309 15.2071 12.6213L10.2071 17.6213C9.81658 18.0118 9.18342 18.0118 8.79289 17.6213C8.40237 17.2309 8.40237 16.5976 8.79289 16.2071L12.9858 12L8.79289 7.79289C8.40237 7.40237 8.40237 6.76921 8.79289 6.37868C9.18342 5.98815 9.81658 5.98815 10.2071 6.37868L15.2071 11.3787L13.7929 11.2071Z"
              fill="white"
            />
          </svg>
        </UiButton>
        <UiButton
          variant="primary"
          @click="removeSelectedAuths"
          :disabled="selectedAssignedAuths.length === 0"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2071 11.2071C9.81658 10.8166 9.18342 10.8166 8.79289 11.2071C8.40237 11.5976 8.40237 12.2309 8.79289 12.6213L13.7929 17.6213C14.1834 18.0118 14.8166 18.0118 15.2071 17.6213C15.5976 17.2309 15.5976 16.5976 15.2071 16.2071L11.0142 12L15.2071 7.79289C15.5976 7.40237 15.5976 6.76921 15.2071 6.37868C14.8166 5.98815 14.1834 5.98815 13.7929 6.37868L8.79289 11.3787L10.2071 11.2071Z"
              fill="white"
            />
          </svg>
        </UiButton>
      </div>

      <div class="card">
        <div class="card-header">
          <p>Role Selected</p>
        </div>
        <div class="card-body">
          <table class="table align-middle text-gray-700 w-full">
            <thead>
              <tr>
                <th class="text-nowrap">Role ID</th>
                <th class="text-nowrap">Position/Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="assignedRoles.length === 0">
                <td colspan="2" class="text-center text-gray-500 py-4">
                  No role objects selected.
                </td>
              </tr>
              <tr
                v-for="role in assignedRoles"
                :key="role.code"
                @click="toggleAssignedSelection(role.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAssignedSelected(role.code) }"
              >
                <td>{{ role.code }}</td>
                <td>{{ role.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-if="errors.assignedRoles" class="text-red-500 text-sm mt-4 text-center">
      {{ errors.assignedRoles }}
    </p>
  </div>
</template>

<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { ref, reactive, computed, watch, inject, onMounted, type Ref } from 'vue'
import { useUserRoleStore } from '@/stores/user-management/role'

// Define the interface for a RoleObject (consistent with how roles are managed locally)
interface RoleObject {
  code: string
  name: string
  // Tambahkan properti lain yang mungkin ada di objek role jika diperlukan,
  // contohnya: isActive: boolean;
}

// Define the interface for the prop that will hold the selected roles
interface RolePayload {
  selectedRoleIds: string[] // Array of role IDs (strings based on 'code')
}

const props = defineProps({
  rolePayload: {
    type: Object as () => RolePayload,
    required: true,
  },
})

const emit = defineEmits(['update:role-payload'])

const userRoleStore = useUserRoleStore()

// Gunakan assignedRoles untuk menyimpan daftar peran yang dipilih
const assignedRoles = ref<RoleObject[]>([])

const searchCodeKeyword = ref('')
const selectedAvailableRoles = ref<string[]>([])
const selectedAssignedAuths = ref<string[]>([]) // Masih menggunakan 'Auths' di sini, sebaiknya diganti menjadi 'Roles'
const errors = reactive({
  assignedRoles: '',
})

const availableRoles = computed<RoleObject[]>(() => {
  const allStoreRoles = userRoleStore.roles.items
  const assignedCodes = new Set(assignedRoles.value.map((r) => r.code))

  return allStoreRoles
    .filter((role) => !assignedCodes.has(role.roleId))
    .map((role) => ({
      code: role.roleId ? role.roleId.toString() : 'N/A',
      name: role.roleName || 'N/A',
    }))
})

const filteredAvailableRoles = computed(() => {
  if (!searchCodeKeyword.value) {
    return availableRoles.value
  }
  const lowerCaseKeyword = searchCodeKeyword.value.toLowerCase()
  return availableRoles.value.filter(
    (role) =>
      role.code.toLowerCase().includes(lowerCaseKeyword) ||
      role.name.toLowerCase().includes(lowerCaseKeyword),
  )
})

const toggleAvailableSelection = (code: string) => {
  const index = selectedAvailableRoles.value.indexOf(code)
  if (index === -1) {
    selectedAvailableRoles.value.push(code)
  } else {
    selectedAvailableRoles.value.splice(index, 1)
  }
}

const toggleAssignedSelection = (code: string) => {
  const index = selectedAssignedAuths.value.indexOf(code) // Perhatikan: masih 'Auths'
  if (index === -1) {
    selectedAssignedAuths.value.push(code)
  } else {
    selectedAssignedAuths.value.splice(index, 1)
  }
}

const isAvailableSelected = (code: string) => {
  return selectedAvailableRoles.value.includes(code)
}

const isAssignedSelected = (code: string) => {
  return selectedAssignedAuths.value.includes(code) // Perhatikan: masih 'Auths'
}

const addSelectedAuths = () => {
  // Sebaiknya diganti namanya menjadi addSelectedRoles
  const itemsToAdd = availableRoles.value.filter((role) =>
    selectedAvailableRoles.value.includes(role.code),
  )

  itemsToAdd.forEach((item) => {
    if (!assignedRoles.value.some((role) => role.code === item.code)) {
      assignedRoles.value.push(item)
    }
  })

  selectedAvailableRoles.value = []
  updateRolePayload() // Panggil fungsi untuk meng-emit perubahan
}

const removeSelectedAuths = () => {
  // Sebaiknya diganti namanya menjadi removeSelectedRoles
  const codesToRemove = selectedAssignedAuths.value // Perhatikan: masih 'Auths'

  assignedRoles.value = assignedRoles.value.filter((role) => !codesToRemove.includes(role.code))

  selectedAssignedAuths.value = [] // Perhatikan: masih 'Auths'
  updateRolePayload() // Panggil fungsi untuk meng-emit perubahan
}

// Fungsi baru untuk meng-emit payload role
const updateRolePayload = () => {
  const newRolePayload: RolePayload = {
    selectedRoleIds: assignedRoles.value.map((role) => role.code),
  }
  emit('update:role-payload', newRolePayload)
}

// Validasi
const validateForm = () => {
  let isValid = true
  errors.assignedRoles = ''

  if (assignedRoles.value.length === 0) {
    errors.assignedRoles = 'Please select at least one role.'
    isValid = false
  }
  return isValid
}

// Watch untuk sinkronisasi props ke assignedRoles lokal
watch(
  () => props.rolePayload.selectedRoleIds,
  (newRoleIds) => {
    // Hanya perbarui jika ada perbedaan yang signifikan untuk mencegah loop tak terbatas
    const currentAssignedIds = assignedRoles.value.map((role) => role.code)
    if (JSON.stringify(currentAssignedIds.sort()) !== JSON.stringify(newRoleIds.sort())) {
      // Bangun assignedRoles berdasarkan newRoleIds dari semua peran yang tersedia
      const allRoles = userRoleStore.roles.items
      assignedRoles.value = newRoleIds
        .map((id) => {
          const foundRole = allRoles.find((r) => r.roleId === id)
          return {
            code: id,
            name: foundRole ? foundRole.roleName : 'Unknown Role',
          }
        })
        .filter((role) => role.name !== 'Unknown Role') // Filter out roles not found
    }
  },
  { deep: true },
)

// Data fetching on mount
onMounted(async () => {
  await userRoleStore.getAllUserRoles()
  // Setelah peran dimuat, inisialisasi assignedRoles dari props
  if (props.rolePayload.selectedRoleIds.length > 0) {
    const allRoles = userRoleStore.roles.items
    assignedRoles.value = props.rolePayload.selectedRoleIds
      .map((id) => {
        const foundRole = allRoles.find((r) => r.roleId === id)
        return {
          code: id,
          name: foundRole ? foundRole.roleName : 'Unknown Role',
        }
      })
      .filter((role) => role.name !== 'Unknown Role') // Filter out roles not found
  }
})

// Anda bisa menghapus bagian `inject` dan `watch(validationTrigger...)`
// jika Anda ingin mengelola validasi dan pengiriman data sepenuhnya melalui event emit
// dari komponen ini dan mengolahnya di parent.
// Namun, jika Anda tetap menggunakan pola inject untuk validasi dari parent,
// pastikan `allFormData` menerima `rolePayload` alih-alih `selectedAuthObjects`.

// Jika Anda ingin mempertahankan inject untuk validasi dari parent:
const validationTrigger = inject<Ref<number>>('validationTrigger', ref(0))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allFormData = inject<Record<string, any>>('allFormData')

watch(validationTrigger, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const isValid = validateForm()
    const formData: RolePayload = { selectedRoleIds: assignedRoles.value.map((role) => role.code) }

    // Update form data in injected object
    if (allFormData) {
      allFormData['role-step'] = formData
    }

    // Emit validation result and form data
    emit('validation-result', { isValid: isValid, formData: formData })
  }
})
</script>

<style scoped>
/* Scoped styles */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.table {
  min-width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.bg-blue-100 {
  background-color: #ebf8ff;
}
</style>
