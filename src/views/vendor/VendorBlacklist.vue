<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiTab from '@/components/ui/atoms/tab/UiTab.vue'
import FilterButton from '@/components/vendor/filterButton/FilterButton.vue'
import FilterDropdownBlacklist from '@/components/vendor/FilterDropdownBlacklist.vue'
import { ref } from 'vue'
const currentTab = ref('vendor-blacklist')
const search = ref('')
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
      <UiInputSearch placeholder="Cari Vendor" :model-value="search" />
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
          <tr class="text-nowrap">
            <td>
              <UiButton :outline="true" :icon="true" size="sm">
                <UiIcon name="check-circle" variant="duotone" />
              </UiButton>
            </td>
            <td>PT. Agung Sejahtera</td>
            <td>-</td>
            <td>15 Okt 2024</td>
            <td>15 Okt 2024</td>
            <td>Karena tidak kompeten</td>
            <td>
              <div class="flex items-center gap-2">
                <UiButton :outline="true" :icon="true" size="sm">
                  <UiIcon name="document" variant="duotone" />
                </UiButton>
                <span>Dokumen.docx</span>
              </div>
            </td>
            <td>
              <UiButton :outline="true" variant="danger" size="sm"> Blacklist </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer">
      <div>Tampilkan 10 data dari total data 7575</div>
      <LPagination :current-page="1" :page-size="10" :total-items="50" />
    </div>
  </div>
</template>
