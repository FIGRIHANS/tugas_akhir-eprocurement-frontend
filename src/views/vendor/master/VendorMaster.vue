<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from '@/components/vendor/FilterDropdownList.vue'
import VendorMenu from '@/components/vendor/VendorMenu.vue'
import StatusToggle from '@/components/vendor/StatusToggle.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import { useVerificationStatus } from '@/stores/vendor/reference'
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import VendorListFilters from '@/components/vendor/filterButton/VendorListFilters.vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import { formatDate } from '@/composables/date-format'
import { useLoginStore } from '@/stores/views/login'
import { tableColsId, tableColsEn } from './static'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()

const vendor = useVendorStore()
const verificationStatusStore = useVerificationStatus()
const userStore = useLoginStore()

const search = ref('')
// const currentPage = ref(1)
const getStatus = (status: string) => {
  return verificationStatusStore.data.find((item) => item.code === status)?.value
}

const userData = computed(() => userStore.userData)
const isAdmin = computed(() => userData.value?.profile.profileId === 3192)
const tableCols = computed(() => {
  return i18n.locale.value === 'id' ? tableColsId : tableColsEn
})
const start = computed(() => vendor.vendors.pageSize * (vendor.vendors.page - 1) + 1)
const end = computed(
  () => vendor.vendors.pageSize * (vendor.vendors.page - 1) + vendor.vendors.items.length,
)
const total = computed(() => vendor.vendors.total)

const handleSearch = debounce((value) => {
  const query = { ...route.query }
  if (!value) {
    delete query.searchAny
    router.replace({ query: { ...query, page: 1 } })
    return
  }

  router.replace({ query: { ...query, searchAny: value, page: 1 } })
}, 500)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.replace({ query })
}

watch(search, handleSearch)

watch(
  () => [route.query, userData.value],
  () => {
    search.value = (route.query.searchAny as string) || ''
    vendor.getVendors(route.query)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <BreadcrumbView
    title="Vendor Master"
    :routes="[{ name: 'Vendor Master', to: '/vendor/master' }]"
  />
  <div class="card rounded-lg">
    <div class="card-header p-6">
      <UiInputSearch v-model="search" :placeholder="$t('general.search', { field: 'Vendor' })" />
      <div class="flex gap-3">
        <FilterDropdown />
      </div>
    </div>
    <div class="card-body scrollable-x-auto p-6">
      <!-- <FilterButton /> -->
      <VendorListFilters />
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="table align-middle text-gray-700">
          <thead class="border-b-2 border-b-teal-500 text-nowrap">
            <tr>
              <th
                v-for="(col, index) in tableCols"
                :key="index"
                class="!bg-teal-100 !text-teal-500"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- show loading -->
            <tr v-if="vendor.loading">
              <td :colspan="tableCols.length" class="text-center">
                <UiLoading size="md" />
              </td>
            </tr>

            <!-- show error -->
            <tr v-else-if="vendor.error">
              <td :colspan="tableCols.length">
                {{ vendor.error }}
              </td>
            </tr>

            <!-- show message if there are no data -->
            <tr v-else-if="!vendor.vendors.items.length">
              <td :colspan="tableCols.length" class="text-center">No data</td>
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
                  <VendorMenu
                    :id="vendor.vendorId"
                    :name="vendor.vendorName"
                    :email="vendor.vendorEmail"
                    :status="vendor.isVerified"
                  />
                  <StatusToggle
                    v-if="isAdmin"
                    :id="vendor.vendorId"
                    :name="vendor.vendorName"
                    :status="vendor.isActive"
                  />
                </div>
              </td>
              <td class="text-nowrap">{{ vendor.vendorName }}</td>
              <td>
                <span
                  class="badge badge-outline text-nowrap"
                  :class="{
                    'badge-success': vendor.isVerified === 1,
                    'badge-danger': vendor.isVerified === 2,
                  }"
                >
                  {{ getStatus(vendor.isVerified?.toString()) || 'Waiting to Verify' }}
                </span>
              </td>
              <td>{{ vendor.companyCategoryName }}</td>
              <td>
                <div
                  v-for="(item, index) in vendor.businessFields"
                  :key="item.vendorId"
                  class="text-nowrap"
                >
                  {{ index + 1 }}. {{ item.businessFieldName }}
                </div>
              </td>
              <td>{{ formatDate(vendor.createdUTCDate) }}</td>
              <td>{{ formatDate(vendor.verifiedSendUTCDate || '') }}</td>
              <td>{{ formatDate(vendor.verifiedUTCDate || '') }}</td>
              <td>
                <div
                  v-for="(license, index) in vendor.licenses"
                  :key="license.licenseName"
                  class="text-nowrap"
                >
                  {{ index + 1 }}. {{ license.licenseName }} :
                  {{ formatDate(license.expiredUTCDate!) }}
                </div>
              </td>
              <td>{{ vendor.vendorCode }}</td>
              <td>{{ vendor.vendorId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-800 text-sm font-medium"
      v-show="vendor.vendors.items.length"
    >
      <div>
        {{ $t('vendor.pagination.show', { start, end, total }) }}
      </div>
      <LPagination
        :total-items="Number(vendor.vendors.total)"
        :current-page="Number(vendor.vendors.page)"
        :page-size="Number(vendor.vendors.pageSize)"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
