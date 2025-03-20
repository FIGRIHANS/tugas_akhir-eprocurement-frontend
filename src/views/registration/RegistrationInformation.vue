<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Perusahaan" body-class="px-4" hide-border>
      <UiInput
        v-model="information.perusahaan.namaPerusahaan"
        label="Nama Perusahaan"
        placeholder="Masukkan Nama Perusahaan"
        row
        required
        :error="information.perusahaan.namaPerusahaanError"
      />
      <UiInput
        v-model="information.perusahaan.groupPerusahaan"
        label="Group Perusahaan"
        placeholder="Masukkan Group Perusahaan"
        row
      />
      <DatePicker
        v-model="information.perusahaan.tanggalBerdiri"
        label="Tanggal Berdiri"
        placeholder="Pilih Tanggal"
        format="MM/dd/yyyy"
        required
        :error="information.perusahaan.tanggalBerdiriError"
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
        required
        :error="information.lokasiKantorPusat.negaraError"
        @update:model-value="getStateList('hq')"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.provinsi"
        label="Provinsi"
        placeholder="Pilih Provinsi"
        :disabled="!information.lokasiKantorPusat.negara"
        :options="provinceListHq"
        value-key="provinceID"
        text-key="provinceName"
        row
        required
        :error="information.lokasiKantorPusat.provinsiError"
        @update:model-value="getCityList('hq')"
      />
      <UiSelect
        v-model="information.lokasiKantorPusat.kabupatenKota"
        label="Kabupaten / Kota"
        placeholder="Pilih Kabupaten / Kota"
        :disabled="!information.lokasiKantorPusat.provinsi"
        :options="cityListHq"
        value-key="cityID"
        text-key="cityName"
        row
        required
        :error="information.lokasiKantorPusat.kabupatenKotaError"
      />
      <UiInput
        v-model="information.lokasiKantorPusat.kodePos"
        label="Kode Pos"
        placeholder="Masukkan Kode Pos"
        row
        required
        :error="information.lokasiKantorPusat.kodePosError"
      />
      <UiTextarea
        v-model="information.lokasiKantorPusat.alamatLengkap"
        label="Alamat Lengkap"
        placeholder="Masukkan Alamat Lengkap"
        row
        required
        :error="information.lokasiKantorPusat.alamatLengkapError"
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
          required
          :error="information.lokasiPerusahaan.negaraError"
          @update:model-value="getStateList('company')"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.provinsi"
          label="Provinsi"
          placeholder="Pilih Provinsi"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.negara"
          row
          required
          :options="provinceListCompany"
          value-key="provinceID"
          text-key="provinceName"
          :error="information.lokasiPerusahaan.provinsiError"
          @update:model-value="getCityList('company')"
        />
        <UiSelect
          v-model="information.lokasiPerusahaan.kabupatenKota"
          label="Kabupaten / Kota"
          placeholder="Pilih Kabupaten / Kota"
          :disabled="isSameAsHq || !information.lokasiPerusahaan.provinsi"
          :options="cityListCompany"
          value-key="cityID"
          text-key="cityName"
          row
          required
          :error="information.lokasiPerusahaan.kabupatenKotaError"
        />
        <UiInput
          v-model="information.lokasiPerusahaan.kodePos"
          label="Kode Pos"
          placeholder="Masukkan Kode Pos"
          row
          required
          :disabled="isSameAsHq"
          :error="information.lokasiPerusahaan.kodePosError"
        />
        <UiTextarea
          v-model="information.lokasiPerusahaan.alamatLengkap"
          label="Alamat Lengkap"
          placeholder="Masukkan Alamat Lengkap"
          row
          required
          :disabled="isSameAsHq"
          :error="information.lokasiPerusahaan.alamatLengkapError"
        />
      </UiFormGroup>
    </UiFormGroup>

    <UiFormGroup title="Bidang Usaha & Bisnis Unit" body-class="px-4" hide-border>
      <div class="flex flex-row gap-4 items-end">
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label flex items-center gap-1">
            Bidang Usaha <span class="text-danger"> * </span></label
          >
          <UiSelect
            v-model="information.bidangUsaha.bidangUsaha"
            class="w-full"
            placeholder="Pilih"
            :error="information.bidangUsaha.bidangUsahaError"
            :options="businessFieldList"
            value-key="businessFieldID"
            text-key="businessFieldName"
            @update:model-value="getSubBusinessList"
          />
        </div>
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label flex items-center gap-1">
            Sub Bidang Usaha <span class="text-danger"> * </span></label
          >
          <UiSelect
            v-model="information.bidangUsaha.subBidangUsaha"
            class="w-full"
            placeholder="Pilih"
            :error="information.bidangUsaha.subBidangUsahaError"
            :options="subBusinessFieldList"
            value-key="subBusinessFieldID"
            text-key="subBusinessFieldName"
          />
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
              <tr v-for="(list, index) in information.bidangUsaha.list" :key="index">
                <td class="flex flex-col">
                  <span class="font-bold">{{ list.bidangUsahaName }}</span>
                  <span class="text-xs text-gray-700">{{ list.subBidangUsahaName }}</span>
                </td>
                <td>
                  <UiButton variant="danger" outline icon @click="deleteBidangUsaha(index)">
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

