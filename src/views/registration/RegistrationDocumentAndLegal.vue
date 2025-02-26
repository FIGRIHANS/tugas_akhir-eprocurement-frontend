<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup title="Kategori Perusahaan" :grid="4">
      <UiSelect label="Bagian" placeholder="Pilih" />
    </UiFormGroup>

    <div class="card min-w-full">
      <div class="card-table">
        <table class="table table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>Izin Usaha</th>
              <th>No Izin Usaha</th>
              <th>Berlaku (Tanggal Mulai)</th>
              <th>Berlaku (Tanggal Selesai)</th>
              <th>Dokumen</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No Data</td>
              <td>No Data</td>
              <td>No Data</td>
              <td>No Data</td>
              <td>No Data</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
</script>
