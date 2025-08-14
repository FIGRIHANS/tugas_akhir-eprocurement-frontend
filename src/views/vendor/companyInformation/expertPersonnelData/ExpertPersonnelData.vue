<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>

      <UiButton variant="primary" data-modal-toggle="#modal-expert-personnel">
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
          <tr v-else-if="!expertPStore.data.length">
            <th class="text-center" :colspan="tabCols.length">No data</th>
          </tr>

          <tr v-else v-for="(item, index) in expertPStore.data" :key="'expert' + index">
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                  <UiIcon name="dots-vertical" />
                </button>

                <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                  <div class="menu menu-default flex flex-col w-full text-sm">
                    <div class="menu-item text-primary" @click="downloadFile">
                      <span class="menu-link">
                        <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                        Download
                      </span>
                    </div>
                    <div class="menu-item text-warning" @click="editData">
                      <span class="menu-link">
                        <UiIcon name="notepad-edit" variant="duotone" class="menu-icon" />
                        Edit
                      </span>
                    </div>
                    <div class="menu-item text-danger" @click="deleteData">
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

    <ModalForm @on-success="onSubmitSuccess" @on-error="onSubmitError" />
    <ModalSuccess />
    <ModalError />
    <ModalDelete />
  </div>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import ModalForm from './ModalForm.vue'
import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import { KTModal } from '@/metronic/core'
import ModalSuccess from './ModalSuccess.vue'
import ModalError from './ModalError.vue'
import ModalDelete from './ModalDelete.vue'

const route = useRoute()
const expertPStore = useExpertPersonnelDataStore()

const tabCols = [
  '',
  'Name',
  'Highest Education Level',
  'Position / Role',
  'Years of Experience',
  'Expertise / Skills',
]

const downloadFile = () => {
  console.log('downloadFile')
}

const editData = () => {
  console.log('editData')
}

const deleteData = () => {
  console.log('deleteData')
}

const closeModalForm = () => {
  const idModal = document.querySelector('#modal-expert-personnel')
  const modal = KTModal.getInstance(idModal as HTMLElement)
  modal.hide()
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
  closeModalForm()
  openModalSuccess()
}

const onSubmitError = () => {
  closeModalForm()
  openModalError()
}

onMounted(() => {
  expertPStore.getData(Number(route.params.id))
})
</script>
