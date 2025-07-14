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
                v-for="auth in filteredAvailableRoles"
                :key="auth.code"
                @click="toggleAvailableSelection(auth.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAvailableSelected(auth.code) }"
              >
                <td>{{ auth.code }}</td>
                <td>{{ auth.name }}</td>
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
              <tr v-if="assignedAuths.length === 0">
                <td colspan="2" class="text-center text-gray-500 py-4">
                  No role objects selected.
                </td>
              </tr>
              <tr
                v-for="auth in assignedAuths"
                :key="auth.code"
                @click="toggleAssignedSelection(auth.code)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-100': isAssignedSelected(auth.code) }"
              >
                <td>{{ auth.code }}</td>
                <td>{{ auth.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-if="errors.assignedAuths" class="text-red-500 text-sm mt-4 text-center">
      {{ errors.assignedAuths }}
    </p>
  </div>
</template>

<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import { ref, reactive, computed, watch, inject, onMounted, type Ref } from 'vue'
// Import the provided store
import { useUserRoleStore } from '@/stores/user-management/role' // Updated import path

// Define the interface for AuthObject, assuming IRole from the store is compatible (contains code and name)
interface AuthObject {
  code: string
  name: string
}

// Initialize the store
const userRoleStore = useUserRoleStore()

// Local state for assigned roles (since the store only fetches all roles, we manage assigned state locally)
const assignedAuths = ref<AuthObject[]>([])

// Reactive state for selection tracking and errors
const searchCodeKeyword = ref('')
const selectedAvailableRoles = ref<string[]>([])
const selectedAssignedAuths = ref<string[]>([])
const errors = reactive({
  assignedAuths: '',
})

// Computed property for available roles
const availableRoles = computed<AuthObject[]>(() => {
  // Get all roles from the store
  const allStoreRoles = userRoleStore.roles.items

  // Get codes of locally assigned roles
  const assignedCodes = new Set(assignedAuths.value.map(r => r.code))

  // Filter the store roles to show only those that are not in assignedAuths
  // We map the IRole structure from the store to AuthObject structure used in the component template.
  return allStoreRoles.filter(role => !assignedCodes.has(role.roleId)).map(role => ({
    // Assuming IRole has roleId and roleName properties that map to code and name.
    code: role.roleId ? role.roleId.toString() : 'N/A', // Adjust based on actual IRole structure
    name: role.roleName || 'N/A' // Adjust based on actual IRole structure
  }));
});

// Filter available roles based on search keyword
const filteredAvailableRoles = computed(() => {
  if (!searchCodeKeyword.value) {
    return availableRoles.value
  }
  const lowerCaseKeyword = searchCodeKeyword.value.toLowerCase()
  return availableRoles.value.filter(
    (auth) =>
      auth.code.toLowerCase().includes(lowerCaseKeyword) ||
      auth.name.toLowerCase().includes(lowerCaseKeyword),
  )
})

console.log(filteredAvailableRoles)

// Selection management functions (unchanged)
const toggleAvailableSelection = (code: string) => {
  const index = selectedAvailableRoles.value.indexOf(code)
  if (index === -1) {
    selectedAvailableRoles.value.push(code)
  } else {
    selectedAvailableRoles.value.splice(index, 1)
  }
}

const toggleAssignedSelection = (code: string) => {
  const index = selectedAssignedAuths.value.indexOf(code)
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
  return selectedAssignedAuths.value.includes(code)
}

// Action functions (Add/Remove roles)
const addSelectedAuths = () => {
  // Find the AuthObject items that correspond to the selected codes in the available list
  const itemsToAdd = availableRoles.value.filter((auth) =>
    selectedAvailableRoles.value.includes(auth.code),
  )

  // Add items to the local assignedAuths state
  itemsToAdd.forEach((item) => {
    if (!assignedAuths.value.some((auth) => auth.code === item.code)) {
      assignedAuths.value.push(item)
    }
  })

  // Clear selection
  selectedAvailableRoles.value = []
}

const removeSelectedAuths = () => {
  const codesToRemove = selectedAssignedAuths.value

  // Filter the assignedAuths state to remove selected items
  assignedAuths.value = assignedAuths.value.filter(
    (auth) => !codesToRemove.includes(auth.code)
  )

  // Clear selection
  selectedAssignedAuths.value = []
}

// Validation and data passing (Injects and Watch)
const validateForm = () => {
  let isValid = true
  errors.assignedAuths = ''

  if (assignedAuths.value.length === 0) {
    errors.assignedAuths = 'Please select at least one role.'
    isValid = false
  }
  return isValid
}

const validationTrigger = inject<Ref<number>>('validationTrigger', ref(0))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allFormData = inject<Record<string, any>>('allFormData')

const emit = defineEmits(['validation-result'])

// Watch for validation trigger from parent component
watch(validationTrigger, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const isValid = validateForm()
    const formData = { selectedAuthObjects: assignedAuths.value.map((auth) => auth.code) }

    // Update form data in injected object
    if (allFormData) {
      allFormData['role-step'] = formData
    }

    // Emit validation result and form data
    emit('validation-result', { isValid: isValid, formData: formData })
  }
})

// Data fetching on mount
onMounted(async () => {
  // Fetch all roles using the provided store action
  await userRoleStore.getAllUserRoles()
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
