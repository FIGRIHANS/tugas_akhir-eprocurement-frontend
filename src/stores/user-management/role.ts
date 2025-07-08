import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/core/utils/userApi'
import type { ApiResponse } from '@/core/type/api'
import type { IRole } from './types/role'

interface ProfileData {
  items: IRole[]
  total: number
  page: number
  pageSize: number
}

export const useUserRoleStore = defineStore('userRole', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const roles = ref<ProfileData>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })

  const getAllUserRoles = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IRole[]> = await userApi.post('/role/getall') // Ubah ApiResponse type

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      if (response.data.result.content && Array.isArray(response.data.result.content)) {
        roles.value = {
          items: response.data.result.content,
          total: response.data.result.content.length,
          page: 1,
          pageSize: response.data.result.content.length,
        }
      } else {
        roles.value = {
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
      roles.value = {
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

  const getUserRole= async (
    body: { profileId?: number; profileName?: string; page?: number } = {},
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IRole[]> = await userApi.post('/role', body)

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      if (response.data.result.content && Array.isArray(response.data.result.content)) {
        roles.value = {
          items: response.data.result.content,
          total: response.data.result.content.length,
          page: body.page || 1,
          pageSize: response.data.result.content.length,
        }
      } else {
        roles.value = {
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
      roles.value = {
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

  const postUserRole = async (body: {
    roleId: number
    roleName: string
    isActive: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IRole> = await userApi.post('/role/post', body)

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
    roles,
    loading,
    error,

    getAllUserRoles,
    getUserRole,
    postUserRole,
  }
})
