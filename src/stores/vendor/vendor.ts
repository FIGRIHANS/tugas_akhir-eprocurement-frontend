import vendorAPI from '@/core/utils/vendorApi'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  IAdministration,
  IAdministrationPayload,
  IDeletePaymentPayload,
  ILicense,
  IPayment,
  IPaymentPayload,
  IPostBlacklist,
  IVendorContent,
  IVerificationDetailData,
  IVerifyLegal,
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

      const response = await vendorAPI.post(
        '/public/verifiedvendor/update-license',
        payload,
      );

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
