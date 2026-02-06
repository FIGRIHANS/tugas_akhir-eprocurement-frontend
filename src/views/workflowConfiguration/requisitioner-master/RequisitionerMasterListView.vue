<template>
  <div>
    <BreadcrumbView
      title="Requisitioner Master"
      :routes="[
        { name: 'Workflow Configuration', to: '/workflow-list' },
        { name: 'Requisitioner Master', to: '#' },
      ]"
    />
    <div class="card">
      <div class="card-header">
        <div class="flex w-full justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">Requisitioner Master</h2>
          <div class="flex gap-2">
            <UiInputSearch v-model="search" placeholder="Search by Code / Name" />

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
                      >Department</label
                    >
                    <select v-model="filterDepartment" class="select" name="select">
                      <option value="">All</option>
                      <option v-for="dept in departmentOptions" :key="dept" :value="dept">
                        {{ dept }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex align-center justify-between gap-[16px]">
                  <button class="btn btn-outline btn-primary btn-lg" @click="filterDepartment = ''">
                    <i class="ki-duotone ki-arrows-circle"></i>
                    Reset
                  </button>
                  <!-- Apply logic is instant for local data, but following pattern -->
                  <button class="btn btn-primary btn-lg" data-dropdown-dismiss="true">
                    <i class="ki-filled ki-check-circle"></i>
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <UiButton variant="primary" @click="openAddModal">
              <UiIcon variant="duotone" name="plus" />
              Add Requisitioner
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
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500"></th>
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">Company Code</th>
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">Company Name</th>
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">Department</th>
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">Requisitioner Code</th>
                <th class="!border-b-blue-500 !bg-blue-100 !text-blue-500">Requisitioner Name</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in pagedList"
                :key="item.id"
                class="integration__field-items hover:bg-blue-50"
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
                <td>{{ item.companyCode }}</td>
                <td>{{ item.companyName }}</td>
                <td>{{ item.department }}</td>
                <td>{{ item.requisitionerCode }}</td>
                <td class="max-w-[300px] truncate" :title="item.requisitionerName">
                  {{ item.requisitionerName }}
                </td>
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

      <RequisitionerFormModal
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
import RequisitionerFormModal from './components/RequisitionerFormModal.vue'
import type { Requisitioner } from './types'

// State
const search = ref('')
const filterDepartment = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const modalVisible = ref(false)
const selectedItem = ref<Requisitioner | null>(null)

// Mock Data
const dataList = ref<Requisitioner[]>([
  {
    id: '1',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    department: 'Tax',
    requisitionerCode: 'TAXREQ01',
    requisitionerName: 'Professional Services',
    status: 'Active',
  },
  {
    id: '2',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    department: 'Tax',
    requisitionerCode: 'TAXREQ02',
    requisitionerName: 'Tax Compliance & Governance',
    status: 'Active',
  },
  {
    id: '3',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    department: 'IT Infrastructure',
    requisitionerCode: 'ITREQ01',
    requisitionerName: 'Software & Licenses',
    status: 'Active',
  },
  {
    id: '4',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    department: 'IT Infrastructure',
    requisitionerCode: 'ITREQ02',
    requisitionerName: 'Infrastructure Networks',
    status: 'Active',
  },
  {
    id: '5',
    companyCode: 'MF00',
    companyName: 'Petrosea',
    department: 'IT Infrastructure',
    requisitionerCode: 'ITREQ03',
    requisitionerName: 'Professional Services',
    status: 'Active',
  },
])

const departmentOptions = computed(() => {
  const depts = new Set(dataList.value.map((item) => item.department))
  return Array.from(depts)
})

const filteredList = computed(() => {
  let list = dataList.value

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (item) =>
        item.requisitionerCode.toLowerCase().includes(q) ||
        item.requisitionerName.toLowerCase().includes(q),
    )
  }

  if (filterDepartment.value) {
    list = list.filter((item) => item.department === filterDepartment.value)
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

const openEditModal = (item: Requisitioner) => {
  selectedItem.value = { ...item }
  modalVisible.value = true
}

const handleDelete = (item: Requisitioner) => {
  if (confirm(`Are you sure you want to delete ${item.requisitionerCode}?`)) {
    dataList.value = dataList.value.filter((i) => i.id !== item.id)
  }
}

const handleFormSubmit = (data: Requisitioner) => {
  if (data.id) {
    // Edit
    const index = dataList.value.findIndex((i) => i.id === data.id)
    if (index !== -1) {
      dataList.value[index] = data
    }
  } else {
    // Add
    const newId = (Math.max(...dataList.value.map((i) => parseInt(i.id || '0'))) + 1).toString()
    dataList.value.unshift({ ...data, id: newId })
  }
}
</script>

<style lang="scss" scoped>
// Reuse existing styles logic or define new ones.
// Assuming global styles or imported SCSS.
// If integration-list.scss is reusable:
@use '../styles/integration-list.scss';

.integration__field-items {
  transition: background-color 0.2s;
  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f1f4;
  }
}
</style>
