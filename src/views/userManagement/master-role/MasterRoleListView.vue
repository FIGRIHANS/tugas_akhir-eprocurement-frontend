<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiModal from '@/components/modal/UiModal.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { useUserRoleStore } from '@/stores/user-management/role'
import type { IRole } from '@/stores/user-management/types/role'
import { computed, onMounted, reactive, ref } from 'vue'
import successImg from '@/assets/success.svg'

const search = ref('')
const userRoleStore = useUserRoleStore()
const isModalOpen = ref(false)
const showModalSuccess = ref(false)

const rolePayload = reactive<{
  roleId: number
  roleName: string
  isActive: boolean
}>({
  roleId: 0,
  roleName: '',
  isActive: true,
})

const roleNameError = ref('')
const isSaving = ref(false)

const modalTitle = computed(() => (rolePayload.roleId === 0 ? 'Add New Role' : 'Edit Role'))

const filteredRoles = computed(() => {
  if (!userRoleStore.roles?.items) {
    return []
  }
  const searchTerm = search.value.toLowerCase().trim()
  if (!searchTerm) {
    return userRoleStore.roles.items
  }
  return userRoleStore.roles.items.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm),
  )
})

const closeAnyOpenDropdown = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  document.body.dispatchEvent(event)
}

const resetRolePayload = () => {
  rolePayload.roleId = 0
  rolePayload.roleName = ''
  rolePayload.isActive = true
  roleNameError.value = ''
}

const openRoleModal = (role?: IRole) => {
  closeAnyOpenDropdown()
  if (role) {
    rolePayload.roleId = role.roleId
    rolePayload.roleName = role.roleName
    rolePayload.isActive = role.isActive
  } else {
    resetRolePayload()
  }
  isModalOpen.value = true
}

const closeRoleModal = () => {
  isModalOpen.value = false
  resetRolePayload()
}

const validateRoleName = () => {
  if (!rolePayload.roleName.trim()) {
    roleNameError.value = 'Role name cannot be empty!'
    return false
  }
  roleNameError.value = ''
  return true
}

const saveRole = async () => {
  if (!validateRoleName()) {
    return
  }

  isSaving.value = true
  try {
    await userRoleStore.postUserRole(rolePayload)
    closeRoleModal()
    // alert(rolePayload.roleId === 0 ? 'Role added successfully!' : 'Role updated successfully!')
    showModalSuccess.value = true
    await userRoleStore.getAllUserRoles()
  } catch (error: unknown) {
    console.error('Failed to save role:', error)
    alert(`Failed to save role: ${error || 'An unknown error occurred.'}`)
  } finally {
    isSaving.value = false
  }
}

const deleteRole = async (role: IRole) => {
  closeAnyOpenDropdown()
  if (!confirm(`Are you sure you want to delete role "${role.roleName}"?`)) {
    return
  }

  try {
    await userRoleStore.postUserRole({
      roleId: role.roleId,
      roleName: role.roleName,
      isActive: false,
    })
    alert(`Role "${role.roleName}" deleted successfully!`)
    await userRoleStore.getAllUserRoles()
  } catch (error: unknown) {
    console.error('Failed to delete role:', error)
    alert(`Failed to delete role: ${error || 'An unknown error occurred.'}`)
  }
}

onMounted(() => {
  userRoleStore.getAllUserRoles()
})
</script>

<template>
  <div>
    <BreadcrumbView
      title="Master Role"
      :routes="[
        { name: 'User Management', to: '/user-management/user' },
        { name: 'Master Role', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Master Role</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Role" />
            <UiButton variant="primary" @click="openRoleModal()">
              <UiIcon variant="duotone" name="plus" />
              Add Role
            </UiButton>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="userRoleStore.loading" class="text-center py-4">Loading roles...</div>
        <div v-else-if="userRoleStore.error" class="text-center py-4 text-red-500">
          Error: {{ userRoleStore.error }}
        </div>
        <table v-else-if="filteredRoles.length > 0" class="table align-middle text-gray-700">
          <thead>
            <tr>
              <th></th>
              <th class="text-nowrap">Role ID</th>
              <th class="text-nowrap">Role Name</th>
              <th class="text-nowrap">Created Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in filteredRoles" :key="role.roleId">
              <td>
                <div class="flex items-center space-x-3">
                  <div
                    class="dropdown"
                    data-dropdown="true"
                    data-dropdown-trigger="click"
                    data-dropdown-placement="bottom-end"
                  >
                    <UiButton
                      class="dropdown-toggle"
                      variant="light"
                      :outline="true"
                      :icon="true"
                      size="sm"
                    >
                      <UiIcon name="dots-vertical" />
                    </UiButton>
                    <div class="dropdown-content w-auto p-4 space-y-2">
                      <div class="flex flex-col space-y-2">
                        <UiButton
                          variant="light"
                          class="border-none"
                          :outline="true"
                          size="md"
                          @click="openRoleModal(role)"
                        >
                          <UiIcon name="pencil" class="mr-2" />
                          Edit Role
                        </UiButton>
                        <UiButton
                          variant="light"
                          class="border-none text-red-500 hover:text-red-600"
                          :outline="true"
                          size="md"
                          @click="deleteRole(role)"
                        >
                          <UiIcon name="trash" class="mr-2" />
                          Delete Role
                        </UiButton>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ role.roleId }}</td>
              <td>{{ role.roleName }}</td>
              <td>{{ new Date(role.createdUtcDate).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-4">No roles found.</div>
      </div>
    </div>
    <UiModal
      :title="modalTitle"
      v-model="isModalOpen"
      @update:model-value="closeRoleModal"
      size="sm"
    >
      <UiInput
        label="Role Name"
        placeholder="Enter role name"
        row
        required
        v-model="rolePayload.roleName"
        :error="roleNameError !== ''"
        :hint-text="roleNameError"
        @input="validateRoleName()"
      />
      <div class="mt-4 w-full gap-2 justify-end items-center flex">
        <UiButton outline @click="closeRoleModal">Cancel</UiButton>
        <UiButton variant="primary" @click="saveRole" :disabled="isSaving">
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save</span>
        </UiButton>
      </div>
    </UiModal>

    <!-- Modal success message -->
    <UiModal v-model="showModalSuccess" size="sm" @update:model-value="!showModalSuccess">
      <img :src="successImg" alt="success" class="mx-auto mb-3" />
      <h3 class="font-medium text-lg text-gray-800 text-center">
        Role successfully {{ rolePayload.roleId === 0 ? 'Created' : 'Updated' }}
      </h3>
    </UiModal>

    <!-- Modal delete confirm -->
  </div>
</template>

<style scoped></style>
