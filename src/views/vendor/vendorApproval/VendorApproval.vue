<script setup lang="ts">
import BreadcrumbView from '@/components/BreadcrumbView.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import { ref } from 'vue'

const search = ref('')
</script>
<template>
  <BreadcrumbView
    :routes="[{ name: 'Vendor Approval', to: '/vendor-approval' }]"
    title="Approval Verifikasi Vendor"
  />
  <div class="card">
    <div class="card-header">
      <UiInputSearch :model-value="search" placeholder="Cari vendor" />
      <div class="flex gap-3">
        <UiButton>
          <UiIcon name="filter" variant="outline" />
          <span>Filter</span>
        </UiButton>
        <UiButton :outline="true">
          <UiIcon name="printer" variant="duotone" />
          <span>Export Data Vendor</span>
        </UiButton>
      </div>
    </div>
    <div class="card-body scrollable-x-auto">
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
  </div>
</template>
