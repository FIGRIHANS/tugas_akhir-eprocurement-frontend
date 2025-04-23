import vendorAPI from '@/core/utils/vendorAPI'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IAdministration, IVendorContent } from './types/vendor'
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

  return { vendors, loading, error, getVendors }
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
      console.log(response.data)

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
