import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorApi from '@/core/utils/vendorApi'

import type { ApiResponse } from '@/core/type/api'
import type { CountriesType } from './types/vendor-master-data'

const baseUrl = '/public/vendor/registration'

export const useVendorMasterDataStore = defineStore('vendorMasterData', () => {
  const countryList = ref<CountriesType[]>([])

  const getVendorCountries = async () => {
    if (countryList.value.length === 0) {
      const response: ApiResponse<CountriesType[]> = await vendorApi.get(`${baseUrl}/countries`)

      console.log(response.data.result)

      countryList.value = response.data.result.content
    }
  }
  return { countryList, getVendorCountries }
})
