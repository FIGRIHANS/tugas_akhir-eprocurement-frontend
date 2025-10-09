import { defineStore } from 'pinia'
import generalApi from '@/core/utils/generalApi'
import { ref } from 'vue'
import type { ApiResponse } from '@/core/type/api'
import type { IDictionaryResponse } from './types/dictionary'

const dictionary = ref<IDictionaryResponse[]>([])
const locale = ref<string>(localStorage.getItem('locale') || 'en')

export const useDictionaryStore = defineStore('dictionary', () => {
  const getDictionary = async () => {
    const response: ApiResponse<IDictionaryResponse[]> = await generalApi.get(
      `/lookup/dictionary`,
      {},
    )
    dictionary.value = response.data.result.content
    return response
  }

  const setLocale = (newLocale: 'id' | 'en') => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale) // Sinkronkan juga ke localStorage
  }

  return {
    locale,
    dictionary,
    setLocale,
    getDictionary,
  }
})
