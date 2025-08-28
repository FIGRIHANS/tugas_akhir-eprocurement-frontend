<template>
  <div class="grid grid-cols-3 gap-5">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">Company Deed Data</h3>
      </div>

      <div class="flex flex-col items-center pb-4 gap-4 justify-between h-full">
        <div class="card-table w-full">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="!border-b-0">Letter Date</td>
                <td class="!border-b-0">{{ formatDate(companyDeedData?.documentDate) }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">Notary</td>
                <td class="!border-b-0">{{ companyDeedData?.notaryName || '-' }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">Notary Place</td>
                <td class="!border-b-0">{{ companyDeedData?.cityName }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">File</td>
                <td class="!border-b-0">
                  <AttachmentView
                    class="cursor-pointer flex justify-end"
                    :file-data="{
                      name: companyDeedData?.value,
                      path: companyDeedData?.documentURL,
                    }"
                    reverse-icon
                    @click="downloadFile(companyDeedData?.documentURL)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <LPagination
          class="px-4"
          number-only
          :totalItems="paginationCompanyDeedDataStore.total"
          :pageSize="paginationCompanyDeedDataStore.pageSize"
          :currentPage="paginationCompanyDeedDataStore.currentPage"
          @pageChange="setPageCompanyDeedData"
        />
      </div>
    </div>

    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">Latest Amendment Data</h3>
      </div>

      <div class="flex flex-col items-center gap-4 pb-4 justify-between h-full">
        <div class="card-table w-full">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="!border-b-0">Letter Date</td>
                <td class="!border-b-0">{{ formatDate(latestAmendmentData?.documentDate) }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">Notary</td>
                <td class="!border-b-0">{{ latestAmendmentData?.notaryName || '-' }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">File</td>
                <td class="!border-b-0">
                  <AttachmentView
                    class="cursor-pointer flex justify-end"
                    :file-data="{
                      name: latestAmendmentData?.value,
                      path: latestAmendmentData?.documentURL,
                    }"
                    reverse-icon
                    @click="downloadFile(latestAmendmentData?.documentURL)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <LPagination
          class="px-4"
          number-only
          :totalItems="paginationLatestAmendmentData.total"
          :pageSize="paginationLatestAmendmentData.pageSize"
          :currentPage="paginationLatestAmendmentData.currentPage"
          @pageChange="setPageLatestAmendmentData"
        />
      </div>
    </div>

    <div class="card min-w-full">
      <div class="card-header flex-col items-start gap-1">
        <h3 class="card-title">Ratification by Kemenkumham</h3>
        <span class="text-danger text-xs"
          >Specifically for companies with PT legal entity status</span
        >
      </div>

      <div class="flex flex-col items-center gap-4 pb-4 justify-between h-full">
        <div class="card-table w-full">
          <table class="table align-middle">
            <tbody>
              <tr>
                <td class="!border-b-0">Letter Date</td>
                <td class="!border-b-0">{{ formatDate(ratificationData?.documentDate) }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">Notary</td>
                <td class="!border-b-0">{{ ratificationData?.notaryName || '-' }}</td>
              </tr>
              <tr>
                <td class="!border-b-0">File</td>
                <td class="!border-b-0">
                  <AttachmentView
                    class="cursor-pointer flex justify-end"
                    :file-data="{
                      name: ratificationData?.value,
                      path: ratificationData?.documentURL,
                    }"
                    reverse-icon
                    @click="downloadFile(ratificationData?.documentURL)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <LPagination
          class="px-4"
          number-only
          :totalItems="paginationRatificationData.total"
          :pageSize="paginationRatificationData.pageSize"
          :currentPage="paginationRatificationData.currentPage"
          @pageChange="setPageRatificationData"
        />
      </div>
    </div>

    <div class="card min-w-full col-span-3">
      <div class="card-header">
        <h3 class="card-title">Shareholders</h3>
      </div>

      <div class="flex flex-col gap-4 pb-4">
        <div class="card-table scrollable-x-auto">
          <table class="table align-middle">
            <thead>
              <tr>
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
              <tr v-for="data in shareholderData" :key="data.stockID">
                <td>{{ data.isActive ? 'AKTIF' : 'TIDAK AKTIF' }}</td>
                <td>{{ data.ownerName }}</td>
                <td>{{ formatDate(data.ownerDOB) }}</td>
                <td>{{ data.quantity }}</td>
                <td>{{ data.shareUnit }}</td>
                <td>{{ data.ownerID }}</td>
                <td>
                  <AttachmentView
                    v-if="data.ownerIDUrl"
                    class="cursor-pointer"
                    :file-data="{ name: data.ownerID, path: data.ownerIDUrl }"
                    @click="downloadFile(data?.ownerIDUrl)"
                  />
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-row items-center justify-between px-4">
          <div class="flex flex-row items-center gap-2">
            Show
            <UiSelect
              v-model="paginationShareholders.pageSize"
              :options="pageSizeOptions"
              class="w-16"
            />
            per page from {{ paginationShareholders.total }} data
          </div>

          <LPagination
            :totalItems="paginationShareholders.total"
            :pageSize="paginationShareholders.pageSize"
            :currentPage="paginationShareholders.currentPage"
            @pageChange="setPageShareholders"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import { formatDate } from '@/composables/date-format'

import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const pageSizeOptions = ref([
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
  { value: 20, text: '20' },
  { value: 50, text: '50' },
])
const paginationCompanyDeedDataStore = ref({
  pageSize: 1,
  currentPage: 1,
  total: 10,
})
const paginationLatestAmendmentData = ref({
  pageSize: 1,
  currentPage: 1,
  total: 10,
})
const paginationRatificationData = ref({
  pageSize: 1,
  currentPage: 1,
  total: 10,
})
const paginationShareholders = ref({
  pageSize: 10,
  currentPage: 1,
  total: 10,
})

const companyDeedDataStore = useCompanyDeedDataStore()
const uploadStore = useUploadStore()

const companyDeedData = computed(() => {
  const { items, total } = companyDeedDataStore.companyDeedData

  paginationCompanyDeedDataStore.value.total = total

  return items[0]
})
const latestAmendmentData = computed(() => {
  const { items, total } = companyDeedDataStore.latestAmendmentData

  paginationLatestAmendmentData.value.total = total

  return items[0]
})
const ratificationData = computed(() => {
  const { items, total } = companyDeedDataStore.ratificationData

  paginationRatificationData.value.total = total

  return items[0]
})
const shareholderData = computed(() => {
  const { items, total } = companyDeedDataStore.shareholdersData

  paginationShareholders.value.total = total

  return items
})

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

const setPageCompanyDeedData = async (page: number) => {
  paginationCompanyDeedDataStore.value.currentPage = page
}

const setPageLatestAmendmentData = async (page: number) => {
  paginationLatestAmendmentData.value.currentPage = page
}

const setPageRatificationData = async (page: number) => {
  paginationRatificationData.value.currentPage = page
}

const setPageShareholders = async (page: number) => {
  paginationShareholders.value.currentPage = page
}

watchEffect(async () => {
  try {
    await companyDeedDataStore.getVendorLegalDocument(
      Number(props.vendorId),
      paginationCompanyDeedDataStore.value.currentPage,
      paginationCompanyDeedDataStore.value.pageSize,
      3115,
    )
  } catch (error) {
    console.error(error)
  }
})

watchEffect(async () => {
  try {
    await companyDeedDataStore.getVendorLegalDocument(
      Number(props.vendorId),
      paginationLatestAmendmentData.value.currentPage,
      paginationLatestAmendmentData.value.pageSize,
      3116,
    )
  } catch (error) {
    console.error(error)
  }
})

watchEffect(async () => {
  try {
    await companyDeedDataStore.getVendorLegalDocument(
      Number(props.vendorId),
      paginationRatificationData.value.currentPage,
      paginationRatificationData.value.pageSize,
      3117,
    )
  } catch (error) {
    console.error(error)
  }
})

watchEffect(async () => {
  try {
    await companyDeedDataStore.getShareholders(
      Number(props.vendorId),
      paginationShareholders.value.currentPage,
      paginationShareholders.value.pageSize,
    )
  } catch (error) {
    console.error(error)
  }
})
</script>
