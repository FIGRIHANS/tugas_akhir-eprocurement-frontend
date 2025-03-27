<script lang="ts" setup>
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
</script>
<template>
  <div class="space-y-5">
    <!-- Card administrasi -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Administrasi</div>
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
                <td class="text-sm font-bold text-gray-800">-</td>
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

    <!-- card data izin usaha -->
    <div class="card card-grid">
      <div class="card-header">
        <div class="card-title">Data Izin Usaha</div>
      </div>
      <div class="card-table">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Jenis Izin Usaha</th>
              <th>No. Izin Usaha</th>
              <th>Tanggal Mulai Berlaku</th>
              <th>Tanggal Selesai</th>
              <th>Instansi Penerbit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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

    <!-- card payment information -->
    <div class="card card-grid">
      <div class="card-header">
        <div class="card-title">Payment Information</div>
      </div>
      <div class="card-body">
        <table class="table align-middle">
          <tbody>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Account Number</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Pemilik Akun</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Surat Pembayaran Perbedaan Rekening</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Halaman Pertama Buku Tabungan</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Mata Uang</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Nama Bank</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Alamat Bank</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Negara</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Bank Key</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">BI Code</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
            <tr>
              <td class="text-sm text-gray-600 font-medium">Swift Code</td>
              <td class="text-sm font-bold text-gray-800">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex justify-end">
      <UiButton>
        <UiIcon name="paper-plane" />
        Send Approval
      </UiButton>
    </div>
  </div>
</template>
