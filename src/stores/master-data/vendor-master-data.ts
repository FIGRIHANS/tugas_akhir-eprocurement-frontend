import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorApi from '@/core/utils/vendorApi'

import type { ApiResponse } from '@/core/type/api'
import type {
  BankListType,
  BusinessFieldListType,
  BusinessFieldReducerType,
  BusinessFieldResponse,
  CityListType,
  CompanyCategoryType,
  CompanyLicenseType,
  CountryListType,
  CurrencyListType,
  DistrictListType,
  PositionListType,
  ProvinceListType,
  TermConditionType,
  UploadFileResponse,
  VendorRegistrationPayloadType,
} from './types/vendor-master-data'

const baseUrl = '/public/vendor/registration'

export const useVendorMasterDataStore = defineStore('vendorMasterData', () => {
  const countryList = ref<CountryListType>([])
  const provinceList = ref<ProvinceListType>([])
  const cityList = ref<CityListType>([])
  const districtList = ref<DistrictListType>([])
  const posistionList = ref<PositionListType>([])
  const bankList = ref<BankListType>([])
  const businessFieldList = ref<BusinessFieldListType>([])
  const currencyList = ref<CurrencyListType>([])
  const companyCategoryList = ref<CompanyCategoryType>([])
  const companyLicense = ref<CompanyLicenseType>([])
  const termCondition = ref<TermConditionType>()

  const getVendorCountries = async (countryName?: string) => {
    const response: ApiResponse<CountryListType> = await vendorApi.get(`${baseUrl}/countries`, {
      params: {
        countryName,
      },
    })

    countryList.value = response.data.result.content

    return response.data.result
  }

  const getVendorProvince = async (countryId?: number, provinceName?: string) => {
    const response: ApiResponse<ProvinceListType> = await vendorApi.get(`${baseUrl}/province`, {
      params: {
        countryId,
        provinceName,
      },
    })

    provinceList.value = response.data.result.content

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

  const getVendorBanks = async (bankCode?: string, bankName?: string) => {
    const response: ApiResponse<BankListType> = await vendorApi.get(`${baseUrl}/getbank`, {
      params: {
        bankCode,
        bankName,
      },
    })

    bankList.value = response.data.result.content

    return response.data.result
  }

  const getVendorBusinessFields = async (businessFieldName?: string) => {
    const response: ApiResponse<BusinessFieldResponse> = await vendorApi.get(
      `${baseUrl}/business-field`,
      {
        params: {
          businessFieldName,
        },
      },
    )

    const formatedResponse: BusinessFieldListType = Object.values(
      response.data.result.content.reduce(
        (
          acc: Record<number, BusinessFieldReducerType>,
          { businessFieldID, businessFieldName, subBusinessFieldID, subBusinessFieldName },
        ) => {
          if (!acc[businessFieldID]) {
            acc[businessFieldID] = { businessFieldID, businessFieldName, subBusiness: [] }
          }
          acc[businessFieldID].subBusiness.push({ subBusinessFieldID, subBusinessFieldName })
          return acc as Record<number, BusinessFieldReducerType>
        },
        {},
      ),
    )

    businessFieldList.value = formatedResponse

    return formatedResponse
  }

  const getVendorCurrency = async (currencyCode?: string, currencyName?: string) => {
    const response: ApiResponse<CurrencyListType> = await vendorApi.get(
      `${baseUrl}/currency/list`,
      {
        params: {
          currencyCode,
          currencyName,
        },
      },
    )

    currencyList.value = response.data.result.content

    return response.data.result
  }

  const getVendorCompanyCategory = async (companyCategoryName?: string) => {
    const response: ApiResponse<CompanyCategoryType> = await vendorApi.get(
      `${baseUrl}/company-category`,
      {
        params: {
          companyCategoryName,
        },
      },
    )

    companyCategoryList.value = response.data.result.content

    return response.data.result
  }

  const getVendorCompanyLicense = async (categoryId: number) => {
    const response: ApiResponse<CompanyLicenseType> = await vendorApi.get(
      `${baseUrl}/company-license`,
      {
        params: {
          categoryId,
        },
      },
    )

    companyLicense.value = response.data.result.content

    return response.data.result
  }

  const getVendorTermCondition = async () => {
    const response: ApiResponse<TermConditionType> = await vendorApi.get(
      `${baseUrl}/term-condition`,
    )

    termCondition.value = response.data.result.content

    return response.data.result
  }

  const uploadFile = async ({
    FormFile,
    Actioner,
    FolderName,
    FileName,
  }: {
    FormFile: File
    Actioner: string
    FolderName: string
    FileName: string
  }) => {
    const formData = new FormData()
    formData.append('FormFile', FormFile)
    formData.append('Actioner', Actioner)
    formData.append('FolderName', FolderName)
    formData.append('FileName', FileName)

    const response: ApiResponse<UploadFileResponse> = await vendorApi.post(
      '/api/file/upload',
      formData,
    )

    return response.data.result.content
  }

  const postVendorRegistration = async (payload: VendorRegistrationPayloadType) => {
    const response: ApiResponse = await vendorApi.post(`${baseUrl}/create`, {
      ...payload,
    })

    return response.data.result
  }

  return {
    countryList,
    provinceList,
    cityList,
    districtList,
    posistionList,
    bankList,
    businessFieldList,
    currencyList,
    companyCategoryList,
    companyLicense,
    termCondition,
    getVendorCountries,
    getVendorProvince,
    getVendorCities,
    getVendorDistricts,
    getVendorPosition,
    getVendorBanks,
    getVendorBusinessFields,
    getVendorCurrency,
    getVendorCompanyCategory,
    getVendorCompanyLicense,
    getVendorTermCondition,
    uploadFile,
    postVendorRegistration,
  }
})
