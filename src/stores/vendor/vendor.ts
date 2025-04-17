import vendorAPI from '@/core/utils/vendorAPI'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IVendorList } from './types/vendor'
import type { ApiResponse } from '@/core/type/api'

export const useVendorStore = defineStore('vendor', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const vendorList = ref<IVendorList[]>([])

  const getVendors = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IVendorList[]> = await vendorAPI.get(
        '/public/vendor/registration/getvendor',
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
