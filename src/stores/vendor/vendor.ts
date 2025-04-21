import vendorAPI from '@/core/utils/vendorAPI'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IVendorContent } from './types/vendor'
import type { ApiResponse } from '@/core/type/api'

export const useVendorStore = defineStore('vendor', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const vendorList = ref<IVendorContent>()

  const getVendors = async (params: unknown) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVendorContent> = await vendorAPI.get(
        '/public/verifiedvendor/approval/vendor-list',
        { params },
      )
      vendorList.value = response.data.result.content
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

  return { vendorList, loading, error, getVendors }
})
