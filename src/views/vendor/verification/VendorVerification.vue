<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from '@/components/vendor/FilterDropdownList.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useVendorStore } from '@/stores/vendor/vendor'
import { useVerificationStatus } from '@/stores/vendor/reference'
import { reactive, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'
import VendorListFilters from '@/components/vendor/filterButton/VendorListFilters.vue'
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import VendorVerificationModal from '@/components/vendor/verificationModal/VendorVerificationModal.vue'
import { formatDate } from '@/composables/date-format'

const route = useRoute()
const router = useRouter()

const vendor = useVendorStore()
const verificationStatusStore = useVerificationStatus()
const search = ref('')
const verifDetail = reactive({
  modal: false,
  id: 0,
  name: '',
})

const handleVerifDetail = (id: number, name: string) => {
  verifDetail.id = id
  verifDetail.name = name
  verifDetail.modal = true
}

// const currentPage = ref(1)
const getStatus = (status: string) => {
  return verificationStatusStore.data.find((item) => item.code === status)?.value
}

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
  () => route.query,
  (query) => {
    search.value = (query.searchAny as string) || ''
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
  <BreadcrumbView
    title="Vendor Verification"
    :routes="[{ name: 'Vendor Verification', to: '/vendor/verification' }]"
  />
  <div class="card">
    <div class="card-header p-6">
      <UiInputSearch v-model="search" placeholder="Search vendor" />
      <div class="flex gap-3">
        <FilterDropdown />
      </div>
    </div>
    <div class="card-body scrollable-x-auto p-6">
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
            <th class="text-nowrap">Business License Status</th>
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
                <UiButton
                  :icon="true"
                  size="sm"
                  @click="
                    $router.push({
                      name: 'vendor-verification-detail',
                      params: { id: vendor.id },
                    })
                  "
                >
                  <UiIcon name="eye" />
                </UiButton>
                <UiButton
                  :icon="true"
                  :outline="true"
                  size="sm"
                  @click="handleVerifDetail(vendor.id, vendor.vendorName)"
                >
                  <UiIcon name="data" variant="duotone" />
                </UiButton>
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
                >{{ getStatus(vendor.isVerified?.toString()) || 'Waiting to Verify' }}</span
              >
            </td>
            <td>{{ vendor.companyCategoryName }}</td>
            <td>{{ formatDate(vendor.createdUTCDate) }}</td>
            <td>{{ formatDate(vendor.verifiedSendUTCDate!) }}</td>
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
    <div
      class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-800 text-sm font-medium"
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
  <VendorVerificationModal
    v-if="verifDetail.modal"
    v-model="verifDetail.modal"
    :id="verifDetail.id"
    :name="verifDetail.name"
  />
</template>
