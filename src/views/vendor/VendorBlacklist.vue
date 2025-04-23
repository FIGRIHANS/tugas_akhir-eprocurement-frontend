<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import FilterDropdownBlacklist from '@/components/vendor/FilterDropdownBlacklist.vue'
import { formatDate } from '@/core/utils/format'
import { useBlacklistStore } from '@/stores/vendor/blacklist'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const blacklistStore = useBlacklistStore()

const currentTab = ref('vendor-blacklist')
const search = ref('')
const page = ref(1)

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
    page.value = Number(query.page) || 1
    search.value = (query.searchQuery as string) || ''

    blacklistStore.getBlacklist(route.query)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <BreadcrumbView
    title="Vendor Blacklist"
    :routes="[{ name: 'Vendor blacklist', to: '/vendor-blacklist' }]"
  />
  <UiTab
    :items="[{ label: 'Blacklist Vendor', value: 'vendor-blacklist' }]"
    :model-value="currentTab"
  />
  <div class="card">
    <div class="card-header">
      <UiInputSearch placeholder="Cari Vendor" v-model="search" />
      <FilterDropdownBlacklist />
    </div>
    <div class="card-body">
      <FilterButton />
    </div>
    <div class="card-body scrollable-x-auto">
      <table class="table align-middle">
        <thead>
          <tr class="text-nowrap border-b-2 border-primary">
            <th>Action</th>
            <th>Nama Perusahaan</th>
            <th>Tipe</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Selesai</th>
            <th>Keterangan Blacklist</th>
            <th>Dokumen</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- show loading -->
          <tr v-if="blacklistStore.loading">
            <td colspan="7">
              <div
                class="mx-auto w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </td>
          </tr>

          <!-- show error -->
          <tr v-else-if="blacklistStore.error">
            <td colspan="7">
              {{ blacklistStore.error }}
            </td>
          </tr>

          <!-- show message if there are no data -->
          <tr v-else-if="!blacklistStore.blacklist.items.length">
            <td colspan="7" class="text-center">No data</td>
          </tr>
          <tr
            v-else
            v-for="item in blacklistStore.blacklist.items"
            :key="item.vendorId"
            class="text-nowrap"
          >
            <td>
              <UiButton :outline="true" :icon="true" size="sm">
                <UiIcon name="check-circle" variant="duotone" />
              </UiButton>
            </td>
            <td>{{ item.vendorName }}</td>
            <td>{{ item.masaBlacklist }}</td>
            <td>{{ formatDate(new Date(item.startDate)) }}</td>
            <td>{{ formatDate(new Date(item.endDate)) }}</td>
            <td>{{ item.blacklistDescription }}</td>
            <td>
              <div class="flex items-center gap-2">
                <UiButton :outline="true" :icon="true" size="sm">
                  <UiIcon name="document" variant="duotone" />
                </UiButton>
                <span>{{ item.docUrl }}</span>
              </div>
            </td>
            <td>
              <UiButton :outline="true" variant="danger" size="sm"> {{ item.status }} </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div>
        Tampilkan {{ blacklistStore.blacklist.pageSize }} data dari total data
        {{ blacklistStore.blacklist.total }}
      </div>
      <LPagination
        :current-page="page"
        :page-size="blacklistStore.blacklist.pageSize"
        :total-items="blacklistStore.blacklist.total"
      />
    </div>
  </div>
</template>
