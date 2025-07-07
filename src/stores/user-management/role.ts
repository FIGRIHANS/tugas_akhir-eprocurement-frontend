import { defineStore } from 'pinia'
import { ref } from 'vue'
import userApi from '@/core/utils/userApi'
import type { ApiResponse } from '@/core/type/api'
import type { IRole } from './types/role'

interface RoleData {
  items: IRole[]
  total: number
  page: number
  pageSize: number
}

export const useUserRoleStore = defineStore('userRole', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const roles = ref<RoleData>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })

  /**
   * Fetches user profile(s) from the API.
   * @param body The request body, typically containing filter/pagination info or a specific profile ID.
   * Using `unknown` is flexible but consider a more specific type if possible (e.g., `{ roleId?: number, page?: number, roleName?: string }`).
   */
  const getUserRoles = async (
    body: { roleId?: number; roleName?: string; page?: number } = {},
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<RoleData> = await userApi.post('/role', body)

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      profiles.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to fetch user roles.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Adds a new profile to the system.
   * @param roleName The name of the new profile to add.
   */
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
    loading,
    error,
    profiles,

    getUserRoles,
    postUserRole,
  }
})
