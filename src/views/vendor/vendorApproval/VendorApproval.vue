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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import { debounce } from 'lodash'

const route = useRoute()
const router = useRouter()

const search = ref('')
const currentPage = ref(1)

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.push({ query })
}

const handleSearch = debounce((value: string) => {
  const query = { ...route.query, search: value }
  router.push({ query })
}, 500)

watch(search, (newSearch) => {
  handleSearch(newSearch)
})

watch(
  () => route.query,
  (query) => {
    currentPage.value = Number(query.page) || 1
    search.value = (query.search as string) || ''
  },
  {
    immediate: true,
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
          <tr>
            <td>
              <div class="flex gap-5">
                <UiButton size="sm" :icon="true">
                  <UiIcon name="check-circle" variant="duotone" />
                </UiButton>
                <UiButton size="sm" :icon="true" variant="danger" :outline="true">
                  <UiIcon name="cross-circle" variant="duotone" />
                </UiButton>
                <UiButton size="sm" :icon="true" variant="primary" :outline="true">
                  <UiIcon name="data" variant="duotone" />
                </UiButton>
                <UiButton size="sm" :icon="true" variant="primary" :outline="true">
                  <UiIcon name="eye" variant="duotone" />
                </UiButton>
              </div>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div>Tampilkan 10 data dari total data 10</div>
      <LPagination
        :current-page="currentPage"
        :page-size="10"
        :total-items="100"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
