<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from '@/components/vendor/FilterDropdownList.vue'
import VendorMenu from '@/components/vendor/VendorMenu.vue'
import StatusToggle from '@/components/vendor/StatusToggle.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/core/utils/format'
import UiLoading from '@/components/UiLoading.vue'
import VendorListFilters from '@/components/vendor/filterButton/VendorListFilters.vue'

const route = useRoute()
const router = useRouter()

const vendor = useVendorStore()

const search = ref('')
// const currentPage = ref(1)

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
    // currentPage.value = Number(query.page) || 1

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
        <!-- <FilterButton /> -->
        <VendorListFilters />
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-primary">
            <tr>
              <th></th>
              <th class="text-nowrap">Company Name</th>
              <th class="text-nowrap">Status</th>
              <th class="text-nowrap">Vendor Category</th>
              <th class="text-nowrap">Registration Date</th>
              <th class="text-nowrap">Verification Request Date</th>
              <th class="text-nowrap">Verification Date</th>
              <th class="text-nowrap">Bussiness License Status</th>
              <th class="text-nowrap">E-Procurement Vendor Code</th>
              <th class="text-nowrap">Vendor Code</th>
            </tr>
          </thead>
          <tbody>
            <!-- show loading -->
            <tr v-if="vendor.loading">
              <td colspan="8" class="text-center">
                <UiLoading size="md" />
              </td>
            </tr>

            <!-- show error -->
            <tr v-else-if="vendor.error">
              <td colspan="8">
                {{ vendor.error }}
              </td>
            </tr>

            <!-- show message if there are no data -->
            <tr v-else-if="!vendor.vendors.items.length">
              <td colspan="8" class="text-center">No data</td>
            </tr>

            <!-- show data -->
            <tr
              v-else
              v-for="vendor in vendor.vendors.items"
              :key="vendor.vendorId"
              class="font-normal text-sm"
            >
              <td>
                <div class="flex items-center gap-3">
                  <VendorMenu :id="vendor.vendorId" :name="vendor.vendorName" />
                  <StatusToggle :id="vendor.vendorId" :status="vendor.isActive" />
                </div>
              </td>
              <td class="text-nowrap">{{ vendor.vendorName }}</td>
              <td>
                <UiButton
                  v-if="Boolean(vendor.isVerified)"
                  :outline="true"
                  size="sm"
                  variant="success"
                >
                  Verified
                </UiButton>
                <UiButton v-else :outline="true" size="sm" variant="secondary">
                  <span class="text-nowrap">Not Verified</span>
                </UiButton>
              </td>
              <td>{{ vendor.companyCategoryName }}</td>
              <td>
                {{
                  vendor.createdUTCDate ? formatDate(new Date(vendor.createdUTCDate), 'en-US') : '-'
                }}
              </td>
              <td>
                {{
                  vendor.verifiedSendUTCDate
                    ? formatDate(new Date(vendor.verifiedSendUTCDate as string), 'en-US')
                    : '-'
                }}
              </td>
              <td>
                {{
                  vendor.verifiedUTCDate
                    ? formatDate(new Date(vendor.verifiedUTCDate), 'en-US')
                    : '-'
                }}
              </td>
              <td>
                <div
                  v-for="(license, index) in vendor.licenses"
                  :key="license.licenseName"
                  class="text-nowrap"
                >
                  {{ index + 1 }}. {{ license.licenseName }} :
                  {{
                    license.expiredUTCDate
                      ? formatDate(new Date(license.expiredUTCDate), 'en-US')
                      : '-'
                  }}
                </div>
              </td>
              <td>-</td>
              <td>{{ vendor.vendorId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium"
      >
        <div>Showing {{ vendor.vendors.pageSize }} of {{ vendor.vendors.total }} entries</div>
        <LPagination
          :total-items="Number(vendor.vendors.total)"
          :current-page="Number(vendor.vendors.page)"
          :page-size="Number(vendor.vendors.pageSize)"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
