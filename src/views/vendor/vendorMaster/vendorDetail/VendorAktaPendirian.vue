<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRouter } from 'vue-router'
import LPagination from '@/components/pagination/LPagination.vue'

const router = useRouter()
</script>
<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Akta Pendirian</div>
        </div>
        <div class="card-body space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Tanggal Surat</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Notaris</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Tempat Notaris</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">File</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Data Perubahan Terakhir</div>
        </div>
        <div class="card-body space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Tanggal Surat</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Notaris</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">File</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3>Pengesahan Kemenkumham</h3>
            <span class="text-sm text-red-600">Khusus perusahaan berbadan hukum PT</span>
          </div>
        </div>
        <div class="card-body space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Tanggal Surat</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Notaris</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">File</span>
            <span class="text-gray-800 text-sm">-</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Pemilik Saham</div>
      </div>
      <div class="card-table scrollable-x-auto">
        <table class="table align-middle table-border">
          <thead>
            <tr>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Tipe </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Nama Pemilik Saham </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Tanggal Lahir / Berdiri Perusahaan </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Nominal </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Satuan Saham </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> No KTP / Paspor / NPWP </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
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
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <div class="text-gray-600 text-sm gap-3 flex items-center">
          <span>Show</span>
          <select class="select w-20">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <span class="">per page</span>
        </div>
        <LPagination :current-page="1" :page-size="10" :total-items="30" />
      </div>
    </div>
    <div class="flex justify-end">
      <UiButton :outline="true" @click="router.go(-1)">
        <UiIcon name="black-left" variant="duotone" />
        <span>Back</span>
      </UiButton>
    </div>
  </div>
</template>
