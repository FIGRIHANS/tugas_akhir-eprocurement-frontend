<template>
  <div>
    <BreadcrumbView
      title="ERP Integration List"
      :routes="[
        { name: 'ERP Integration List', to: '#' },
        // { name: 'Master Role', to: '#' },
      ]"
    />

    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">ERP Integration List</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search ERP" />
            <!-- Filter Dropdown -->
            <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
              <button class="dropdown-toggle btn btn-primary">
                <i class="ki-filled ki-filter"></i>
                Filter
              </button>
              <div class="dropdown-content w-full max-w-[305px] p-[16px]">
                <p class="text-lg font-semibold mb-[8px]">Filter</p>
                <div class="flex flex-col gap-[24px] py-[16px]">
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Company Code</label
                    >
                    <select v-model="filters.companyCode" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of companyOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >ERP</label
                    >
                    <select v-model="filters.erp" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of erpOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Process Group</label
                    >
                    <select v-model="filters.processGroup" class="select" name="select">
                      <option value="">All</option>
                      <option
                        v-for="item of processGroupOptions"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                  <div class="relative">
                    <label
                      class="absolute text-xs font-normal text-gray-500 -top-[8px] left-[10px] bg-white"
                      >Status</label
                    >
                    <select v-model="filters.status" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="item of statusOptions" :key="item.value" :value="item.value">
                        {{ item.text }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex align-center justify-between gap-[16px]">
                  <button class="btn btn-outline btn-primary btn-lg" @click="resetFilters">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                  </button>
                  <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true">
                    <i class="ki-filled ki-check-circle"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <UiButton variant="primary" @click="addErp()">
              <UiIcon variant="duotone" name="plus" />
              Add ERP
            </UiButton>
          </div>
        </div>
      </div>
      <div class="card-body integration">
        <div>
          <div v-if="userRoleStore.loading" class="text-center py-4">Loading roles...</div>
          <div v-else-if="userRoleStore.error" class="text-center py-4 text-red-500">
            Error: {{ userRoleStore.error }}
          </div>

          <div
            v-else-if="filteredRoles.length > 0"
            class="integration__table border border-gray-200 rounded-xl overflow-x-auto"
          >
            <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1200px]">
              <thead>
                <tr>
                  <th
                    class="integration__field-base !border-b-teal-500 !bg-teal-100 !text-teal-500"
                  ></th>
                  <th
                    class="text-nowrap integration__field-base !border-b-teal-500 !bg-teal-100 !text-teal-500"
                    v-for="item in Columns"
                    :key="item.name"
                  >
                    {{ item.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="role in filteredErpList"
                  :key="role.connectionCode"
                  class="integration__field-items hover:bg-primary-light"
                >
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
                              @click="viewDetail(role.connectionCode)"
                            >
                              <UiIcon name="pencil" class="mr-2" />
                              Edit Integration
                            </UiButton>
                            <UiButton
                              variant="light"
                              class="border-none text-red-500 hover:text-red-600"
                              :outline="true"
                              size="md"
                              @click="deleteErp(role.connectionCode)"
                            >
                              <UiIcon name="trash" class="mr-2" />
                              Delete Integration
                            </UiButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="font-medium">{{ role.connectionCode }}</span>
                  </td>
                  <td>{{ role.companyCode }}</td>
                  <td>{{ role.companyName }}</td>
                  <td>{{ role.systemClient }}</td>
                  <td>{{ role.erp }}</td>
                  <td>{{ role.processGroup }}</td>
                  <td>
                    <span
                      class="badge badge-outline border-transparent bg-green-50 text-green-600"
                      >{{ role.status }}</span
                    >
                  </td>
                  <td class="text-center">{{ role.totalIntegration }}</td>
                  <td class="text-center">{{ role.inbound }}</td>
                  <td class="text-center">{{ role.outBound }}</td>
                  <td>{{ role.lastChange }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-4">No roles found.</div>
        </div>

        <LPagination
          class="mt-4"
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
      <div class="m-5">
        <img :src="successImg" alt="success" class="mx-auto mb-3" />
        <h3 class="font-medium text-lg text-gray-800 text-center">
          Integration successfully Deleted
        </h3>

        <!-- <UiButton variant="primary" @click="showModalSuccess = false">Close</UiButton> -->
      </div>
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
import { useSystemIntegrationStore } from '@/stores/system-integration/systemIntegration'

const search = ref('')
const userRoleStore = useUserRoleStore()

const isModalOpen = ref(false)

const showModalSuccess = ref(false)

const showDeleteModal = ref(false)
const roleToDelete = ref<IRole | null>(null)
const isDeleting = ref(false)

const systemIntegrationStore = useSystemIntegrationStore()

const data = computed(() => systemIntegrationStore.erpList)

const rolePayload = reactive<{
  roleId: number
  roleName: string
  isActive: boolean
}>({
  roleId: 0,
  roleName: '',
  isActive: true,
})

const filters = reactive({
  companyCode: undefined,
  erp: undefined,
  processGroup: undefined,
  status: undefined,
})

const companyOptions = [
  { text: 'MF00', value: 'MF00' },
  { text: 'MF01', value: 'MF01' },
]

const erpOptions = [
  { text: 'SAP HANA 2020', value: 'SAP HANA 2020' },
  { text: 'SAP HANA 2023', value: 'SAP HANA 2023' },
  { text: 'SAP ECC 6 EHP 7', value: 'SAP ECC 6 EHP 7' },
  { text: 'Odoo 17', value: 'Odoo 17' },
]

const processGroupOptions = [
  { text: 'Invoice Management', value: 'Invoice Management' },
  { text: 'Vendor Management', value: 'Vendor Management' },
  { text: 'Procurement Management', value: 'Procurement Management' },
]

const statusOptions = [
  { text: 'Active', value: 'Active' },
  { text: 'Inactive', value: 'Inactive' },
]

const resetFilters = () => {
  filters.companyCode = undefined
  filters.erp = undefined
  filters.processGroup = undefined
  filters.status = undefined
}

const Columns = ref([
  {
    name: 'Connection Code',
  },
  {
    name: 'Company Code',
  },
  {
    name: 'Company Name',
  },
  {
    name: 'System Client',
  },
  {
    name: 'ERP',
  },
  {
    name: 'Process Group',
  },
  {
    name: 'Status',
  },
  {
    name: 'Total Integration',
  },
  {
    name: 'Inbound',
  },
  {
    name: 'Outbound',
  },
  {
    name: 'Last Changed',
  },
])

const erpList = ref([
  // {
  //   connectionCode: 'EVOSAP01',
  //   companyCode: 'MF00',
  //   companyName: 'Petrosea',
  //   systemClient: 'PRD',
  //   erp: 'SAP',
  //   processGroup: 'Invoice Management',
  //   status: 'Active',
  //   totalIntegration: 10,
  //   inbound: 5,
  //   outBound: 3,
  //   lastChange: '03/06/2025 11/10/15',
  // },
  // {
  //   connectionCode: 'EVOSAP02',
  //   companyCode: 'MF00',
  //   companyName: 'Petrosea',
  //   systemClient: 'PRD',
  //   erp: 'SAP',
  //   processGroup: 'Vendor Management',
  //   status: 'Active',
  //   totalIntegration: 10,
  //   inbound: 5,
  //   outBound: 3,
  //   lastChange: '03/06/2025 11/10/15',
  // },
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

const filteredErpList = computed(() => {
  let list = erpList.value

  // Global search
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (item) =>
        item.connectionCode.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.processGroup.toLowerCase().includes(q),
    )
  }

  // Column filters
  if (filters.companyCode) {
    list = list.filter((item) => item.companyCode === filters.companyCode)
  }
  if (filters.erp) {
    list = list.filter((item) => item.erp === filters.erp)
  }
  if (filters.processGroup) {
    list = list.filter((item) => item.processGroup === filters.processGroup)
  }
  if (filters.status) {
    list = list.filter((item) => item.status === filters.status)
  }

  return list
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

const viewDetail = (id: string) => {
  router.push({
    name: 'erp-integration-detail',
    params: { id },
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

const deleteErp = async (erpId: string) => {
  console.log(erpId, 'ini erpId')

  systemIntegrationStore.deleteErp(erpId)

  erpList.value = data.value

  showModalSuccess.value = true
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
  erpList.value = data.value

  userRoleStore.getAllUserRoles({
    page: 1,
    pageSize: 10,
  })
})
</script>

<style lang="scss" scoped>
@use '../workflowConfiguration/styles/integration-list.scss';
</style>
