import { defineStore } from 'pinia'
interface IUser {
  id: number;
  userName: string;
  employeeName: string;
  employeeId: number;
  profileId: number;
  lastLoginDate?: string;
}

interface IUserInformation {
  employeeId: number;
  employeeName: string;
  email: string;
  position?: string;
  departmentName?: string;
}

interface IUserDetail extends IUser {
  profile?: {
    profileId: number;
    profileName: string;
    lastLoginDate?: string;
  };
  roleAuths?: Array<{
    role?: {
      roleId: string;
      roleName: string;
    };
    auths?: Array<{
      authId: string;
      authName: string;
      authDescription?: string;
    }>;
  }>;
}

interface CreateUserRequest {
  userName: string;
  userPassword: string;
  employeeName: string;
  isActive: boolean;
  employeeId: number;
  profileId: number;
  selectedRoleIds: string[];
}
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

  const userDetail = ref<IUserDetail | null>(null)
  const userInformation = ref<IUserInformation | null>(null)
  const userUserName = ref<string | null>(null)

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
      const response: ApiResponse<IUserInformation> = await userApi.get(
        `/user/information?employeeId=${employeeId}`,
      )

      if (response?.data?.result?.content) {
        userInformation.value = response.data.result.content
      }
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
      const response: ApiResponse<string> = await userApi.get(
        `/user/username-by-employeeid?employeeId=${employeeId}`,
      )

      if (typeof response?.data?.result.content === 'string') {
        userUserName.value = response.data.result.content
      } else {
        error.value = 'Invalid username response format'
      }
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
      const response: ApiResponse<IUserDetail> = await userApi.get(`/user?userName=${userName}`)

      if (response?.data?.result?.content) {
        const content = response.data.result.content
        // API returns data nested in profile object, we need to flatten it
        if (content.profile) {
          userDetail.value = {
            id: content.profile.employeeId,
            userName: content.profile.userName,
            employeeName: content.profile.employeeName,
            employeeId: content.profile.employeeId,
            profileId: content.profile.profileId,
            lastLoginDate: content.profile.lastLoginDate,
            profile: {
              profileId: content.profile.profileId,
              profileName: content.profile.profileName,
              lastLoginDate: content.profile.lastLoginDate,
            },
            roleAuths: content.roleAuths,
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const storeUserData = async (body: CreateUserRequest) => {
    loading.value = true
    error.value = null
    try {
      const response: ApiResponse<{ success: boolean; message?: string }> = await userApi.post('/auth', {
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
