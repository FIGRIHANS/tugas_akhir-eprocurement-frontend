<script setup lang="ts">
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import FilterButton from './components/FilterButton.vue'
import VendorMenu from './components/VendorMenu.vue'
import StatusToggle from './components/StatusToggle.vue'
</script>

<template>
  <div class="card card-grid">
    <div class="card-header">
      <!-- header -->
      <UiInputSearch model-value="" placeholder="Cari vendor" />
      <FilterButton />
      <!-- end of header -->
    </div>
    <div class="card-table scrollable-x-auto">
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
