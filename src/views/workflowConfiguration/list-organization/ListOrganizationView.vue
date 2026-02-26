<template>
  <div>
    <BreadcrumbView
      title="List Organization"
      :routes="[
        { name: 'Workflow Configuration', to: '/workflow-list' },
        { name: 'List Organization', to: '#' },
      ]"
    />
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">List Organization</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search by Code / Name" />

            <UiButton variant="primary" @click="openAddModal">
              <UiIcon variant="duotone" name="plus" />
              Add Organization
            </UiButton>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div
          v-if="filteredList.length > 0"
          class="integration__table border border-gray-200 rounded-xl overflow-x-auto"
        >
          <table class="table align-middle text-gray-700 font-medium text-sm min-w-[1000px]">
            <thead>
              <tr>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500 w-[50px]"></th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Company Code</th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Company Name</th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Status</th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Created Date</th>
                <th class="!border-b-teal-500 !bg-teal-100 !text-teal-500">Created By</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in pagedList"
                :key="item.id"
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
                            @click="openEditModal(item)"
                          >
                            <UiIcon name="pencil" class="mr-2" />
                            Edit
                          </UiButton>
                          <UiButton
                            variant="light"
                            class="border-none text-red-500 hover:text-red-600"
                            :outline="true"
                            size="md"
                            @click="handleDelete(item)"
                          >
                            <UiIcon name="trash" class="mr-2" />
                            Delete
                          </UiButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <router-link
                    :to="{ name: 'organization-structure', params: { id: item.id } }"
                    class="text-primary hover:text-teal-800 font-semibold cursor-pointer"
                  >
                    {{ item.companyCode }}
                  </router-link>
                </td>
                <td>{{ item.companyName }}</td>
                <td>
                  <span
                    class="badge badge-outline"
                    :class="item.status === 'Active' ? 'badge-success' : 'badge-danger'"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td>{{ item.createdDate }}</td>
                <td>{{ item.createdBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-4">No data found.</div>

        <LPagination
          v-if="filteredList.length > 0"
          class="mt-4"
          :totalItems="filteredList.length"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @page-change="changePage"
        />
      </div>

      <OrganizationFormModal
        v-model="modalVisible"
        :initialData="selectedItem"
        @submit="handleFormSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import OrganizationFormModal from './components/OrganizationFormModal.vue'
import type { Organization } from './types'

// State
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const modalVisible = ref(false)
const selectedItem = ref<Organization | null>(null)

// Mock Data
const dataList = ref<Organization[]>([
  {
    id: '1',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    status: 'Active',
    createdDate: '10.10.2025',
    createdBy: 'Joko',
  },
  {
    id: '2',
    companyCode: 'MB00',
    companyName: 'Batu',
    status: 'Active',
    createdDate: '11.10.2025',
    createdBy: 'Siti',
  },
])

const filteredList = computed(() => {
  let list = dataList.value

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (item) =>
        item.companyCode.toLowerCase().includes(q) || item.companyName.toLowerCase().includes(q),
    )
  }

  return list
})

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

// Methods
const changePage = (page: number) => {
  currentPage.value = page
}

const openAddModal = () => {
  selectedItem.value = null
  modalVisible.value = true
}

const openEditModal = (item: Organization) => {
  selectedItem.value = { ...item }
  modalVisible.value = true
}

const handleDelete = (item: Organization) => {
  if (confirm(`Are you sure you want to delete ${item.companyName}?`)) {
    dataList.value = dataList.value.filter((i) => i.id !== item.id)
  }
}

const handleFormSubmit = (data: Organization) => {
  if (data.id) {
    // Edit
    const index = dataList.value.findIndex((i) => i.id === data.id)
    if (index !== -1) {
      dataList.value[index] = data
    }
  } else {
    // Add
    const newId = (Math.max(...dataList.value.map((i) => parseInt(i.id || '0'))) + 1).toString()
    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '.') // Format DD.MM.YYYY
    dataList.value.unshift({ ...data, id: newId, createdDate: today, createdBy: 'Admin' })
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/integration-list.scss';
// Actually RequisitionerMasterListView reused from a relative path that might not work here if not adjusted.
// Let's replicate the basic style if the SCSS file is not easily shareable or just use the same class names assuming global styles or relative path fix.
// RequisitionerMaster used: @use '../styles/integration-list.scss'; which was likely src/views/workflowConfiguration/requisitionerMaster/styles/...
// But I moved it.
// Let's assume standard styles for now or just define the table style locally if needed.

.integration__field-items {
  transition: background-color 0.2s;
  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f1f4;
  }
}
</style>
