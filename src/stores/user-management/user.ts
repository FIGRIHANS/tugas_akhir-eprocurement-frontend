import { defineStore } from 'pinia'
import type { IUser } from './types/user'
import { ref } from 'vue'
import type { ApiResponse } from '@/core/type/api'
import userApi from '@/core/utils/userApi'

interface UserData {
  items: IUser[]
  total: number
  page: number
  pageSize: number
}

export const useUserStore = defineStore('userStore', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = ref<UserData>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  })

  const userDetail = ref(null)
  const userInformation = ref(null)
  const userUserName = ref(null)

  const getAllUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<IUser[]> = await userApi.get('/user/getall')

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'An unknown error occurred.'
        return
      }

      if (response.data.result.content && Array.isArray(response.data.result.content)) {
        users.value = {
          items: response.data.result.content,
          total: response.data.result.content.length,
          page: 1,
          pageSize: response.data.result.content.length,
        }
      } else {
        users.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        error.value = 'API response content is malformed or missing expected array of users.'
      }
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

  const getUserInformation = async (employeeId: number) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<unknown> = await userApi.get(
        `/user/information?employeeId=${employeeId}`,
      )

      userInformation.value = response?.data?.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const getUserNameByEmployeeId = async (employeeId: number) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<unknown> = await userApi.get(
        `/user/username-by-employeeid?employeeId=${employeeId}`,
      )

      userUserName.value = response?.data?.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const getUserDetail = async (userName: string) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<unknown> = await userApi.get(`/user?userName=${userName}`)

      userDetail.value = response?.data?.result?.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const storeUserData = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<unknown> = await userApi.post('/auth', {
        ...body,
      })

      if (response.data.result.isError) {
        error.value = response.data.result.message || 'Failed to post data due to an API error.'
        throw new Error(error.value)
      }

      return response.data.result
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Failed to post data'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    userDetail,
    userInformation,

    getAllUsers,
    getUserInformation,
    getUserNameByEmployeeId,
    getUserDetail,
    storeUserData,
  }
})
