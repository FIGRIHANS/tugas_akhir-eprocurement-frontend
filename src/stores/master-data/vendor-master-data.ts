import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorApi from '@/core/utils/vendorApi'

import type { ApiResponse } from '@/core/type/api'
import type {
  CityListType,
  CountryListType,
  DistrictListType,
  PositionListType,
} from './types/vendor-master-data'

const baseUrl = '/public/vendor/registration'

export const useVendorMasterDataStore = defineStore('vendorMasterData', () => {
  const countryList = ref<CountryListType>([])
  const stateList = ref([])
  const cityList = ref<CityListType>([])
  const districtList = ref<DistrictListType>([])
  const posistionList = ref<PositionListType>([])

  const getVendorCountries = async (countryName?: string) => {
    const response: ApiResponse<CountryListType> = await vendorApi.get(`${baseUrl}/countries`, {
      params: {
        countryName,
      },
    })

    countryList.value = response.data.result.content

    return response.data.result
  }

  const getVendorStates = async () => {
    const response: ApiResponse = await vendorApi.get(`${baseUrl}/states`, {
      // params: {
      //   countryName,
      // },
    })

    stateList.value = response.data.result.content

    return response.data.result
  }

  const getVendorCities = async (provinceId?: number, cityName?: string) => {
    const response: ApiResponse<CityListType> = await vendorApi.get(`${baseUrl}/cities`, {
      params: {
        provinceId,
        cityName,
      },
    })

    cityList.value = response.data.result.content

    return response.data.result
  }

  const getVendorDistricts = async (cityId?: number, districtName?: string) => {
    const response: ApiResponse<DistrictListType> = await vendorApi.get(`${baseUrl}/districts`, {
      params: {
        cityId,
        districtName,
      },
    })

    districtList.value = response.data.result.content

    return response.data.result
  }

  const getVendorPosition = async (positionName?: string) => {
    const response: ApiResponse<PositionListType> = await vendorApi.get(`${baseUrl}/getJabatan`, {
      params: {
        positionName,
      },
    })

    posistionList.value = response.data.result.content

    return response.data.result
  }

  return {
    countryList,
    stateList,
    cityList,
    districtList,
    posistionList,
    getVendorCountries,
    getVendorStates,
    getVendorCities,
    getVendorDistricts,
    getVendorPosition,
  }
})
