import vendorAPI from '@/core/utils/vendorApi'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  EquipmentDataType,
  IAdministration,
  IAdministrationPayload,
  IDeletePaymentPayload,
  ILicense,
  IPayment,
  IPaymentPayload,
  IPostBlacklist,
  IShareholderPayload,
  IVendorContent,
  IVendorLegalDocumentPayload,
  IVerificationDetailData,
  IVerifyLegal,
  PayloadEquipmentDataType,
} from './types/vendor'
import type { ApiResponse } from '@/core/type/api'
import axios from 'axios'
import { useLoginStore } from '../views/login'

const userStore = useLoginStore()

export const useVendorStore = defineStore('vendor', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const vendors = ref<IVendorContent>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  })
  const isAdministrationVerified = ref(false)
  const isLicenseVerified = ref(false)
  const isBankVerified = ref(false)
  const userData = computed(() => userStore.userData)

  const getVendors = async (params: Record<string, unknown>) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVendorContent> = await vendorAPI.get(
        `/public/vendor/registration/getvendor?employeeId=${userData.value?.profile.employeeId}`,
        { params },
      )

      if (response.data.result.isError) {
        error.value = response.data.result.message
        return
      }

      vendors.value = response.data.result.content
      return response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  const blacklistVendor = async (params: IPostBlacklist) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/verifiedvendor/blacklist/vendor',
      {},
      {
        params,
      },
    )

    return response.data
  }

  const verifyLegal = async (body: IVerifyLegal) => {
    const response: ApiResponse = await vendorAPI.post('/public/verifiedvendor/verify/vendor', body)
    return response.data
  }

  const deactiveVendor = async (payload: {
    vendorId: number
    reason: string
    employeeId: string
  }) => {
    const response: ApiResponse = await vendorAPI.post('/public/verifiedvendor/inactive', payload)
    return response.data
  }

  const activateVendor = async (payload: {
    vendorId: number
    reason: string
    employeeId: string
  }) => {
    const response: ApiResponse = await vendorAPI.post('/public/verifiedvendor/activate', payload)
    return response.data
  }

  return {
    vendors,
    loading,
    error,
    isAdministrationVerified,
    isLicenseVerified,
    isBankVerified,
    getVendors,
    blacklistVendor,
    verifyLegal,
    deactiveVendor,
    activateVendor,
  }
})

export const useVendorAdministrationStore = defineStore('vendor-administration', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IAdministration>()

  const getData = async (vendorId: string) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IAdministration> = await vendorAPI.get(
        '/public/vendor/registration/administration',
        {
          params: { vendorId },
        },
      )

      if (response.data.statusCode !== 200) {
        error.value = response.data.result.message
        loading.value = false
        return
      }

      data.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  const update = async (payload: IAdministrationPayload) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/verifiedvendor/update-administration',
      payload,
    )
    return response.data
  }

  return { data, loading, error, getData, update }
})

export const useVendorIzinUsahaStore = defineStore('vendor-izin-usaha', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<ILicense[]>([])

  const getData = async (vendorId: string) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<ILicense[]> = await vendorAPI.get(
        '/public/vendor/registration/license',
        {
          params: { vendorId },
        },
      )

      if (response.data.statusCode === 200) {
        data.value = response.data.result.content
      } else {
        error.value = response.data.result.message
        loading.value = false
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  /// TODO: change payload type soon
  const updateData = async (payload: any) => {
    loading.value = true
    error.value = null

    try {
      const response = await vendorAPI.post('/public/verifiedvendor/update-license', payload)

      if (response.data.statusCode === 200) {
        data.value = response.data.result.content
      } else {
        error.value = response.data.result.message
        loading.value = false
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to update data'
      }
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, getData, updateData }
})

export const useVendorPaymentStore = defineStore('vendor-payment', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IPayment[]>([])

  const getData = async (vendorId: string) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IPayment[]> = await vendorAPI.get(
        '/public/verifiedvendor/getbanklist',
        {
          params: { vendorId },
        },
      )

      if (response.data.statusCode === 200) {
        data.value = response.data.result.content
      } else {
        error.value = response.data.result.message
        loading.value = false
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to get data'
      }
    } finally {
      loading.value = false
    }
  }

  const addPayment = async (payload: IPaymentPayload) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/verifiedvendor/update-payment',
      payload,
    )
    return response.data
  }

  const deletePayment = async (payload: IDeletePaymentPayload) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/verifiedvendor/delete-payment',
      payload,
    )
    return response.data
  }

  return { data, loading, error, getData, addPayment, deletePayment }
})

