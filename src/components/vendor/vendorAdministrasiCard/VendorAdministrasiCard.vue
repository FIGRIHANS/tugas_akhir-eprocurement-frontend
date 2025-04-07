<script setup lang="ts">
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import type { IVendorAdministrasiCardProps } from './types/vendorAdministrasiCard'

withDefaults(defineProps<IVendorAdministrasiCardProps>(), {
  allowExport: false,
})
</script>
<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">Administrasi</div>
      <UiButton :outline="true" v-if="allowExport">
        <UiIcon name="printer" variant="duotone" />
        <span>Export Data</span>
      </UiButton>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="card-table border">
        <table class="table align-middle">
          <tbody>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Username</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Email User</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Nama Perusahaan</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Kategori Perusahaan</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Bisnis Unit</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Grup Perusahaan</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Nomor NPWP</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Berkas NPWP</td>
              <td class="text-sm font-bold text-gray-800">
                <UiButton :outline="true" size="sm">
                  <UiIcon name="cloud-download" variant="duotone" />
                  <span>Download Dokumen NPWP</span>
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-table border">
        <table class="table align-middle">
          <tbody>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Provinsi</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Kota</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Telepon</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Fax</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Email Vendor</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Website</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Preferensi Mata Uan</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium w-[182px]">Bidang Usaha</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card-table border">
      <table class="table align-middle">
        <tbody>
          <tr>
            <td class="text-sm text-gray-600 font-medium w-[182px]">Alamat Perusahaan</td>
            <td class="text-sm font-bold text-gray-800">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
