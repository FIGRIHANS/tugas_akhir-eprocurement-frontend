<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import FilterDropdownApproval from '@/components/vendor/FilterDropdownApproval.vue'

import { debounce } from 'lodash'
import ApproveButton from '@/components/vendor/approval/ApproveButton.vue'
import RejectButton from '@/components/vendor/approval/RejectButton.vue'
import ApprovalVerifikasi from '@/components/vendor/approval/ApprovalVerifikasi.vue'
import { useApprovalStore } from '@/stores/vendor/approval'

const route = useRoute()
const router = useRouter()
const approval = useApprovalStore()

const search = ref('')
const currentPage = ref(1)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.push({ query })
}

const handleSearch = debounce((value: string) => {
  const query = { ...route.query, searchQuery: value }
  router.push({ query })
}, 500)

watch(search, (newSearch) => {
  handleSearch(newSearch)
})

watch(
  () => route.query,
  (query) => {
    currentPage.value = Number(query.page) || 1
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
    :routes="[{ name: 'Vendor Approval', to: '/vendor-approval' }]"
    title="Approval Verifikasi Vendor"
  />
  <div class="card">
    <div class="card-header">
      <UiInputSearch v-model="search" placeholder="Cari vendor" />
      <div class="flex gap-3">
        <FilterDropdownApproval />
        <UiButton :outline="true">
          <UiIcon name="printer" variant="duotone" />
          <span>Export Data Vendor</span>
        </UiButton>
      </div>
    </div>
    <div class="card-body scrollable-x-auto">
      <FilterButton />
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap">
            <th>Action</th>
            <th>Nama Perusahaan</th>
            <th>Alamat Vendor</th>
            <th>Kategori Vendor</th>
            <th>Tanggal Aktivasi</th>
            <th>Tanggal Approval Verifikasi Dikirim</th>
            <th>Status</th>
            <th>Jenis Approval</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="approval.loading">
            <td colspan="8">
              <div
                class="mx-auto w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
              ></div>
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
                <ApproveButton :id="item.vendorId" :nama="item.vendorName" />
                <RejectButton :id="item.vendorId" :nama="item.vendorName" />
                <ApprovalVerifikasi :id="item.vendorId" :nama="item.vendorName" />
                <RouterLink :to="`/vendor-master/${item.vendorId}/verification`">
                  <UiButton size="sm" :icon="true" variant="primary" :outline="true">
                    <UiIcon name="eye" variant="duotone" />
                  </UiButton>
                </RouterLink>
              </div>
            </td>
            <td class="text-nowrap">{{ item.vendorName }}</td>
            <td class="text-nowrap">{{ item.addressCompanyInfo }}</td>
            <td class="text-nowrap">{{ item.companyCategoryName }}</td>
            <td class="text-nowrap">{{ item.activedUTCDate }}</td>
            <td class="text-nowrap">{{ item.sendApprovalDate }}</td>
            <td class="text-nowrap">{{ item.approvalStatusName }}</td>
            <td class="text-nowrap">{{ item.approvalTypeName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div>
        Tampilkan {{ approval.data.pageSize }} data dari total data {{ approval.data.total }}
      </div>
      <LPagination
        :current-page="currentPage"
        :page-size="approval.data.pageSize"
        :total-items="approval.data.total"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
