<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from '@/components/vendor/FilterDropdownList.vue'
import VendorMenu from '@/components/vendor/VendorMenu.vue'
import StatusToggle from '@/components/vendor/StatusToggle.vue'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const vendor = useVendorStore()

const search = ref('')
const currentPage = ref(vendor.vendorList?.page)

const handleSearch = debounce((value) => {
  const query = { ...route.query }
  if (!value) {
    delete query.SearchQuery
    router.replace({ query: { ...query, page: 1 } })
    return
  }

  router.replace({ query: { ...query, SearchQuery: value, page: 1 } })
}, 500)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.replace({ query })
}

watch(search, handleSearch)

watch(
  () => route.query,
  (query) => {
    search.value = (query.SearchQuery as string) || ''
    currentPage.value = Number(query.page) || 1

    vendor.getVendors(query)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header">
        <UiInputSearch v-model="search" placeholder="Cari vendor" />
        <div class="flex gap-3">
          <FilterDropdown />
          <UiButton :outline="true">
            <UiIcon variant="filled" name="printer" />
            Export Data Vendor
          </UiButton>
        </div>
      </div>
      <div class="card-body scrollable-x-auto">
        <FilterButton />
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-primary">
            <tr>
              <th></th>
              <th class="text-nowrap">Nama Perusahaan</th>
              <th class="text-nowrap">Status</th>
              <th class="text-nowrap">Kategori Vendor</th>
              <th class="text-nowrap">Tanggal Pendaftaran</th>
              <th class="text-nowrap">Tanggal Permintaan Verifikasi</th>
              <th class="text-nowrap">Tanggal Verifikasi</th>
              <th class="text-nowrap">Kode Vendor</th>
            </tr>
          </thead>
          <tbody>
            <!-- show loading -->
            <tr v-if="vendor.loading">
              <td colspan="8">
                <div
                  class="mx-auto w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
                ></div>
              </td>
            </tr>

            <!-- show error -->
            <tr v-else-if="vendor.error">
              <td colspan="8">
                {{ vendor.error }}
              </td>
            </tr>

            <!-- show message if there are no data -->
            <tr v-else-if="!vendor.vendorList?.items.length">
              <td colspan="8" class="text-center">No data</td>
            </tr>

            <!-- show data -->
            <tr
              v-else
              v-for="vendor in vendor.vendorList.items"
              :key="vendor.vendorId"
              class="font-normal text-sm"
            >
              <td class="flex items-center gap-5">
                <VendorMenu :id="vendor.vendorId" />
                <StatusToggle :id="vendor.vendorId" :status="true" />
              </td>
              <td class="text-nowrap">{{ vendor.vendorName }}</td>
              <td>{{ vendor.approvalStatusName }}</td>
              <td>{{ vendor.companyCategoryName }}</td>
              <td>{{ vendor.activedUTCDate }}</td>
              <td>{{ vendor.sendApprovalDate }}</td>
              <td>{{ vendor.sendApprovalDate }}</td>
              <td>{{ vendor.vendorId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium"
      >
        <div>
          Tampilkan {{ vendor.vendorList?.pageSize }} data dari total data
          {{ vendor.vendorList?.total }}
        </div>
        <LPagination
          :total-items="Number(vendor.vendorList?.total)"
          :current-page="Number(currentPage)"
          :page-size="Number(vendor.vendorList?.pageSize)"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
