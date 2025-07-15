import { defineStore } from "pinia";
import type { IUser } from "./types/user";
import { ref } from "vue";
import type { ApiResponse } from "@/core/type/api";
import userApi from "@/core/utils/userApi";

interface UserData {
  items: IUser[];
  total: number;
  page: number;
  pageSize: number;
}

export const useUserStore = defineStore('userStore', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const users = ref<UserData>({
    items: [],
    total: 0,
    page: 0,
    pageSize: 0,
  });

  const getAllUsers = async () => {
    loading.value = true;
    error.value = null;

    try {

      const response: ApiResponse<IUser[]> = await userApi.post('/user/getall');

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

  return {
    users,
    loading,
    error,

    getAllUsers
  }

});
