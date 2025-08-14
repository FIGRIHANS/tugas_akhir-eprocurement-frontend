import { ref } from 'vue'
import { defineStore } from 'pinia'
import vendorAPI from '@/core/utils/vendorApi'

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
  ReferenceType,
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
  const equipmentCategoryList = ref<ReferenceType>([])
  const ownershipStatusList = ref<ReferenceType>([])
  const conditionTypeList = ref<ReferenceType>([])
  const termCondition = ref<TermConditionType>()

  const getVendorCountries = async (countryName?: string) => {
    const response: ApiResponse<CountryListType> = await vendorAPI.get(`${baseUrl}/countries`, {
      params: {
        countryName,
      },
    })

    countryList.value = response.data.result.content

    return response.data.result
  }

  const getVendorProvince = async (countryId?: number, provinceName?: string) => {
    const response: ApiResponse<ProvinceListType> = await vendorAPI.get(`${baseUrl}/province`, {
      params: {
        countryId,
        provinceName,
      },
    })

    provinceList.value = response.data.result.content

    return response.data.result
  }

  const getVendorCities = async (provinceId?: number, cityName?: string) => {
    const response: ApiResponse<CityListType> = await vendorAPI.get(`${baseUrl}/cities`, {
      params: {
        provinceId,
        cityName,
      },
    })

    cityList.value = response.data.result.content

    return response.data.result
  }

  const getVendorDistricts = async (cityId?: number, districtName?: string) => {
    const response: ApiResponse<DistrictListType> = await vendorAPI.get(`${baseUrl}/districts`, {
      params: {
        cityId,
        districtName,
      },
    })

    districtList.value = response.data.result.content

    return response.data.result
  }

  const getVendorPosition = async (positionName?: string) => {
    const response: ApiResponse<PositionListType> = await vendorAPI.get(`${baseUrl}/getJabatan`, {
      params: {
        positionName,
      },
    })

    posistionList.value = response.data.result.content

    return response.data.result
  }

  const getVendorBanks = async (bankCode?: string, bankName?: string, bankCountryCode?: string) => {
    const response: ApiResponse<BankListType> = await vendorAPI.get(`${baseUrl}/getbank`, {
      params: {
        bankCode,
        bankName,
        bankCountryCode,
      },
    })

    bankList.value = response.data.result.content

    return response.data.result
  }

  const getVendorBusinessFields = async (businessFieldName?: string) => {
    const response: ApiResponse<BusinessFieldResponse> = await vendorAPI.get(
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
    const response: ApiResponse<CurrencyListType> = await vendorAPI.get(
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
    const response: ApiResponse<CompanyCategoryType> = await vendorAPI.get(
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
    const response: ApiResponse<CompanyLicenseType> = await vendorAPI.get(
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

  const getVendorReference = async (
    type: 'EQUIPMENT_CATEGORY' | 'OWNERSHIP_STATUS' | 'CONDITION_TYPE',
  ) => {
    const response: ApiResponse<ReferenceType> = await vendorAPI.get(`${baseUrl}/reference`, {
      params: {
        type,
      },
    })

    if (type === 'EQUIPMENT_CATEGORY') {
      equipmentCategoryList.value = response.data.result.content
    } else if (type === 'OWNERSHIP_STATUS') {
      ownershipStatusList.value = response.data.result.content
    } else {
      conditionTypeList.value = response.data.result.content
    }

    return response.data.result
  }

  const getVendorTermCondition = async () => {
    const response: ApiResponse<TermConditionType> = await vendorAPI.get(
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

    const response: ApiResponse<UploadFileResponse> = await vendorAPI.post(
      '/api/file/upload',
      formData,
    )

    return response.data.result.content
  }

  const postVendorRegistration = async (payload: VendorRegistrationPayloadType) => {
    const response: ApiResponse = await vendorAPI.post(`${baseUrl}/create`, {
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
    equipmentCategoryList,
    ownershipStatusList,
    conditionTypeList,
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
    getVendorReference,
    getVendorTermCondition,
    uploadFile,
    postVendorRegistration,
  }
})