export const useVerificationDetailStore = defineStore('verification-detail', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IVerificationDetailData[]>([])

  const getData = async (vendorId: number) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVerificationDetailData[]> = await vendorAPI.get(
        '/public/verifiedvendor/verify/vendor-detail',
        { params: { vendorId } },
      )
      data.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.result.message
        }
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, getData }
})

export const useEquipmentDataStore = defineStore('equipment-data', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<EquipmentDataType[]>([])

  const getData = async (vendorId: number) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<EquipmentDataType[]> = await vendorAPI.get(
        '/public/vendorchangedata/vendorequipment',
        { params: { vendorId } },
      )
      data.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.result.message
        }
      }
    } finally {
      loading.value = false
    }
  }

  const postData = async (payload: PayloadEquipmentDataType) => {
    const response: ApiResponse = await vendorAPI.post(
      '/public/vendorchangedata/post/vendorequipment',
      { ...payload },
    )

    return response.data.result
  }

  return { loading, error, data, getData, postData }
})

export const useExpertPersonnelDataStore = defineStore('expert-personnel-data', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IVerificationDetailData[]>([])

  const getData = async (vendorId: number) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVerificationDetailData[]> = await vendorAPI.get(
        '/public/verifiedvendor/verify/vendor-detail',
        { params: { vendorId } },
      )
      data.value = response.data.result.content
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.result.message
        }
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, getData }
})
export const useCompanyDeedDataStore = defineStore('company-deed-data', () => {
  const shareholdersData = ref<any>([]) ///TODO: change type soon
  const vendorLegalDocData = ref<any>([]) ///TODO: change type soon
  const shareholdersLoading = ref<boolean>(false)
  const vendorLegalDocLoading = ref<boolean>(false)
  const shareholdersError = ref<string | null>(null)
  const vendorLegalDocError = ref<string | null>(null)

  const getShareholders = async (vendorId: number) => {
    shareholdersLoading.value = true
    try {
      const response: ApiResponse = await vendorAPI.get('/public/vendorchangedata/shareholders', {
        params: { vendorId },
      })

      if (response.data.statusCode === 200) {
        shareholdersData.value = response.data.result.content
      }
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          shareholdersError.value = err.response?.data.result.message
        }
      }
    } finally {
      shareholdersLoading.value = false
    }
  }

  const getVendorLegalDocument = async (vendorId: number) => {
    vendorLegalDocLoading.value = true
    try {
      const response: ApiResponse = await vendorAPI.get(
        '/public/vendorchangedata/vendorlegaldocument',
        {
          params: { vendorId },
        },
      )

      if (response.data.statusCode === 200) {
        vendorLegalDocData.value = response.data.result.content
      }
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          vendorLegalDocError.value = err.response?.data.result.message
        }
      }
    } finally {
      vendorLegalDocLoading.value = false
    }
  }

  const postShareholders = async (payload: IShareholderPayload) => {
    try {
      const response: ApiResponse = await vendorAPI.post(
        '/public/vendorchangedata/post/shareholders',
        payload,
      )

      return response.data
    } catch (err) {
      throw err
    } finally {
      shareholdersLoading.value = false
    }
  }

  const postVendorLegalDocument = async (payload: IVendorLegalDocumentPayload) => {
    try {
      const response: ApiResponse = await vendorAPI.post(
        '/public/vendorchangedata/post/vendorlegaldocument',
        payload,
      )

      return response.data
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          vendorLegalDocError.value = err.response?.data.result.message
        }
      }
    } finally {
      vendorLegalDocLoading.value = false
    }
  }

  return {
    shareholdersLoading,
    vendorLegalDocLoading,
    shareholdersError,
    vendorLegalDocError,
    shareholdersData,
    vendorLegalDocData,
    postShareholders,
    postVendorLegalDocument,
    getShareholders,
    getVendorLegalDocument,
  }
})
