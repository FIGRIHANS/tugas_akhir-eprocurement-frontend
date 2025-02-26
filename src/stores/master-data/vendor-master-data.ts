import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/core/utils/api'

const baseUrl = '/public/vendor/registration'

export const useVendorMasterDataStore = defineStore('vendorMasterData', () => {
  const countryList = ref([])

  const getVendorCountries = async () => {
    if (countryList.value.length === 0) {
      const response = await api.get(`${baseUrl}/countries`)

      console.log(response.data)
    }
  }
  return { countryList, getVendorCountries }
})
