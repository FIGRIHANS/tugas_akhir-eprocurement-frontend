<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>
    </div>

    <div class="flex flex-col gap-4 pb-4">
      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="w-[70px]"></th>
              <th>Name</th>
              <th>Highest Education Level</th>
              <th>Position / Role</th>
              <th>Years of Experience</th>
              <th>Expertise / Skills</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dataResponse" :key="data.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div
                        class="menu-item text-primary"
                        @click="openModalDownload(data.id)"
                        data-modal-toggle="#modal-file-expert-personnel-vendor"
                      >
                        <span class="menu-link">
                          <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                          Download
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ data.name }}</td>
              <td>{{ data.education }}</td>
              <td>{{ data.position }}</td>
              <td>{{ data.yearOfExperience }}</td>
              <td>{{ data.expertise }}</td>
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
  </div>

  <Teleport to="body">
    <div
      class="modal"
      data-modal="true"
      data-modal-backdrop-static="true"
      id="modal-file-expert-personnel-vendor"
    >
      <div class="modal-content modal-center-y max-w-4xl max-h-[95%]">
        <div class="modal-header">
          <h3 class="modal-title text-lg">Files</h3>
          <UiIcon name="cross" variant="filled" class="cursor-pointer" data-modal-dismiss="true" />
        </div>

        <div class="modal-body flex flex-col gap-4">
          <div class="card min-w-full">
            <div class="card-header">
              <h3 class="card-title">Years of Experience</h3>
            </div>

            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="data in dataFileYearsofExp" :key="data.id">
                    <td class="w-1/2">{{ data.description || '-' }}</td>
                    <td class="w-1/2">
                      <AttachmentView
                        v-if="data.docUrl"
                        class="cursor-pointer"
                        :file-data="{ name: data.description, path: data.docUrl }"
                        :upload-date="
                          formatDate(data.modifiedDate ? data.modifiedDate : data.createdDate)
                        "
                        @click="downloadFile(data.docUrl)"
                      />
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card min-w-full">
            <div class="card-header">
              <h3 class="card-title">Education</h3>
            </div>

            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="data in dataFileEducation" :key="data.id">
                    <td class="w-1/2">{{ data.description || '-' }}</td>
                    <td class="w-1/2">
                      <AttachmentView
                        v-if="data.docUrl"
                        class="cursor-pointer"
                        :file-data="{ name: data.description, path: data.docUrl }"
                        :upload-date="
                          formatDate(data.modifiedDate ? data.modifiedDate : data.createdDate)
                        "
                        @click="downloadFile(data.docUrl)"
                      />
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card min-w-full">
            <div class="card-header">
              <h3 class="card-title">Certificate Expertise / Skills</h3>
            </div>

            <div class="card-table">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="data in dataFileCertificate" :key="data.id">
                    <td class="w-1/2">{{ data.description || '-' }}</td>
                    <td class="w-1/2">
                      <AttachmentView
                        v-if="data.docUrl"
                        class="cursor-pointer"
                        :file-data="{ name: data.description, path: data.docUrl }"
                        :upload-date="
                          formatDate(data.modifiedDate ? data.modifiedDate : data.createdDate)
                        "
                        @click="downloadFile(data.docUrl)"
                      />
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref, watchEffect } from 'vue'

import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import type { IExpertPersonnelCertificateData } from '@/stores/vendor/types/vendor'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

import { formatDate } from '@/composables/date-format'

const props = defineProps<{ vendorId: number | undefined }>()

const expertPersonnelDataStore = useExpertPersonnelDataStore()
const uploadStore = useUploadStore()

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
  const { items, total } = expertPersonnelDataStore.data

  pagination.value.total = total

  return items
})
const dataFileYearsofExp = ref<IExpertPersonnelCertificateData[]>([])
const dataFileEducation = ref<IExpertPersonnelCertificateData[]>([])
const dataFileCertificate = ref<IExpertPersonnelCertificateData[]>([])

const openModalDownload = async (id: number) => {
  try {
    const response = await expertPersonnelDataStore.getCertificates(id)

    dataFileYearsofExp.value = response.result.content.filter((item) => item.type === 3128)
    dataFileEducation.value = response.result.content.filter((item) => item.type === 3129)
    dataFileCertificate.value = response.result.content.filter((item) => item.type === 3130)
  } catch (error) {
    console.error(error)
  }
}

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

const setPagePagination = async (page: number) => {
  pagination.value.currentPage = page
}

watchEffect(async () => {
  try {
    await expertPersonnelDataStore.getData(
      Number(props.vendorId),
      pagination.value.currentPage,
      pagination.value.pageSize,
    )
  } catch (error) {
    console.error(error)
  }
})
</script>