import type {
  CityListType,
  ProvinceListType,
  SubBusinessType,
} from '@/stores/master-data/types/vendor-master-data'

import UiFormGroup from '@/components/ui/atoms/form-group/UiFormGroup.vue'
import UiButton from '@/components/ui/atoms/button/UiButton.vue'
import UiInput from '@/components/ui/atoms/input/UiInput.vue'
import UiSelect from '@/components/ui/atoms/select/UiSelect.vue'
import UiIcon from '@/components/ui/atoms/icon/UiIcon.vue'
import UiCheckbox from '@/components/ui/atoms/checkbox/UiCheckbox.vue'
import DatePicker from '@/components/datePicker/DatePicker.vue'
import UiTextarea from '@/components/ui/atoms/textarea/UiTextarea.vue'

const registrationVendorStore = useRegistrationVendorStore()
const vendorMasterDataStore = useVendorMasterDataStore()

const information = computed(() => registrationVendorStore.information)
const isSameAsHq = ref<boolean>(false)

const countryList = computed(() => vendorMasterDataStore.countryList)
const businessFieldList = computed(() => vendorMasterDataStore.businessFieldList)
const subBusinessFieldList = ref<SubBusinessType[]>([])

const provinceListHq = ref<ProvinceListType>([])
const cityListHq = ref<CityListType>([])

const provinceListCompany = ref<ProvinceListType>([])
const cityListCompany = ref<CityListType>([])

const checkSameAsHq = () => {
  if (!isSameAsHq.value) {
    registrationVendorStore.information.lokasiPerusahaan = {
      ...information.value.lokasiKantorPusat,
    }
  }
}

const getStateList = async (type: 'hq' | 'company') => {
  const { lokasiKantorPusat, lokasiPerusahaan } = information.value
  const response = await vendorMasterDataStore.getVendorProvince(
    Number(type === 'hq' ? lokasiKantorPusat.negara : lokasiPerusahaan.negara),
  )

  if (type === 'hq') {
    provinceListHq.value = response.content
    registrationVendorStore.information.lokasiKantorPusat.provinsi = 0
    registrationVendorStore.information.lokasiKantorPusat.kabupatenKota = 0
  } else {
    provinceListCompany.value = response.content
    registrationVendorStore.information.lokasiPerusahaan.provinsi = 0
    registrationVendorStore.information.lokasiPerusahaan.kabupatenKota = 0
  }
}

const getCityList = async (type: 'hq' | 'company') => {
  const { lokasiKantorPusat, lokasiPerusahaan } = information.value
  const response = await vendorMasterDataStore.getVendorCities(
    Number(type === 'hq' ? lokasiKantorPusat.provinsi : lokasiPerusahaan.provinsi),
  )

  if (type === 'hq') {
    cityListHq.value = response.content
    registrationVendorStore.information.lokasiKantorPusat.kabupatenKota = 0
  } else {
    cityListCompany.value = response.content
    registrationVendorStore.information.lokasiPerusahaan.kabupatenKota = 0
  }
}

const getSubBusinessList = () => {
  registrationVendorStore.information.bidangUsaha.subBidangUsaha = 0

  const searchSubBusiness = businessFieldList.value.find(
    (item) => item.businessFieldID === information.value.bidangUsaha.bidangUsaha,
  )

  subBusinessFieldList.value = searchSubBusiness!.subBusiness
}

const addBusinessField = () => {
  const { bidangUsaha, subBidangUsaha } = information.value.bidangUsaha
  if (bidangUsaha && subBidangUsaha) {
    registrationVendorStore.information.bidangUsaha = {
      ...registrationVendorStore.information.bidangUsaha,
      bidangUsahaError: false,
      subBidangUsahaError: false,
    }

    const searchBusiness = businessFieldList.value.find(
      (item) => item.businessFieldID === bidangUsaha,
    )

    const searchSubBusiness = searchBusiness?.subBusiness.find(
      (item) => item.subBusinessFieldID === subBidangUsaha,
    )

    registrationVendorStore.information.bidangUsaha.list.push({
      bidangUsaha,
      bidangUsahaName: searchBusiness!.businessFieldName,
      subBidangUsaha,
      subBidangUsahaName: searchSubBusiness!.subBusinessFieldName,
    })

    registrationVendorStore.information.bidangUsaha.bidangUsaha = 0
    registrationVendorStore.information.bidangUsaha.subBidangUsaha = 0
  } else {
    registrationVendorStore.information.bidangUsaha = {
      ...registrationVendorStore.information.bidangUsaha,
      bidangUsahaError: bidangUsaha === 0,
      subBidangUsahaError: subBidangUsaha === 0,
    }
  }
}

const deleteBidangUsaha = (index: number) => {
  registrationVendorStore.information.bidangUsaha.list.splice(index, 1)
}

watch(
  () => isSameAsHq.value && information.value.lokasiKantorPusat,
  () => {
    provinceListCompany.value = provinceListHq.value
    cityListCompany.value = cityListHq.value

    registrationVendorStore.information.lokasiPerusahaan = {
      ...information.value.lokasiKantorPusat,
    }
  },
  { deep: true },
)

onMounted(async () => {
  await vendorMasterDataStore.getVendorCountries()
  await vendorMasterDataStore.getVendorBusinessFields()
})
</script>
