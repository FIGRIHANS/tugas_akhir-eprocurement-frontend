<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Perusahaan" body-class="px-4" hide-border>
      <UiInput
        v-model="information.perusahaan.namaPerusahaan"
        label="Nama Perusahaan"
        placeholder="Masukkan Nama Perusahaan"
        label-style="row"
      />
      <UiInput
        v-model="information.perusahaan.groupPerusahaan"
        label="Group Perusahaan"
        placeholder="Masukkan Group Perusahaan"
        label-style="row"
      />
      <UiInput
        v-model="information.perusahaan.tanggalBerdiri"
        label="Tanggal Berdiri"
        placeholder="Pilih Tanggal"
        label-style="row"
      />
    </UiFormGroup>

    <UiFormGroup title="Lokasi Kantor Pusat" body-class="px-4" hide-border>
      <UiSelect
        v-model="information.lokasiKantorPusat.negara"
        label="Negara"
        placeholder="Pilih Negara"
        label-style="row"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.provinsi"
        label="Provinsi"
        placeholder="Pilih Provinsi"
        :disabled="!information.lokasiKantorPusat.negara"
        label-style="row"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.kabupatenKota"
        label="Kabupaten / Kota"
        placeholder="Pilih Kabupaten / Kota"
        :disabled="!information.lokasiKantorPusat.provinsi"
        label-style="row"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.kecamatan"
        label="Kecamatan"
        placeholder="Pilih Kecamatan"
        :disabled="!information.lokasiKantorPusat.kabupatenKota"
        label-style="row"
      />
    </UiFormGroup>

    <hr class="col-span-2 border-t-gray-200" />

    <UiFormGroup title="Lokasi Perusahaan" body-class="px-4" hide-border>
      <UiCheckbox
        v-model="isSameAsHq"
        label="Lokasi perusahaan sama dengan kantor pusat"
        @click="checkSameAsHq"
      />

      <UiFormGroup hide-border>
        <UiSelect
          v-model="information.lokasiPerusahaan.negara"
          label="Negara"
          placeholder="Pilih Negara"
          :disabled="isSameAsHq"
          label-style="row"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.provinsi"
          label="Provinsi"
          placeholder="Pilih Provinsi"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.negara"
          label-style="row"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.kabupatenKota"
          label="Kabupaten/Kota"
          placeholder="Pilih Kabupaten/Kota"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.provinsi"
          label-style="row"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.kecamatan"
          label="Kecamatan"
          placeholder="Pilih Kecamatan"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.kabupatenKota"
          label-style="row"
        />
      </UiFormGroup>

      <UiFormGroup hide-border>
        <UiInput
          v-model="information.lokasiPerusahaan.kodePos"
          label="Kode Pos"
          placeholder="Masukkan Kode Pos"
          label-style="row"
        />
        <UiInput
          v-model="information.lokasiPerusahaan.alamatLengkap"
          label="Alamat Lengkap"
          placeholder="Masukkan Alamat Lengkap"
          label-style="row"
        />
      </UiFormGroup>
    </UiFormGroup>

    <UiFormGroup title="Bidang Usaha & Bisnis Unit" body-class="px-4" hide-border>
      <div class="flex flex-row gap-4 items-end">
        <UiSelect
          v-model="information.bidangUsaha.selected"
          class="w-full"
          label="Bidang Usaha"
          placeholder="Pilih"
          label-style="column"
        />
        <UiButton class="grow-0 w-fit" outline @click="addBusinessField">
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
                <th class="w-10">Action</th>
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

      <div class="flex flex-row gap-4 items-end">
        <UiSelect
          v-model="information.bisnisUnit.selected"
          class="w-full"
          label="Bisnis Unit"
          placeholder="Pilih"
          label-style="column"
        />
        <UiButton class="grow-0 w-fit" outline @click="addBusinessUnit">
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
                <th class="w-10">Action</th>
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
    </UiFormGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const information = computed(() => registrationVendorStore.information)
const isSameAsHq = ref<boolean>(false)

const countryList = computed(() => vendorMasterDataStore.countryList)

const checkSameAsHq = () => {
  if (!isSameAsHq.value) {
    registrationVendorStore.information.lokasiPerusahaan = {
      ...registrationVendorStore.information.lokasiPerusahaan,
      ...information.value.lokasiKantorPusat,
    }
  }
}

const addBusinessField = () => {
  console.log('business field', information.value.bidangUsaha.selected)
}

const addBusinessUnit = () => {
  console.log('business unit', information.value.bisnisUnit.selected)
}

watch(
  () => isSameAsHq.value && information.value.lokasiKantorPusat,
  () => {
    registrationVendorStore.information.lokasiPerusahaan = {
      ...registrationVendorStore.information.lokasiPerusahaan,
      ...information.value.lokasiKantorPusat,
    }
  },
  { deep: true },
)

onMounted(async () => {
  vendorMasterDataStore.getVendorCountries()
})
</script>
