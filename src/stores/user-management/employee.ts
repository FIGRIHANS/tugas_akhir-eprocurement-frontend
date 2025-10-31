import type { ApiResponse, PaginatedContent } from '@/core/type/api'
import userApi from '@/core/utils/userApi'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEmployeePayload, IEmployee } from './types/employee'

interface EmployeeData {
  items: IEmployee[]
  total: number
  page: number
  pageSize: number
}

export const useEmployeeStore = defineStore('employeeStore', () => {
  const employees = ref<EmployeeData>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  })

  const employee = ref(null)

  const loadingEmployees = ref<boolean>(false)
  const loadingEmployee = ref<boolean>(false)

  const errorEmployees = ref(null)
  const errorEmployee = ref(null)

  const getEmployees = async (body: { page: number; pageSize: number }) => {
    loadingEmployees.value = true
    errorEmployees.value = null

    try {
      const response: ApiResponse<PaginatedContent<IEmployee>> = await userApi.get(
        `/employee/getall`,
        {
          params: {
            page: body.page,
            pageSize: body.pageSize ?? employees.value.pageSize,
          },
        },
      )

      if (response.data.result.content.items && Array.isArray(response.data.result.content.items)) {
        employees.value = {
          items: response.data.result.content.items,
          total: response.data.result.content.total,
          page: response.data.result.content.page,
          pageSize: response.data.result.content.pageSize,
        }
      } else {
        employees.value = {
          items: [],
          total: 0,
          page: 0,
          pageSize: 0,
        }
        errorEmployees.value =
          'API response content is malformed or missing expected array of profiles.'
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorEmployees.value = err.message
      } else {
        errorEmployee.value = 'Something went error'
      }
      employee.value = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      }
    } finally {
      loadingEmployees.value = false
    }
  }

  const getEmployee = async (employeeId: string | number) => {
    loadingEmployee.value = true
    errorEmployee.value = null

    try {
      const response: ApiResponse<IEmployee> = await userApi.get(
        `/employee?EmployeeId=${employeeId}`,
      )

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

  const changePage = (page: number) => {
    employees.value.page = page
    getEmployees({
      page,
      pageSize: employees.value.pageSize,
    })
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

    changePage,
  }
})
