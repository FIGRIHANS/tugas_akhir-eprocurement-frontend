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

  // In Pinia Store (user-management/profile.ts)

  const getAllUserProfiles = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<ProfileData> = await userApi.post('/profile/getall')

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      // --- CRITICAL CHANGE HERE ---
      // Ensure content and its 'items' property exist and are of the correct type
      if (response.data.result.content) {
        profiles.value = response.data.result.content

      } else {
        // If the structure is unexpected, set profiles to a default valid state
        profiles.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        error.value = 'API response content is malformed or missing "items".'
      }
      // --- END CRITICAL CHANGE ---
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch all user profiles.'
      }
      // Set profiles to a safe, empty state on error as well
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

  // Apply similar logic to getUserProfiles if it's also fetching data that feeds into profiles.value
  const getUserProfiles = async (
    body: { profileId?: number; profileName?: string; page?: number } = {},
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<ProfileData> = await userApi.post('/profile', body)

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      // --- CRITICAL CHANGE HERE ---
      if (response.data.result.content && Array.isArray(response.data.result.content.items)) {
        profiles.value = response.data.result.content
      } else {
        profiles.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        error.value = 'API response content is malformed or missing "items".'
      }
      // --- END CRITICAL CHANGE ---
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

  /**
   * Adds a new profile to the system.
   * @param profileName The name of the new profile to add.
   */
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
    loading,
    error,
    profiles,

    getAllUserProfiles,
    getUserProfiles,
    postUserProfile,
  }
})
