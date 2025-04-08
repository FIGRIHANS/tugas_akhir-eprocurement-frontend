<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from '@/components/vendor/FilterDropdown.vue'
import VendorMenu from '@/components/vendor/VendorMenu.vue'
import StatusToggle from '@/components/vendor/StatusToggle.vue'
import { useRoute } from 'vue-router'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import { ref, watch } from 'vue'
import type { IFilterButton } from '@/components/vendor/filterButton/types/filterButton'

const route = useRoute()
const filters = ref<IFilterButton[]>([])

watch(
  () => route.query,
  (query) => {
    filters.value = Object.entries(query)
      .filter(([key]) => key !== 'page')
      .filter(([key]) => key !== 'search')
      .map(([key, value]) => ({ key, value }))
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header">
        <!-- header -->
        <UiInputSearch model-value="" placeholder="Cari vendor" />
        <FilterDropdown />
        <!-- end of header -->
      </div>
      <div class="card-body scrollable-x-auto">
        <div v-if="filters.length > 0" class="flex gap-3 flex-wrap mb-3 items-center">
          <h3 class="font-semibold text-lg">Filter</h3>
          <FilterButton v-for="filter in filters" :filter="filter" :key="filter.key" />
        </div>
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
              <th class="text-nowrap">Kode E-Procurement Vendor</th>
              <th class="text-nowrap">Kode Vendor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="flex items-center gap-5">
                <VendorMenu :id="1" />
                <StatusToggle :id="1" :status="true" />
              </td>
              <td>-</td>
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
      <div
        class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium"
      >
        <div>Tampilkan 10 data dari total data 7575</div>
        <LPagination :total-items="30" :current-page="1" :page-size="10" />
      </div>
    </div>
  </div>
</template>
