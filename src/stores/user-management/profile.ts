import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/core/utils/userApi'
import type { ApiResponse } from '@/core/type/api'
import type { IProfile } from './types/profile'

interface ProfileData {
  items: IProfile[]
  total: number
  page: number
  pageSize: number
}

export const useUserProfileStore = defineStore('userProfile', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const profiles = ref<ProfileData>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })

  const getAllUserProfiles = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IProfile[]> = await userApi.post('/profile/getall')

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      if (response.data.result.content && Array.isArray(response.data.result.content)) {
        profiles.value = {
          items: response.data.result.content,
          total: response.data.result.content.length,
          page: 1,
          pageSize: response.data.result.content.length,
        }
      } else {
        profiles.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        error.value = 'API response content is malformed or missing expected array of profiles.'
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch all user profiles.'
      }
      profiles.value = {
        items: [],
        total: 0,
        page: 0,
        pageSize: 0,
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserProfiles = async (
    body: { profileId?: number; profileName?: string; page?: number } = {},
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IProfile[]> = await userApi.post('/profile', body) // Ubah ApiResponse type

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      // Periksa apakah content adalah array, lalu bentuk objek ProfileData
      if (response.data.result.content && Array.isArray(response.data.result.content)) {
        profiles.value = {
          items: response.data.result.content,
          total: response.data.result.content.length,
          page: body.page || 1, // Gunakan page dari body request jika ada, default ke 1
          pageSize: response.data.result.content.length, // Atau sesuai ukuran halaman yang Anda inginkan
        }
      } else {
        profiles.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        error.value = 'API response content is malformed or missing expected array of profiles.'
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch user profiles.'
      }
      profiles.value = {
        items: [],
        total: 0,
        page: 0,
        pageSize: 0,
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const postUserProfile = async (body: {
    profileId: number
    profileName: string
    isActive: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IProfile> = await userApi.post('/profile/post', body)

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'Failed to post profile due to an API error.'
        throw new Error(error.value)
      }

      return response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to post profile.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profiles,
    loading,
    error,

    getAllUserProfiles,
    getUserProfiles,
    postUserProfile,
  }
})
