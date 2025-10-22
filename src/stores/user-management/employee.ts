import type { ApiResponse } from '@/core/type/api'
import userApi from '@/core/utils/userApi'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEmployeePayload } from './types/employee'

export const useEmployeeStore = defineStore('employeeStore', () => {
  // state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const employees = ref<any>([])
  const employee = ref(null)

  const loadingEmployees = ref<boolean>(false)
  const loadingEmployee = ref<boolean>(false)

  const errorEmployees = ref(null)
  const errorEmployee = ref(null)

  // getters
  // actions
  const getEmployees = async () => {
    loadingEmployees.value = true
    errorEmployees.value = null

    try {
      const response: ApiResponse<unknown> = await userApi.get(`/employee/getall`)

      if (response.data.result.isError) {
        errorEmployees.value = response.data.result.message
        return
      }

      employees.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorEmployees.value = err.message
      } else {
        errorEmployee.value = 'Something went error'
      }
    } finally {
      loadingEmployees.value = false
    }
  }

  const getEmployee = async (employeeId: string | number) => {
    loadingEmployee.value = true
    errorEmployee.value = null

    try {
      const response: ApiResponse<unknown> = await userApi.get(`/employee/${employeeId}`)

      if (response.data.result.isError) {
        errorEmployee.value = response.data.result.message
        return
      }

      employee.value = response.data.result.content
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorEmployee.value = err.message
      } else {
        errorEmployee.value = 'Something went error'
      }
    } finally {
      loadingEmployee.value = false
    }
  }

  const storeEmployee = async (payload: IEmployeePayload) => {
    console.log(payload)
    try {
      const response: ApiResponse<unknown> = await userApi.post(`/employee/post`, {
        ...payload,
      })

      return response.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorEmployee.value = err.message || 'Something went wrong'
      }
    }
  }

  return {
    employees,
    loadingEmployees,
    errorEmployees,

    employee,
    loadingEmployee,
    errorEmployee,

    getEmployees,
    getEmployee,
    storeEmployee,
  }
})
