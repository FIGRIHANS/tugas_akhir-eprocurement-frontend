import type { ApiResponse } from '@/core/type/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICategory } from './types/category'
import vendorAPI from '@/core/utils/vendorApi'

export const useVendorCategoryStore = defineStore('vendorCategory', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<ICategory[]>([])

  const getCategories = async () => {
    loading.value = true
    try {
      const response: ApiResponse<ICategory[]> = await vendorAPI.get(
        '/public/vendor/registration/company-category',
      )

      if (response.data.statusCode === 200) {
        categories.value = response.data.result.content
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

  return { loading, error, categories, getCategories }
})
