<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>

      <UiButton variant="primary" @click="openModalForm">
        <UiIcon name="plus-circle" variant="duotone" />
        Add
      </UiButton>
    </div>

    <div class="flex flex-col gap-4 pb-4">
      <div class="card-table">
        <table class="table align-middle">
          <thead class="text-nowrap">
            <tr>
              <th v-for="(col, index) in tabCols" :key="col" :class="index === 0 ? 'w-[70px]' : ''">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="text-nowrap">
            <!-- loading -->
            <tr v-if="expertPStore.loading">
              <th class="text-center" :colspan="tabCols.length">
                <UiLoading size="lg" />
              </th>
            </tr>

            <!-- error -->
            <tr v-else-if="expertPStore.error">
              <th class="text-center text-danger" :colspan="tabCols.length">
                {{ expertPStore.error }}
              </th>
            </tr>

            <!-- empty -->
            <tr v-else-if="pagination.total === 0">
              <th class="text-center" :colspan="tabCols.length">No data</th>
            </tr>

            <tr v-else v-for="(item, index) in dataResponse" :key="'expert' + index">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div class="menu-item text-primary" @click="downloadFile(item.id)">
                        <span class="menu-link">
                          <UiIcon name="eye" variant="duotone" class="menu-icon" />
                          View Detail
                        </span>
                      </div>
                      <div class="menu-item text-warning" @click="editData(item.id)">
                        <span class="menu-link">
                          <UiIcon name="notepad-edit" variant="duotone" class="menu-icon" />
                          Edit
                        </span>
                      </div>
                      <div class="menu-item text-danger" @click="deleteData(item.id)">
                        <span class="menu-link">
                          <UiIcon name="cross-circle" variant="duotone" class="menu-icon" />
                          Hapus
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.education }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.yearOfExperience }}</td>
              <td>{{ item.expertise }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row items-center gap-2">
          Show
          <UiSelect v-model="pagination.pageSize" :options="pageSizeOptions" class="w-16" />
          per page from {{ pagination.total }} data
        </div>

        <LPagination
          :totalItems="pagination.total"
          :pageSize="pagination.pageSize"
          :currentPage="pagination.currentPage"
          @pageChange="setPagePagination"
        />
      </div>
    </div>

    <ModalForm
      :id="selectedId"
      @on-success="onSubmitSuccess"
      @on-error="onSubmitError"
      @on-close="selectedId = 0"
    />
    <ModalSuccess />
    <ModalError />
    <ModalDelete
      :id="selectedId"
      @on-success="onSubmitSuccess"
      @on-error="onSubmitError"
      @on-close="selectedId = 0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { KTModal } from '@/metronic/core'

import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'

import ModalForm from './ModalForm.vue'
import ModalSuccess from './ModalSuccess.vue'
import ModalError from './ModalError.vue'
import ModalDelete from './ModalDelete.vue'
import LPagination from '@/components/pagination/LPagination.vue'

import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiLoading from '@/components/UiLoading.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

const route = useRoute()
const expertPStore = useExpertPersonnelDataStore()

const selectedId = ref(0)
const mode = ref<'add' | 'view' | 'edit'>('view')
const page = ref(1)

const tabCols = [
  '',
  'Name',
  'Highest Education Level',
  'Position / Role',
  'Years of Experience',
  'Expertise / Skills',
]
const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])
const pagination = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const dataResponse = computed(() => {
  const { items, total } = expertPStore.data

  pagination.value.total = total

  return items
})

const downloadFile = (id: number) => {
  selectedId.value = id
  mode.value = 'view'
  const idModal = document.querySelector('#modal-expert-personnel')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const editData = (id: number) => {
  mode.value = 'edit'
  selectedId.value = id
  const idModal = document.querySelector('#modal-expert-personnel')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const deleteData = (id: number) => {
  selectedId.value = id
  const idModal = document.querySelector('#modal-delete')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openModalForm = () => {
  mode.value = 'add'
  selectedId.value = 0
  const idModal = document.querySelector('#modal-expert-personnel')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openModalSuccess = () => {
  const idModal = document.querySelector('#modal-success')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const openModalError = () => {
  const idModal = document.querySelector('#modal-error')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.show()
}

const onSubmitSuccess = () => {
  openModalSuccess()
  getData()
}

const onSubmitError = () => {
  openModalError()
}

const setPagePagination = async (page: number) => {
  pagination.value.currentPage = page
}

const getData = async () => {
  try {
    await expertPStore.getData(
      Number(route.params.id),
      pagination.value.currentPage,
      pagination.value.pageSize,
    )
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getData()
})

watch(
  () => [pagination.value.currentPage, pagination.value.pageSize],
  () => {
    getData()
  },
)

provide('mode', mode)
</script>
