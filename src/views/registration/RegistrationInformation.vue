<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Perusahaan" body-class="px-4" hide-border>
      <UiInput
        v-model="information.vendor.vendorName"
        label="Nama Perusahaan"
        placeholder="Masukkan Nama Perusahaan"
        row
        required
        :error="information.vendor.vendorNameError"
      />
      <UiInput
        v-model="information.vendor.groupCompany"
        label="Group Perusahaan"
        placeholder="Masukkan Group Perusahaan"
        row
      />
      <DatePicker
        v-model="information.vendor.foundedDate"
        label="Tanggal Berdiri"
        placeholder="Pilih Tanggal"
        format="dd MM yyyy"
        required
        :error="information.vendor.foundedDateError"
        @update:modelValue="changeFormatDate"
      />
    </UiFormGroup>

    <UiFormGroup title="Lokasi Kantor Pusat" body-class="px-4" hide-border>
      <UiSelect
        v-model="information.companyLocation.countryId"
        label="Negara"
        placeholder="Pilih Negara"
        :options="countryList"
        value-key="countryID"
        text-key="countryName"
        row
        required
        :error="information.companyLocation.countryError"
        @update:model-value="selectCountry('hq')"
      />
      <UiSelect
        v-model="information.companyLocation.stateId"
        label="Provinsi"
        placeholder="Pilih Provinsi"
        :disabled="!information.companyLocation.countryId"
        :options="provinceListCompany"
        value-key="provinceID"
        text-key="provinceName"
        row
        required
        :error="information.companyLocation.stateError"
        @update:model-value="selectProvince('hq')"
      />
      <UiSelect
        v-model="information.companyLocation.cityId"
        label="Kabupaten / Kota"
        placeholder="Pilih Kabupaten / Kota"
        :disabled="!information.companyLocation.stateId"
        :options="cityListCompany"
        value-key="cityID"
        text-key="cityName"
        row
        required
        :error="information.companyLocation.cityError"
        @update:model-value="selectCity('hq')"
      />
      <UiInput
        v-model="information.companyLocation.postalCode"
        label="Kode Pos"
        placeholder="Masukkan Kode Pos"
        row
        required
        :error="information.companyLocation.postalCodeError"
      />
      <UiTextarea
        v-model="information.companyLocation.addressDetail"
        label="Alamat Lengkap"
        placeholder="Masukkan Alamat Lengkap"
        row
        required
        :error="information.companyLocation.addressDetailError"
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
          v-model="information.vendorLocation.countryId"
          label="Negara"
          placeholder="Pilih Negara"
          :disabled="isSameAsHq"
          :options="countryList"
          value-key="countryID"
          text-key="countryName"
          row
          required
          :error="information.vendorLocation.countryError"
          @update:model-value="selectCountry('company')"
        />
        <UiSelect
          v-model="information.vendorLocation.stateId"
          label="Provinsi"
          placeholder="Pilih Provinsi"
          :disabled="isSameAsHq || !information.vendorLocation.countryId"
          row
          required
          :options="provinceListCompany"
          value-key="provinceID"
          text-key="provinceName"
          :error="information.vendorLocation.stateError"
          @update:model-value="selectProvince('company')"
        />
        <UiSelect
          v-model="information.vendorLocation.cityId"
          label="Kabupaten / Kota"
          placeholder="Pilih Kabupaten / Kota"
          :disabled="isSameAsHq || !information.vendorLocation.stateId"
          :options="cityListCompany"
          value-key="cityID"
          text-key="cityName"
          row
          required
          :error="information.vendorLocation.cityError"
          @update:model-value="selectCity('company')"
        />
        <UiInput
          v-model="information.vendorLocation.postalCode"
          label="Kode Pos"
          placeholder="Masukkan Kode Pos"
          row
          required
          :disabled="isSameAsHq"
          :error="information.vendorLocation.postalCodeError"
        />
        <UiTextarea
          v-model="information.vendorLocation.addressDetail"
          label="Alamat Lengkap"
          placeholder="Masukkan Alamat Lengkap"
          row
          required
          :disabled="isSameAsHq"
          :error="information.vendorLocation.addressDetailError"
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
            v-model="information.vendorCommodities.businessFieldId"
            class="w-full"
            placeholder="Pilih"
            :error="information.vendorCommodities.businessFieldError"
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
            v-model="information.vendorCommodities.subBusinessFieldId"
            class="w-full"
            placeholder="Pilih"
            :error="information.vendorCommodities.subBusinessFieldError"
            :options="subBusinessFieldList"
            value-key="subBusinessFieldID"
            text-key="subBusinessFieldName"
          />
        </div>
        <UiButton class="grow-0 w-fit" outline @click="addVendorCommodities">
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
            <tbody v-if="information.vendorCommodities.list.length === 0">
              <tr>
                <td class="text-center">No Data</td>
                <td></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="(list, index) in information.vendorCommodities.list" :key="index">
                <td class="flex flex-col">
                  <span class="font-bold">{{ list.businessFieldName }}</span>
                  <span class="text-xs text-gray-700">{{ list.subBusinessFieldName }}</span>
                </td>
                <td>
                  <UiButton variant="danger" outline icon @click="deleteVendorCommodities(index)">
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
import moment from 'moment'

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

