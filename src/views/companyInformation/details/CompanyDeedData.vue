<template>
  <div class="px-[1.875rem] py-5 grid grid-cols-3 gap-5">
    <div class="card min-w-full">
      <div class="card-header">
        <h3 class="card-title">Company Deed Data</h3>
      </div>

      <div class="card-table">
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
                  class="cursor-pointer"
                  :file-data="{ name: companyDeedData?.value, path: companyDeedData?.documentURL }"
                  reverse-icon
                  @click="downloadFile(companyDeedData?.documentURL)"
                />
              </td>
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
                  class="cursor-pointer"
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
    </div>

    <div class="card min-w-full">
      <div class="card-header flex-col items-start gap-1">
        <h3 class="card-title">Ratification by Kemenkumham</h3>
        <span class="text-danger text-xs"
          >Specifically for companies with PT legal entity status</span
        >
      </div>

      <div class="card-table">
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
                  class="cursor-pointer"
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
    </div>

    <div class="card min-w-full col-span-3">
      <div class="card-header">
        <h3 class="card-title">Shareholders</h3>
      </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useCompanyDeedDataStore } from '@/stores/vendor/vendor'
import { useUploadStore } from '@/stores/general/upload'

import { formatDate } from '@/composables/date-format'

import AttachmentView from '@/components/ui/attachment/AttachmentView.vue'

const props = defineProps<{ vendorId: number | undefined }>()

const companyDeedDataStore = useCompanyDeedDataStore()
const uploadStore = useUploadStore()

const companyDeedData = computed(() =>
  companyDeedDataStore.vendorLegalDocData.find(
    (item) => item?.value === 'Akta Pendirian' && item?.isActive,
  ),
)
const latestAmendmentData = computed(() =>
  companyDeedDataStore.vendorLegalDocData.find(
    (item) => item?.value === 'Akta Perubahan Terakhir' && item?.isActive,
  ),
)
const ratificationData = computed(() =>
  companyDeedDataStore.vendorLegalDocData.find(
    (item) => item?.value === 'Pengesahan Kemenkumham' && item?.isActive,
  ),
)
const shareholderData = computed(() => companyDeedDataStore.shareholdersData)

const downloadFile = async (path: string) => {
  await uploadStore.previewFile(path)
}

onMounted(() => {
  companyDeedDataStore.getShareholders(Number(props.vendorId))
  companyDeedDataStore.getVendorLegalDocument(Number(props.vendorId))
})

watch(
  () => props.vendorId,
  () => {
    companyDeedDataStore.getShareholders(Number(props.vendorId))
    companyDeedDataStore.getVendorLegalDocument(Number(props.vendorId))
  },
)
</script>
