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

  /**
   * Fetches user profile(s) from the API.
   * @param body The request body, typically containing filter/pagination info or a specific profile ID.
   * Using `unknown` is flexible but consider a more specific type if possible (e.g., `{ profileId?: number, page?: number, profileName?: string }`).
   */
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

      profiles.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch user profiles.'
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
  const addProfile = async (profileName: string) => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        profileId: 0, // Assuming 0 or null signifies a new profile to the backend
        profileName: profileName,
        isActive: true, // New profiles are active by default
      }
      const response: ApiResponse<IProfile> = await userApi.post('/profile/post', payload)

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'Failed to add profile due to an API error.'
        throw new Error(error.value)
      }

      // No need to manually push if getUserProfiles is called after save
      // if (response.data.result.content) {
      //   profiles.value.items.push(response.data.result.content)
      //   profiles.value.total += 1
      // }

      return response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to add profile.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * "Deletes" a profile by setting its isActive status to false.
   * @param profileId The ID of the profile to deactivate.
   */
  const deleteProfile = async (profileId: number) => {
    loading.value = true
    error.value = null

    try {
      // Find the profile to get its current name for the payload
      const profileToUpdate = profiles.value.items.find((p) => p.profileId === profileId)

      if (!profileToUpdate) {
        throw new Error('Profile not found for deletion.')
      }

      const payload = {
        profileId: profileId,
        profileName: profileToUpdate.profileName, // Send current name along
        isActive: false, // Set isActive to false for "deletion"
      }
      const response: ApiResponse<IProfile> = await userApi.post('/profile/post', payload) // Assuming same endpoint for update

      if (response.data.result.isError) {
        error.value =
          response.data.result.message || 'Failed to delete profile due to an API error.'
        throw new Error(error.value)
      }

      // Update the local state to reflect the change without refetching all,
      // though a full refetch (as done in component) is also fine.
      const index = profiles.value.items.findIndex((p) => p.profileId === profileId)
      if (index !== -1) {
        profiles.value.items[index].isActive = false
      }

      return response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to delete profile.'
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

    getUserProfiles,
    addProfile,
    deleteProfile,
  }
})
