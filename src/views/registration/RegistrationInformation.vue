<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Perusahaan" body-class="px-4" hide-border>
      <UiInput
        v-model="information.perusahaan.namaPerusahaan"
        label="Nama Perusahaan"
        placeholder="Masukkan Nama Perusahaan"
        row
      />
      <UiInput
        v-model="information.perusahaan.groupPerusahaan"
        label="Group Perusahaan"
        placeholder="Masukkan Group Perusahaan"
        row
      />
      <UiInput
        v-model="information.perusahaan.tanggalBerdiri"
        label="Tanggal Berdiri"
        placeholder="Pilih Tanggal"
        row
      />
    </UiFormGroup>

    <UiFormGroup title="Lokasi Kantor Pusat" body-class="px-4" hide-border>
      <UiSelect
        v-model="information.lokasiKantorPusat.negara"
        label="Negara"
        placeholder="Pilih Negara"
        :options="countryList"
        value-key="countryID"
        text-key="countryName"
        row
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.provinsi"
        label="Provinsi"
        placeholder="Pilih Provinsi"
        :disabled="!information.lokasiKantorPusat.negara"
        row
      />
      <!-- :disabled="!information.lokasiKantorPusat.provinsi" -->
      <UiSelect
        v-model="information.lokasiKantorPusat.kabupatenKota"
        label="Kabupaten / Kota"
        placeholder="Pilih Kabupaten / Kota"
        :options="cityListHq"
        value-key="cityID"
        text-key="cityName"
        row
        @update:model-value="getDistrictList('hq')"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.kecamatan"
        label="Kecamatan"
        placeholder="Pilih Kecamatan"
        :disabled="!information.lokasiKantorPusat.kabupatenKota"
        :options="districtListHq"
        value-key="districtID"
        text-key="districtName"
        row
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
          :options="countryList"
          value-key="countryID"
          text-key="countryName"
          row
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.provinsi"
          label="Provinsi"
          placeholder="Pilih Provinsi"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.negara"
          row
        />
        <!-- :disabled="isSameAsHq || !information.lokasiPerusahaan.provinsi" -->
        <UiSelect
          v-model="information.lokasiPerusahaan.kabupatenKota"
          label="Kabupaten / Kota"
          placeholder="Pilih Kabupaten / Kota"
          :options="cityListCompany"
          value-key="cityID"
          text-key="cityName"
          row
          @update:model-value="getDistrictList('company')"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.kecamatan"
          label="Kecamatan"
          placeholder="Pilih Kecamatan"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.kabupatenKota"
          :options="districtListCompany"
          value-key="districtID"
          text-key="districtName"
          row
        />
      </UiFormGroup>

      <UiFormGroup hide-border>
        <UiInput
          v-model="information.lokasiPerusahaan.kodePos"
          label="Kode Pos"
          placeholder="Masukkan Kode Pos"
          row
        />
        <UiInput
          v-model="information.lokasiPerusahaan.alamatLengkap"
          label="Alamat Lengkap"
          placeholder="Masukkan Alamat Lengkap"
          row
        />
      </UiFormGroup>
    </UiFormGroup>

    <UiFormGroup title="Bidang Usaha & Bisnis Unit" body-class="px-4" hide-border>
      <div class="flex flex-row gap-4 items-end">
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label"> Bidang Usaha </label>
          <UiSelect v-model="information.bidangUsaha.selected" class="w-full" placeholder="Pilih" />
        </div>
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
            <tbody v-if="information.bidangUsaha.list.length === 0">
              <tr>
                <td class="text-center">No Data</td>
                <td></td>
              </tr>
            </tbody>
            <tbody v-else>
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
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label"> Bisnis Unit </label>
          <UiSelect v-model="information.bisnisUnit.selected" class="w-full" placeholder="Pilih" />
        </div>
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
            <tbody v-if="information.bisnisUnit.list.length === 0">
              <tr>
                <td class="text-center">No Data</td>
                <td></td>
              </tr>
            </tbody>
            <tbody v-else>
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
    </UiFormGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { useRegistrationVendorStore } from '@/stores/views/registration'
import { useVendorMasterDataStore } from '@/stores/master-data/vendor-master-data'

import type { CityListType, DistrictListType } from '@/stores/master-data/types/vendor-master-data'

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

const cityListHq = ref<CityListType>([])
const districtListHq = ref<DistrictListType>([])

const cityListCompany = ref<CityListType>([])
const districtListCompany = ref<DistrictListType>([])

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

const getCityList = async (type: 'hq' | 'company') => {
  const { lokasiKantorPusat, lokasiPerusahaan } = information.value
  const response = await vendorMasterDataStore.getVendorCities()
  // Number(type === 'hq' ? lokasiKantorPusat.kabupatenKota : lokasiPerusahaan.kabupatenKota),

  if (type === 'hq') {
    cityListHq.value = response.content
  } else {
    cityListCompany.value = response.content
  }
}

const getDistrictList = async (type: 'hq' | 'company') => {
  const { lokasiKantorPusat, lokasiPerusahaan } = information.value
  const response = await vendorMasterDataStore.getVendorDistricts(
    Number(type === 'hq' ? lokasiKantorPusat.kabupatenKota : lokasiPerusahaan.kabupatenKota),
  )

  if (type === 'hq') {
    districtListHq.value = response.content
  } else {
    districtListCompany.value = response.content
  }
}

watch(
  () => isSameAsHq.value && information.value.lokasiKantorPusat,
  () => {
    cityListCompany.value = cityListHq.value
    districtListCompany.value = districtListHq.value

    registrationVendorStore.information.lokasiPerusahaan = {
      ...registrationVendorStore.information.lokasiPerusahaan,
      ...information.value.lokasiKantorPusat,
    }
  },
  { deep: true },
)

onMounted(async () => {
  await vendorMasterDataStore.getVendorCountries()
  await getCityList('hq')
  await getCityList('company')
})
</script>
