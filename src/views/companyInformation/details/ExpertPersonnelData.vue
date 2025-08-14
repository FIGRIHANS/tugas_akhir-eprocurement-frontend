<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Expert Personnel Data</h3>
    </div>

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
          <tr v-for="data in dataResponse" :key="data.vendorId">
            <td>
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                  <UiIcon name="dots-vertical" />
                </button>

                <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                  <div class="menu menu-default flex flex-col w-full text-sm">
                    <div class="menu-item text-primary" @click="downloadFile('')">
                      <span class="menu-link">
                        <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                        Download
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>Luffy</td>
            <td>S1</td>
            <td>Manager</td>
            <td>1</td>
            <td>Time Management</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { useExpertPersonnelDataStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const expertPersonnelDataStore = useExpertPersonnelDataStore()
const uploadStore = useUploadStore()

const dataResponse = computed(() => expertPersonnelDataStore.data)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  expertPersonnelDataStore.getData(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    expertPersonnelDataStore.getData(Number(props.vendorId))
  },
)
</script>
