<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup title="Account" :grid="4">
      <UiInput label="Username" placeholder="Masukkan Username" />
      <UiInput label="Email" placeholder="Masukkan Email" />
      <UiInput label="Password" placeholder="Masukkan Password" />
      <UiInput label="Ulangi Password" placeholder="Ulangi Password" />

      <UiInput label="Website" placeholder="Masukkan website" />
      <UiInput label="No Telephone" placeholder="Masukkan no telephone" />
      <UiInput label="No Fax" placeholder="Masukkan no fax" />
    </UiFormGroup>

    <UiFormGroup>
      <UiFormGroup title="Contact Person" :grid="4" hide-border>
        <UiInput label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
        <UiInput label="No Telephone" placeholder="Masukkan no telephone" />
        <UiInput label="Email" placeholder="Masukkan email" />
        <UiSelect label="Bagian" placeholder="Pilih" />
      </UiFormGroup>

      <UiButton class="w-fit" outline>
        <UiIcon variant="duotone" name="plus-circle" />
        Tambah
      </UiButton>
    </UiFormGroup>

    <div class="card min-w-full">
      <div class="card-table">
        <table class="table table-border align-middle text-gray-700 font-medium text-sm">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>No Telephone</th>
              <th>Email</th>
              <th>Bagian</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
</script>
