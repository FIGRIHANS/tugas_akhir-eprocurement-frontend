import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/core/utils/userApi'
import type { ApiResponse, PaginatedContent } from '@/core/type/api'
import type { IProfile } from './types/profile'

interface ProfileData {
  items: IProfile[]
  total: number
  page: number
  pageSize: number
  searchText?: string
}

export const useUserProfileStore = defineStore('userProfile', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const profiles = ref<ProfileData>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    searchText: '',
  })

  const getAllUserProfiles = async (body: {
    page: number
    pageSize?: number
    searchText: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<PaginatedContent<IProfile>> = await userApi.get(
        '/profile/getall',
        {
          params: {
            page: body.page,
            pageSize: body.pageSize ?? profiles.value.pageSize,
            searchText: body.searchText,
          },
        },
      )

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      if (response.data.result.content.items && Array.isArray(response.data.result.content.items)) {
        profiles.value = {
          items: response.data.result.content.items,
          total: response.data.result.content.total,
          page: response.data.result.content.page,
          pageSize: response.data.result.content.pageSize,
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
    body: { profileId?: number; profileName?: string; page?: number; pageSize?: number } = {},
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<PaginatedContent<IProfile>> = await userApi.post('/profile', {
        page: body.page ?? profiles.value.page,
        pageSize: body.pageSize ?? profiles.value.pageSize,
        profileId: body.profileId,
        profileName: body.profileName?.trim(),
      })

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      const c = response.data.result.content
      profiles.value = {
        items: c.items,
        total: c.total,
        page: c.page,
        pageSize: c.pageSize,
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
        page: 1,
        pageSize: profiles.value.pageSize,
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

  const changePage = (page: number) => {
    profiles.value.page = page
    getAllUserProfiles({
      page,
      pageSize: profiles.value.pageSize,
      searchText: '',
    })
  }

  return {
    profiles,
    loading,
    error,

    getAllUserProfiles,
    getUserProfiles,
    postUserProfile,

    changePage,
  }
})
