<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Experience Data</h3>
    </div>

    <div class="flex flex-col gap-6 p-8">
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
              <tr>
                <td>
                  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                    <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                      <UiIcon name="dots-vertical" />
                    </button>

                    <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                      <div class="menu menu-default flex flex-col w-full text-sm">
                        <div class="menu-item text-warning" @click="downloadFile('completed')">
                          <span class="menu-link">
                            <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                            Download
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>Jasa Editing WEB</td>
                <td>Jl. Jendral Soedirman</td>
                <td>IT Company</td>
                <td>IDR 70.00</td>
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
              <tr>
                <td>
                  <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                    <button class="dropdown-toggle px-0 size-8 flex justify-center btn btn-light">
                      <UiIcon name="dots-vertical" />
                    </button>

                    <div class="dropdown-content w-full max-w-56" data-dropdown-dismiss="true">
                      <div class="menu menu-default flex flex-col w-full text-sm">
                        <div class="menu-item text-warning" @click="downloadFile('completed')">
                          <span class="menu-link">
                            <UiIcon name="file-down" variant="duotone" class="menu-icon" />
                            Download
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>Jasa Editing WEB</td>
                <td>Jl. Jendral Soedirman</td>
                <td>IT Company</td>
                <td>IDR 70.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ExperienceCategoryType = 'completed' | 'ongoing'

import { computed, onMounted, ref, watch } from 'vue'

import useExperienceStore from '@/stores/vendor/experience'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const experienceCategory = ref<ExperienceCategoryType>('completed')

const experienceStore = useExperienceStore()

const dataResponse = computed(() => experienceStore.data)

const downloadFile = (type: ExperienceCategoryType) => {
  console.log('saham editData')
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