const provinceListCompany = ref<ProvinceListType>([])
const cityListCompany = ref<CityListType>([])

const provinceListVendor = ref<ProvinceListType>([])
const cityListVendor = ref<CityListType>([])

const changeFormatDate = () => {
  registrationVendorStore.information.vendor.foundedDate = moment(
    information.value.vendor.foundedDate,
  ).format('YYYY-MM-DD')
}

const checkSameAsHq = () => {
  if (!isSameAsHq.value) {
    registrationVendorStore.information.vendorLocation = {
      ...information.value.companyLocation,
    }
  }
}

const selectCountry = async (type: 'hq' | 'company') => {
  const locationKey = type === 'hq' ? 'companyLocation' : 'vendorLocation'
  const countryId = information.value[locationKey].countryId

  const response = await vendorMasterDataStore.getVendorProvince(countryId)
  const countryName =
    countryList.value.find((item) => item.countryID === countryId)?.countryName ?? ''

  if (type === 'hq') {
    provinceListCompany.value = response.content
  } else {
    provinceListVendor.value = response.content
  }

  registrationVendorStore.information[locationKey] = {
    ...registrationVendorStore.information[locationKey],
    country: countryName,
    stateId: 0,
    state: '',
    cityId: 0,
    city: '',
  }
}

const selectProvince = async (type: 'hq' | 'company') => {
  const locationKey = type === 'hq' ? 'companyLocation' : 'vendorLocation'
  const provinceList = type === 'hq' ? provinceListCompany.value : provinceListVendor.value
  const stateId = information.value[locationKey].stateId

  const response = await vendorMasterDataStore.getVendorCities(stateId)
  const stateName = provinceList.find((item) => item.provinceID === stateId)?.provinceName ?? ''

  if (type === 'hq') {
    cityListCompany.value = response.content
  } else {
    cityListVendor.value = response.content
  }

  registrationVendorStore.information[locationKey] = {
    ...registrationVendorStore.information[locationKey],
    state: stateName,
    cityId: 0,
    city: '',
  }
}

const selectCity = async (type: 'hq' | 'company') => {
  const locationKey = type === 'hq' ? 'companyLocation' : 'vendorLocation'
  const cityList = type === 'hq' ? cityListCompany.value : cityListVendor.value
  const cityId = information.value[locationKey].cityId

  const cityName = cityList.find((item) => item.cityID === cityId)?.cityName ?? ''

  registrationVendorStore.information[locationKey].city = cityName
}

const getSubBusinessList = () => {
  registrationVendorStore.information.vendorCommodities.subBusinessFieldId = 0

  const searchSubBusiness = businessFieldList.value.find(
    (item) => item.businessFieldID === information.value.vendorCommodities.businessFieldId,
  )

  subBusinessFieldList.value = searchSubBusiness!.subBusiness
}

const addVendorCommodities = () => {
  const { businessFieldId, subBusinessFieldId } = information.value.vendorCommodities
  if (businessFieldId && subBusinessFieldId) {
    registrationVendorStore.information.vendorCommodities = {
      ...registrationVendorStore.information.vendorCommodities,
      businessFieldError: false,
      subBusinessFieldError: false,
    }

    const searchBusiness = businessFieldList.value.find(
      (item) => item.businessFieldID === businessFieldId,
    )

    const searchSubBusiness = searchBusiness?.subBusiness.find(
      (item) => item.subBusinessFieldID === subBusinessFieldId,
    )

    registrationVendorStore.information.vendorCommodities.list.push({
      businessFieldId,
      businessFieldName: searchBusiness!.businessFieldName,
      subBusinessFieldId,
      subBusinessFieldName: searchSubBusiness!.subBusinessFieldName,
    })

    registrationVendorStore.information.vendorCommodities.businessFieldId = 0
    registrationVendorStore.information.vendorCommodities.subBusinessFieldId = 0
  } else {
    registrationVendorStore.information.vendorCommodities = {
      ...registrationVendorStore.information.vendorCommodities,
      businessFieldError: businessFieldId === 0,
      subBusinessFieldError: subBusinessFieldId === 0,
    }
  }
}

const deleteVendorCommodities = (index: number) => {
  registrationVendorStore.information.vendorCommodities.list.splice(index, 1)
}

watch(
  () => isSameAsHq.value && information.value.companyLocation,
  () => {
    provinceListCompany.value = provinceListCompany.value
    cityListCompany.value = cityListCompany.value

    registrationVendorStore.information.vendorLocation = {
      ...information.value.companyLocation,
    }
  },
  { deep: true },
)

onMounted(() => {
  vendorMasterDataStore.getVendorCountries()
  vendorMasterDataStore.getVendorBusinessFields()
})
</script>
