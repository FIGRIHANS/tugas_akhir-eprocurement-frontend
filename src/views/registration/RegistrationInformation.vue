<template>
  <div class="flex flex-col gap-[24px] mb-[24px]">
    <UiFormGroup title="Nama Perusahaan">
      <div class="grid grid-cols-3 gap-[24px]">
        <UiInput label="Nama Perusahaan" placeholder="Masukkan Nama Perusahaan" />
        <UiInput label="Group Perusahaan" placeholder="Masukkan Group Perusahaan" />
        <UiInput label="Tanggal Berdiri" placeholder="Pilih Tanggal" />
      </div>
    </UiFormGroup>

    <UiFormGroup title="Lokasi Kantor Pusat">
      <div class="grid grid-cols-4 gap-[24px]">
        <UiSelect label="Negara" placeholder="Pilih Negara" />
        <UiSelect label="Provinsi" placeholder="Pilih Provinsi" />
        <UiSelect label="Kabupaten/Kota" placeholder="Pilih Kabupaten/Kota" />
        <UiSelect label="Kecamatan" placeholder="Pilih Kecamatan" />
      </div>
    </UiFormGroup>

    <UiFormGroup title="Lokasi Perusahaan">
      <div class="grid grid-cols-4 gap-[24px]">
        <UiSelect label="Negara" placeholder="Pilih Negara" />
        <UiSelect label="Provinsi" placeholder="Pilih Provinsi" />
        <UiSelect label="Kabupaten/Kota" placeholder="Pilih Kabupaten/Kota" />
        <UiSelect label="Kecamatan" placeholder="Pilih Kecamatan" />
      </div>
      <div class="grid grid-cols-4 gap-[24px]">
        <UiInput label="Kode Pos" placeholder="Masukkan Kode Pos" />
        <UiInput class="col-span-3" label="Alamat Lengkap" placeholder="Masukkan Alamat Lengkap" />
      </div>
    </UiFormGroup>

    <UiFormGroup title="Bidang Usaha & Bisnis Unit" hide-border>
      <div class="grid grid-cols-2 gap-[24px]">
        <div class="flex flex-col gap-4 items-end">
          <UiSelect class="w-full" label="Bidang Usaha" placeholder="Pilih" />
          <UiButton class="grow-0 w-fit" outline>
            <UiIcon name="plus-circle" variant="duotone" />
            Tambah
          </UiButton>
        </div>

        <div class="card min-w-full">
          <div class="card-table">
            <table class="table table-border align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th>Daftar Bidang Usaha</th>
                  <th class="min-2-md">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 4" :key="i">
                  <td class="flex flex-col">
                    <span class="font-semibold">Aktivitas teknologi dan aplikasi</span>
                    <span>09234</span>
                  </td>
                  <td>
                    <UiButton variant="danger" outline icon>
                      <UiIcon variant="duotone" name="cross-circle" />
                    </UiButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-[24px]">
        <div class="flex flex-col gap-4 items-end">
          <UiSelect class="w-full" label="Bisnis Unit" placeholder="Pilih" />
          <UiButton class="grow-0 w-fit" outline>
            <UiIcon name="plus-circle" variant="duotone" />
            Tambah
          </UiButton>
        </div>
        <div class="card min-w-full">
          <div class="card-table">
            <table class="table table-border align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th>Daftar Bisnis Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No Data</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UiFormGroup>
  </div>
</template>

<script lang="ts" setup>
import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
</script>
