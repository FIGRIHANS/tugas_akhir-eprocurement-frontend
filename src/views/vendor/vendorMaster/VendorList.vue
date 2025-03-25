<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterDropdown from './components/FilterDropdown.vue'
import VendorMenu from './components/VendorMenu.vue'
import StatusToggle from './components/StatusToggle.vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import FilterButton from './components/FilterButton.vue'
import { ref, watch } from 'vue'

const route = useRoute()
const filters = ref<{ key: string; value: LocationQueryValue | LocationQueryValue[] }[]>([])

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
            <th class="min-w-fit">Nama Perusahaan</th>
            <th class="min-w-fit">Status</th>
            <th class="min-w-fit">Kategori Vendor</th>
            <th class="min-w-fit">Tanggal Pendaftaran</th>
            <th class="min-w-fit">Tanggal Permintaan Verifikasi</th>
            <th class="min-w-fit">Tanggal Verifikasi</th>
            <th class="min-w-fit">Kode E-Procurement Vendor</th>
            <th class="min-w-fit">Kode Vendor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="flex items-center gap-5">
              <VendorMenu :id="1" />
              <StatusToggle :id="1" />
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
</template>
