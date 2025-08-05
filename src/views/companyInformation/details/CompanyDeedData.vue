<template>
  <div class="card min-w-full">
    <div class="card-header">
      <h3 class="card-title">Company Deed Data</h3>
    </div>

    <div class="px-[1.875rem] py-5 flex flex-col gap-5">
      <div class="card min-w-full">
        <div class="card-header">
          <h3 class="card-title">Shareholders</h3>
        </div>

        <div class="card-table scrollable-x-auto">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="w-[70px]"></th>
                <th>
                  <span class="sort">
                    <span class="sort-label">Type</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[228px]">
                  <span class="sort">
                    <span class="sort-label">Shareholder Name</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[268px]">
                  <span class="sort">
                    <span class="sort-label">Date of Birth / Company Establishment Date</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[199px]">
                  <span class="sort">
                    <span class="sort-label">Nominal Value</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[147px]">
                  <span class="sort">
                    <span class="sort-label">Share Unit</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[195px]">
                  <span class="sort">
                    <span class="sort-label">No KTP/Paspor/NPWP</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
                <th class="min-w-[251px]">
                  <span class="sort">
                    <span class="sort-label">File</span>
                    <span class="sort-icon"></span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="x in 4" :key="x">
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
                      </div>
                    </div>
                  </div>
                </td>
                <td>Aktif</td>
                <td>John Doe {{ x }}</td>
                <td>{{ x }} Januari 2025</td>
                <td>{{ x }}0.000.000</td>
                <td>Lembar</td>
                <td>123456789{{ x }}</td>
                <td>itulah</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card min-w-full">
        <div class="card-header">
          <h3 class="card-title">Company Deed Data</h3>
        </div>

        <div class="card-table">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="w-[70px] !rounded-tl-none"></th>
                <th>Number</th>
                <th>Letter Date</th>
                <th>Notary</th>
                <th class="!rounded-tr-none">Notary Office Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="x in 4" :key="x">
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
                      </div>
                    </div>
                  </div>
                </td>
                <td>123456789{{ x }}</td>
                <td>0{{ x }}/06/2019</td>
                <td>John Doe {{ x }}</td>
                <td>Gresik</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card min-w-full">
        <div class="card-header">
          <h3 class="card-title">Latest Amendment Data</h3>
        </div>

        <div class="card-table">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="w-[70px] !rounded-tl-none"></th>
                <th>Number</th>
                <th>Letter Date</th>
                <th class="!rounded-tr-none">Notary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="x in 4" :key="x">
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
                      </div>
                    </div>
                  </div>
                </td>
                <td>123456789{{ x }}</td>
                <td>0{{ x }}/06/2019</td>
                <td>John Doe {{ x }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card min-w-full">
        <div class="card-header">
          <h3 class="card-title">Ratification Data</h3>
        </div>

        <div class="card-table">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="w-[70px] !rounded-tl-none"></th>
                <th>Number</th>
                <th class="!rounded-tr-none">Letter Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="x in 4" :key="x">
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
                      </div>
                    </div>
                  </div>
                </td>
                <td>123456789{{ x }}</td>
                <td>0{{ x }}/06/2019</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'

import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const companyDeedData = useCompanyDeedDataStore()

const downloadFile = () => {
  console.log('a')
}

onMounted(() => {
  companyDeedData.getShareholders(Number(props.vendorId))
  companyDeedData.getVendorLegalDocument(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    companyDeedData.getShareholders(Number(props.vendorId))
    companyDeedData.getVendorLegalDocument(Number(props.vendorId))
  },
)
</script>
