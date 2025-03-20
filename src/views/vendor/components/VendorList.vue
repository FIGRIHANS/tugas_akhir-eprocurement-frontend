<script setup lang="ts">
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiInputSearch from '@/components/ui/atoms/inputSearch/UiInputSearch.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import { reactive } from 'vue'
import LPagination from '@/components/pagination/LPagination.vue'

const filters = reactive({
  izinUsahaExp: '',
})

const handleFilter = () => {
  console.log('filtering filtering filtering')
}

const handleReset = () => {
  filters.izinUsahaExp = ''
}
</script>

<template>
  <div class="card card-grid">
    <div class="card-header">
      <!-- header -->
      <UiInputSearch model-value="" placeholder="Cari vendor" />
      <form @submit.prevent="handleFilter">
        <div class="flex items-center space-x-3">
          <div
            class="dropdown"
            data-dropdown="true"
            data-dropdown-trigger="click"
            data-dropdown-placement="bottom-end"
          >
            <UiButton class="dropdown-toggle">
              <UiIcon variant="outline" name="filter" />
              <span>Filter</span>
            </UiButton>
            <div class="dropdown-content w-full max-w-60 p-4 space-y-5">
              <h1 class="text-lg font-semibold text-gray-700 mb-5">Filter</h1>
              <UiSelect label="Status" placeholder="Pilih">
                <option>Select Status</option>
              </UiSelect>
              <UiSelect label="Kategori" placeholder="Pilih">
                <option>Select Status</option>
              </UiSelect>
              <UiSelect label="Izin Usaha" placeholder="Pilih">
                <option>Select Status</option>
              </UiSelect>
              <div class="relative">
                <label
                  class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-5"
                >
                  Tanggal Pendaftaran Awal
                </label>
                <DatePicker model-value="" />
              </div>
              <div class="relative">
                <label
                  class="text-[11px] px-[3px] text-gray-500 bg-white absolute -top-[6px] left-[7px] leading-[12px] z-5"
                >
                  Tanggal Pendaftaran Akhir
                </label>
                <DatePicker model-value="" />
              </div>
              <UiInput label="Izin Usaha Expired" v-model="filters.izinUsahaExp" />
              <div class="flex items-center space-x-3">
                <UiButton :outline="true" class="flex-1" type="reset" @click="handleReset">
                  <UiIcon variant="filled" name="arrows-circle" />
                  Reset
                </UiButton>
                <UiButton class="flex-1">
                  <UiIcon variant="filled" name="check-circle" />
                  Terapkan
                </UiButton>
              </div>
            </div>
          </div>
          <UiButton :outline="true">
            <UiIcon variant="filled" name="printer" />
            Export Data Vendor
          </UiButton>
        </div>
      </form>
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
              <div class="dropdown" data-dropdown="true" data-dropdown-trigger="click">
                <UiButton :outline="true" :icon="true" variant="secondary" class="dropdown-toggle">
                  <UiIcon variant="outline" name="dots-vertical" />
                </UiButton>
                <div class="dropdown-content w-full max-w-60 space-y-5">
                  <ul class="menu menu-default flex flex-col gap-2">
                    <li class="menu-item">
                      <a class="menu-link" href="#">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="eye" />
                        </span>
                        <span class="menu-title"> Detail Vendor </span>
                      </a>
                    </li>
                    <li class="menu-item">
                      <a class="menu-link" href="#">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="data" />
                        </span>
                        <span class="menu-title"> Detail Verifikasi </span>
                      </a>
                    </li>
                    <div class="border-b border-b-gray-200"></div>
                    <li class="menu-item">
                      <a class="menu-link" href="#">
                        <span class="menu-icon">
                          <UiIcon variant="duotone" name="cross-circle" class="!text-red-600" />
                        </span>
                        <span class="menu-title !text-red-600"> Blacklist </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <label class="switch">
                <input
                  name="check"
                  type="checkbox"
                  value="1"
                  class="switch-on:checked:!bg-success"
                />
                <span class="switch-label"> Not Active </span>
              </label>
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
