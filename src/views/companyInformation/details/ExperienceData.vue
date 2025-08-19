<template>
  <div class="flex flex-col gap-6">
    <div class="card">
      <div class="card-header">
        <div class="flex flex-col gap-2">
          <h3 class="card-title">Completed Projects</h3>
          <span class="text-danger text-sm">(Last 5 Years)</span>
        </div>
      </div>

      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="w-[70px]"></th>
              <th>Contract Name</th>
              <th>Contract Address</th>
              <th>Institution</th>
              <th>Contract Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in completedProject" :key="data.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div class="menu-item text-primary" @click="downloadFile(data.documentURL)">
                        <span class="menu-link">
                          <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                          Download
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ data.contractName }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.agency }}</td>
              <td>IDR {{ useFormatIdr(data.contractValue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Ongoing Projects</h3>
      </div>

      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="w-[70px]"></th>
              <th>Contract Name</th>
              <th>Contract Address</th>
              <th>Institution</th>
              <th>Contract Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in onGoingProject" :key="data.id">
              <td>
                <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                  <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                    <UiIcon name="dots-vertical" />
                  </button>

                  <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                    <div class="menu menu-default flex flex-col w-full text-sm">
                      <div class="menu-item text-warning" @click="downloadFile(data.documentURL)">
                        <span class="menu-link">
                          <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                          Download
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>{{ data.contractName }}</td>
              <td>{{ data.address }}</td>
              <td>{{ data.agency }}</td>
              <td>IDR {{ useFormatIdr(data.contractValue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import useExperienceStore from '@/stores/vendor/experience'
import { useUploadStore } from '@/stores/general/upload'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

import { useFormatIdr } from '@/composables/currency'

const props = defineProps<{ vendorId: number | undefined }>()

const experienceStore = useExperienceStore()
const uploadStore = useUploadStore()

const dataResponse = computed(() => experienceStore.data)
const completedProject = computed(() =>
  dataResponse.value.filter((item) => item.value === 'COMPLETED'),
)
const onGoingProject = computed(() =>
  dataResponse.value.filter((item) => item.value === 'ON GOING'),
)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  experienceStore.getData(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    experienceStore.getData(Number(props.vendorId))
  },
)
</script>
