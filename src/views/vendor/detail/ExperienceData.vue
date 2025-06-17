<script setup lang="ts">
import LPagination from '@/components/pagination/LPagination.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="space-y-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title">Projects</div>
      </div>
      <div class="card-table scrollable-x-auto">
        <table class="table align-middle table-border">
          <thead>
            <tr>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label">Nama Kontak </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Instansi </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label">Nilai Kontrak </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Tipe Bidang Tender </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Bidang Usaha </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Tanggal Mulai </span>
                  <span class="sort-icon"> </span>
                </span>
              </th>
              <th class="text-nowrap">
                <span class="sort">
                  <span class="sort-label"> Tanggal Berakhir </span>
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
