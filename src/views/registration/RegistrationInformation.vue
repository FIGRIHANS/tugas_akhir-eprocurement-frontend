<template>
  <div class="grid grid-cols-2 gap-12 mb-[24px]">
    <UiFormGroup title="Company" body-class="px-4" hide-border>
      <UiInput
        v-model="information.vendor.vendorName"
        label="Company Name"
        placeholder="Enter your company name"
        row
        required
        :error="information.vendor.vendorNameError"
        @update:model-value="
          (value) => {
            registrationVendorStore.contact.account.username = value
              .replace(/[\s-]/g, '.')
              .toLowerCase()
          }
        "
      />
      <UiInput
        v-model="information.vendor.groupCompany"
        label="Company Group"
        placeholder="Enter your company group"
        row
      />
      <DatePicker
        v-model="information.vendor.foundedDate"
        label="Establishment Date"
        placeholder="Select Date"
        format="dd MM yyyy"
        required
        :error="information.vendor.foundedDateError"
        :max-date="todayDate"
      />
    </UiFormGroup>

    <UiFormGroup title="Company Location" body-class="px-4" hide-border>
      <UiSelect
        v-model="information.companyLocation.countryId"
        label="Country"
        placeholder="Select"
        :options="countryList"
        value-key="countryID"
        text-key="countryName"
        row
        required
        :error="information.companyLocation.countryIdError"
        @update:model-value="selectCountry('hq')"
      />
      <UiSelect
        v-model="information.companyLocation.stateId"
        label="Province"
        placeholder="Select"
        :disabled="!information.companyLocation.countryId"
        :options="provinceListCompany"
        value-key="provinceID"
        text-key="provinceName"
        row
        required
        :error="information.companyLocation.stateIdError"
        @update:model-value="selectProvince('hq')"
      />
      <UiSelect
        v-model="information.companyLocation.cityId"
        label="City / District"
        placeholder="Select"
        :disabled="!information.companyLocation.stateId"
        :options="cityListCompany"
        value-key="cityID"
        text-key="cityName"
        row
        :required="checkCityRequired('hq')"
        :error="information.companyLocation.cityIdError"
        @update:model-value="selectCity('hq')"
      />
      <UiInput
        v-model="information.companyLocation.postalCode"
        label="Postal Code"
        placeholder="Enter postal code"
        row
        required
        type="number"
        :error="information.companyLocation.postalCodeError"
      />
      <UiTextarea
        v-model="information.companyLocation.addressDetail"
        label="Full Address"
        placeholder="Enter full address"
        row
        required
        :error="information.companyLocation.addressDetailError"
      />
    </UiFormGroup>

    <hr class="col-span-2 border-t-gray-200" />

    <UiFormGroup title="Head Office Location" body-class="px-4" hide-border>
      <UiCheckbox
        v-model="isSameAsHq"
        label="Company location is the same as the head office"
        @click="checkSameAsHq"
      />

      <UiFormGroup hide-border>
        <UiSelect
          v-model="information.vendorLocation.countryId"
          label="Country"
          placeholder="Select"
          :disabled="isSameAsHq"
          :options="countryList"
          value-key="countryID"
          text-key="countryName"
          row
          required
          :error="information.vendorLocation.countryIdError"
          @update:model-value="selectCountry('company')"
        />
        <UiSelect
          v-model="information.vendorLocation.stateId"
          label="Province"
          placeholder="Select"
          :disabled="isSameAsHq || !information.vendorLocation.countryId"
          row
          required
          :options="provinceListVendor"
          value-key="provinceID"
          text-key="provinceName"
          :error="information.vendorLocation.stateIdError"
          @update:model-value="selectProvince('company')"
        />
        <UiSelect
          v-model="information.vendorLocation.cityId"
          label="City / District"
          placeholder="Select"
          :disabled="isSameAsHq || !information.vendorLocation.stateId"
          :options="cityListVendor"
          value-key="cityID"
          text-key="cityName"
          row
          :required="checkCityRequired('company')"
          :error="information.vendorLocation.cityIdError"
          @update:model-value="selectCity('company')"
        />
        <UiInput
          v-model="information.vendorLocation.postalCode"
          label="Postal Code"
          placeholder="Enter postal code"
          row
          required
          type="number"
          :disabled="isSameAsHq"
          :error="information.vendorLocation.postalCodeError"
        />
        <UiTextarea
          v-model="information.vendorLocation.addressDetail"
          label="Full Address"
          placeholder="Enter full address"
          row
          required
          :disabled="isSameAsHq"
          :error="information.vendorLocation.addressDetailError"
        />
      </UiFormGroup>
    </UiFormGroup>

    <UiFormGroup title="Business Sector " body-class="px-4" hide-border>
      <div class="flex flex-row gap-4 items-end">
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label flex items-center gap-1">
            Business Sector <span class="text-danger"> * </span></label
          >
          <UiSelect
            v-model="information.vendorCommodities.businessFieldId"
            class="w-full"
            placeholder="Select"
            :error="information.vendorCommodities.businessFieldError"
            :options="businessFieldList"
            value-key="businessFieldID"
            text-key="businessFieldName"
            @update:model-value="getSubBusinessList"
          />
        </div>
        <div class="flex flex-col gap-2.5 w-full">
          <label class="form-label flex items-center gap-1">
            Sub-Sector <span class="text-danger"> * </span></label
          >
          <UiSelect
            v-model="information.vendorCommodities.subBusinessFieldId"
            class="w-full"
            placeholder="Select"
            :error="information.vendorCommodities.subBusinessFieldError"
            :options="subBusinessFieldList"
            value-key="subBusinessFieldID"
            text-key="subBusinessFieldName"
          />
        </div>
        <UiButton class="grow-0 w-fit" outline @click="addVendorCommodities">
          <UiIcon name="plus-circle" variant="duotone" />
          Add
        </UiButton>
      </div>

      <div class="card min-w-full">
        <div class="card-table">
          <table class="table table-border align-middle text-gray-700 font-medium text-sm">
            <thead>
              <tr>
                <th>List of Business Sectors</th>
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
const todayDate = new Date()

