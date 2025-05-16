import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IBusinessFields } from './types/businessField'
import type { ApiResponse } from '@/core/type/api'
import vendorAPI from '@/core/utils/vendorApi'

export const useBusinessFieldStore = defineStore('businessField', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const businessFields = ref<IBusinessFields[]>([])

  const getBusinessFields = async () => {
    loading.value = true
    try {
      const response: ApiResponse<IBusinessFields[]> = await vendorAPI.get(
        '/public/vendor/registration/business-field',
      )

      if (response.data.statusCode === 200) {
        businessFields.value = response.data.result.content
      } else {
        error.value = response.data.title
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, businessFields, getBusinessFields }
})
