<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FilterDropdownApproval from '@/components/vendor/FilterDropdownApproval.vue'

import { debounce } from 'lodash'
import ApproveButton from '@/components/vendor/approval/ApproveButton.vue'
import RejectButton from '@/components/vendor/approval/RejectButton.vue'
import ApprovalVerifikasi from '@/components/vendor/approval/ApprovalVerifikasi.vue'
import { useApprovalStore } from '@/stores/vendor/approval'
import UiLoading from '@/components/UiLoading.vue'
import moment from 'moment'
import VendorApprovalFilters from '@/components/vendor/filterButton/VendorApprovalFilters.vue'
import SAPButton from '@/components/vendor/approval/SAPButton.vue'

const route = useRoute()
const router = useRouter()

const approval = useApprovalStore()

const search = ref<string>('')

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.push({ query })
}

const handleSearch = debounce((value: string) => {
  const query = { ...route.query }
  delete query.page

  if (!value) {
    delete query.searchQuery
    router.push({ query })
    return
  }
  router.push({ query: { ...query, searchQuery: value } })
}, 500)

watch(search, (newSearch) => {
  handleSearch(newSearch)
})

watch(
  () => route.query,
  (query) => {
    search.value = (query.searchQuery as string) || ''

    approval.getApproval(route.query)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
<template>
  <BreadcrumbView
    :routes="[{ name: 'Vendor Approval', to: '/vendor/approval' }]"
    title="Vendor Approval"
  />
  <div class="card">
    <div class="card-header p-6">
      <UiInputSearch v-model="search" placeholder="Search vendor" />
      <div class="flex gap-3">
        <FilterDropdownApproval />
      </div>
    </div>
    <div class="card-body scrollable-x-auto p-6">
      <VendorApprovalFilters />
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap">
            <th>Action</th>
            <th>Company Name</th>
            <th>Status</th>
            <th>Vendor Address</th>
            <th>Vendor Category</th>
            <th>Activation Date</th>
            <th>Approval Date Sent</th>
            <th>Approval Type</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="approval.loading">
            <td colspan="8" class="text-center">
              <UiLoading size="md" />
            </td>
          </tr>

          <!-- show error -->
          <tr v-else-if="approval.error">
            <td colspan="8">
              {{ approval.error }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!approval.data.items.length">
            <td colspan="8" class="text-center">No data</td>
          </tr>

          <tr
            v-else
            v-for="item in approval.data.items"
            :key="item.vendorId"
            class="font-normal text-sm"
          >
            <td>
              <div class="flex gap-5">
                <div v-if="Number(item.approvalStatus) === 2" class="text-gray-600">
                  No Action Available
                </div>
                <template v-else>
                  <div v-if="Number(item.approvalStatus) === 1">
                    <SAPButton />
                  </div>
                  <template v-if="!Number(item.approvalStatus)">
                    <ApproveButton :id="item.vendorId" :nama="item.vendorName" />
                    <RejectButton :id="item.vendorId" :nama="item.vendorName" />
                  </template>
                  <ApprovalVerifikasi :id="item.vendorId" :nama="item.vendorName" />
                  <RouterLink :to="`/vendor/approval/${item.vendorId}`">
                    <UiButton size="sm" :icon="true" variant="primary" :outline="true">
                      <UiIcon name="eye" variant="duotone" />
                    </UiButton>
                  </RouterLink>
                </template>
              </div>
            </td>
            <td class="text-nowrap">{{ item.vendorName }}</td>
            <td class="text-nowrap">
              <span
                class="badge badge-outline"
                :class="{
                  'badge-success': Number(item.approvalStatus) === 1,
                  'badge-danger': Number(item.approvalStatus) === 2,
                  'badge-primary': Number(item.approvalStatus) === 3,
                }"
              >
                {{ item.approvalStatusName }}
              </span>
            </td>
            <td>
              <div class="w-[500px]">{{ item.addressCompanyInfo }}</div>
            </td>
            <td class="text-nowrap">{{ item.companyCategoryName }}</td>
            <td class="text-nowrap">
              {{ item.activedUTCDate ? moment(item.activedUTCDate).format('LL') : '-' }}
            </td>
            <td class="text-nowrap">
              {{ item.sendApprovalDate ? moment(item.sendApprovalDate).format('LL') : '-' }}
            </td>
            <td class="text-nowrap">{{ item.approvalTypeName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div class="text-sm text-gray-800">
        Showing {{ approval.data.pageSize }} of {{ approval.data.total }} entries
      </div>
      <LPagination
        :current-page="approval.data.page"
        :page-size="approval.data.pageSize"
        :total-items="approval.data.total"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
