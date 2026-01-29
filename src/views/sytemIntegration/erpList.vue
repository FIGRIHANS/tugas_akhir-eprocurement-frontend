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
          <h2 class="text-lg font-bold text-slate-800">ERP Integration List</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search Role" />
            <UiButton variant="primary" @click="addErp()">
              <UiIcon variant="duotone" name="plus" />
              Add ERP
            </UiButton>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div v-if="userRoleStore.loading" class="text-center py-4">Loading roles...</div>
        <div v-else-if="userRoleStore.error" class="text-center py-4 text-red-500">
          Error: {{ userRoleStore.error }}
        </div>

        <table v-else-if="filteredRoles.length > 0" class="table align-middle text-gray-700 border-gray-100">
          <thead>
            <tr>
              <th></th>
              <th class="text-nowrap" v-for="item in Columns" :key="item.name">{{ item.name }}</th>
              <!-- <th class="text-nowrap">Company Code</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th>
              <th class="text-nowrap">System Client</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in erpList" :key="role.companyCode">
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
                        >
                          <UiIcon name="pencil" class="mr-2" />
                          Edit Role
                        </UiButton>
                        <UiButton
                          variant="light"
                          class="border-none text-red-500 hover:text-red-600"
                          :outline="true"
                          size="md"
                        >
                          <UiIcon name="trash" class="mr-2" />
                          Delete Role
                        </UiButton>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ role.connectionCode }}</td>
              <td>{{ role.companyCode }}</td>
              <td>{{ role.systemClient }}</td>
              <td>{{ role.erp }}</td>
              <td>{{ role.status }}</td>
              <td>{{ role.totalIntegration }}</td>
              <td>{{ role.inbound }}</td>
              <td>{{ role.outBound }}</td>
              <td>{{ new Date(role.lastChange).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center py-4">No roles found.</div>

        <LPagination
          :totalItems="userRoleStore.roles.total"
          :pageSize="userRoleStore.roles.pageSize"
          :currentPage="userRoleStore.roles.page"
          @page-change="userRoleStore.changePage"
        />
      </div>
    </div>

    <!-- Add/Edit modal -->
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

    <!-- success modal -->
    <UiModal v-model="showModalSuccess" size="sm" @update:model-value="showModalSuccess = false">
      <img :src="successImg" alt="success" class="mx-auto mb-3" />
      <h3 class="font-medium text-lg text-gray-800 text-center">
        Role successfully {{ rolePayload.roleId === 0 ? 'Created' : 'Updated' }}
      </h3>
    </UiModal>

    <!-- delete confirm modal -->
    <UiModal v-model="showDeleteModal" size="sm">
      <div class="text-center mb-6">
        <UiIcon
          name="cross-circle"
          variant="duotone"
          class="text-[150px] text-danger text-center"
        />
      </div>
      <h3 class="text-center text-lg font-medium">Are you sure to delete this role?</h3>
      <p class="text-center text-base text-gray-600 mb-5">
        This action will permanently deactivate
        <strong v-if="roleToDelete">{{ roleToDelete.roleName }}</strong
        >.
      </p>
      <div class="flex gap-3 px-8 mb-3">
        <UiButton
          outline
          @click="showDeleteModal = false"
          class="flex-1 flex items-center justify-center"
        >
          <UiIcon name="black-left-line" />
          <span>Cancel</span>
        </UiButton>
        <UiButton
          variant="danger"
          class="flex-1 flex items-center justify-center"
          @click="handleProcessDelete"
          :disabled="isDeleting"
        >
          <template v-if="isDeleting">
            <span>Deleting...</span>
          </template>
          <template v-else>
            <UiIcon name="cross-circle" variant="duotone" />
            <span>Delete</span>
          </template>
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

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
import LPagination from '@/components/pagination/LPagination.vue'
import router from '@/router'

const search = ref('')
const userRoleStore = useUserRoleStore()

const isModalOpen = ref(false)

const showModalSuccess = ref(false)

const showDeleteModal = ref(false)
const roleToDelete = ref<IRole | null>(null)
const isDeleting = ref(false)

const rolePayload = reactive<{
  roleId: number
  roleName: string
  isActive: boolean
}>({
  roleId: 0,
  roleName: '',
  isActive: true,
})

const Columns = ref([
    {
        name: 'Connection Code'
    },
    {
        name: 'Company Code'
    },
    {
        name: 'System Client'
    },
    {
        name: 'ERP'
    },
    {
        name: 'Status'
    },
    {
        name: 'Total Integration'
    },
    {
        name: 'Inbound'
    },
    {
        name: 'Outbound'
    },
    {
        name: 'Last Changed'
    },
])

const erpList = ref([
    {
        connectionCode: 'EVOSAP01',
        companyCode: 'MF00',
        systemClient: 'PRD',
        erp: 'SAP',
        status: 'Active',
        totalIntegration: 10,
        inbound: 5,
        outBound: 3,
        lastChange: '03-06-2025'
    },
    {
        connectionCode: 'EVOSAP02',
        companyCode: 'MF00',
        systemClient: 'PRD',
        erp: 'SAP',
        status: 'Active',
        totalIntegration: 10,
        inbound: 5,
        outBound: 3,
        lastChange: '03-06-2025'
    },
])

const roleNameError = ref('')
const isSaving = ref(false)

const modalTitle = computed(() => (rolePayload.roleId === 0 ? 'Add New Role' : 'Edit Role'))

const filteredRoles = computed(() => {
  const items = userRoleStore.roles?.items ?? []
  const q = search.value.toLowerCase().trim()
  if (!q) return items
  return items.filter((r) => r.roleName.toLowerCase().includes(q))
})

// const closeAnyOpenDropdown = () => {
//   const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true })
//   document.body.dispatchEvent(event)
// }

const resetRolePayload = () => {
  rolePayload.roleId = 0
  rolePayload.roleName = ''
  rolePayload.isActive = true
  roleNameError.value = ''
}

const addErp = () => {
    router.push({
      name: 'add-erp',
    })
}

// const openRoleModal = (role?: IRole) => {
//   closeAnyOpenDropdown()
//   if (role) {
//     rolePayload.roleId = role.roleId
//     rolePayload.roleName = role.roleName
//     rolePayload.isActive = role.isActive
//   } else {
//     resetRolePayload()
//   }
//   isModalOpen.value = true
// }

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
  if (!validateRoleName()) return
  isSaving.value = true
  try {
    await userRoleStore.postUserRole(rolePayload)
    closeRoleModal()
    showModalSuccess.value = true
    await userRoleStore.getAllUserRoles({
      page: 1,
      pageSize: 10,
    })
  } catch (error: unknown) {
    console.error('Failed to save role:', error)
    alert(`Failed to save role: ${String(error) || 'An unknown error occurred.'}`)
  } finally {
    isSaving.value = false
  }
}

/** ===== Delete via UiModal (NEW) ===== */
// function openDeleteModal(role: IRole) {
//   closeAnyOpenDropdown()
//   roleToDelete.value = role
//   showDeleteModal.value = true
// }

async function handleProcessDelete() {
  if (!roleToDelete.value) return
  isDeleting.value = true
  try {
    // soft delete: set isActive = false
    await userRoleStore.postUserRole({
      roleId: roleToDelete.value.roleId,
      roleName: roleToDelete.value.roleName,
      isActive: false,
    })
    showDeleteModal.value = false
    roleToDelete.value = null
    await userRoleStore.getAllUserRoles({
      page: 1,
      pageSize: 10,
    })
  } catch (error: unknown) {
    console.error('Failed to delete role:', error)
    alert(`Failed to delete role: ${String(error) || 'An unknown error occurred.'}`)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  userRoleStore.getAllUserRoles({
    page: 1,
    pageSize: 10,
  })
})
</script>

<style scoped></style>