const countryList = computed(() => vendorMasterDataStore.countryList)
const businessFieldList = computed(() => vendorMasterDataStore.businessFieldList)
const subBusinessFieldList = ref<SubBusinessType[]>([])

const provinceListCompany = ref<ProvinceListType>([])
const cityListCompany = ref<CityListType>([])

const provinceListVendor = ref<ProvinceListType>([])
const cityListVendor = ref<CityListType>([])

const checkSameAsHq = () => {
  if (!isSameAsHq.value) {
    registrationVendorStore.information.vendorLocation = {
      ...information.value.companyLocation,
    }
  }
}

const checkCityRequired = (type: 'hq' | 'company') => {
  const locationKey = type === 'hq' ? 'companyLocation' : 'vendorLocation'
  const countryId = information.value[locationKey].countryId

  if ([0, 360].includes(countryId)) {
    return true
  }

  return false
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
    provinceListVendor.value = provinceListCompany.value
    cityListVendor.value = cityListCompany.value

    registrationVendorStore.information.vendorLocation = {
      ...information.value.companyLocation,
    }
  },
  { deep: true },
)

onMounted(async () => {
  vendorMasterDataStore.getVendorCountries()
  vendorMasterDataStore.getVendorBusinessFields()

  const { countryId: vedorCountryId, stateId: vendorStateId } = information.value.vendorLocation
  const { countryId: companyCountryId, stateId: companyStateId } = information.value.companyLocation

  if (vedorCountryId) {
    const response = await vendorMasterDataStore.getVendorProvince(vedorCountryId)
    provinceListVendor.value = response.content
  }

  if (vendorStateId) {
    const response = await vendorMasterDataStore.getVendorCities(vendorStateId)
    cityListVendor.value = response.content
  }

  if (companyCountryId) {
    const response = await vendorMasterDataStore.getVendorProvince(companyCountryId)
    provinceListCompany.value = response.content
  }

  if (companyStateId) {
    const response = await vendorMasterDataStore.getVendorCities(companyStateId)
    cityListCompany.value = response.content
  }
})
</script>
