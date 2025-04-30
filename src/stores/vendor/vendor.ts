import vendorAPI from '@/core/utils/vendorAPI'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  IAdministration,
  ILicense,
  IPayment,
  IPostBlacklist,
  IVendorContent,
} from './types/vendor'
import type { ApiResponse } from '@/core/type/api'

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

  const getVendors = async (params: unknown) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVendorContent> = await vendorAPI.get(
        '/public/vendor/registration/getvendor',
        { params },
      )

      if (response.data.statusCode === 200) {
        vendors.value = response.data.result.content
      } else {
        error.value = response.data.result.message
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

  const blacklistVendor = async (params: IPostBlacklist) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse = await vendorAPI.post('verifiedvendor/blacklist/vendor', {
        params,
      })

      if (response.data.statusCode !== 200) {
        error.value = response.data.result.message
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to blacklist vendor'
      }
    }
  }

  return {
    vendors,
    loading,
    error,
    getVendors,
    blacklistVendor,
    isAdministrationVerified,
    isLicenseVerified,
    isBankVerified,
  }
})

export const useVendorAdministrationStore = defineStore('vendor-administration', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<IAdministration[]>([])

  const getData = async (vendorId: string) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IAdministration[]> = await vendorAPI.get(
        '/public/vendor/registration/administration',
        {
          params: { vendorId },
        },
      )

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

  return { data, loading, error, getData }
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

  return { data, loading, error, getData }
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

  return { data, loading, error, getData }
})
