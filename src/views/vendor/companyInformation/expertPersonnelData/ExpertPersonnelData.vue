<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>

      <UiButton variant="primary" @click="openModalForm">
        <UiIcon name="plus-circle" variant="duotone" />
        Add
      </UiButton>
    </div>

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
          <tr v-else-if="!expertPStore.data.items.length">
            <th class="text-center" :colspan="tabCols.length">No data</th>
          </tr>

          <tr v-else v-for="(item, index) in expertPStore.data.items" :key="'expert' + index">
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

    <div
      class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-800 text-sm font-medium"
      v-show="expertPStore.data.items.length"
    >
      <div>
        Showing {{ expertPStore.data.pageSize * (expertPStore.data.page - 1) + 1 }} to
        {{
          expertPStore.data.pageSize * (expertPStore.data.page - 1) + expertPStore.data.items.length
        }}
        of {{ expertPStore.data.total }} entries
      </div>
      <LPagination
        :total-items="Number(expertPStore.data.total)"
        :current-page="Number(expertPStore.data.page)"
        :page-size="Number(expertPStore.data.pageSize)"
        @page-change="handlePageChange"
      />
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
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalForm from './ModalForm.vue'
import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import { KTModal } from '@/metronic/core'
import ModalSuccess from './ModalSuccess.vue'
import ModalError from './ModalError.vue'
import ModalDelete from './ModalDelete.vue'
import LPagination from '@/components/pagination/LPagination.vue'

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
}

const onSubmitError = () => {
  openModalError()
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  expertPStore.getData(Number(route.params.id), newPage)
}

onMounted(() => {
  expertPStore.getData(Number(route.params.id))
})

provide('mode', mode)
</script>
