import { defineStore } from 'pinia'
import { ref } from 'vue'
import vendorAPI from '@/core/utils/vendorApi'

type DashboardContent = {
  totalVendor: number
  totalVerified: number
  totalOnProgressVerification: number
  totalRejected: number
  totalBlacklistVendor: number
  totalVendorPKP: number
  totalVendorNonPKP: number
  totalVendorPersonal: number
  totalVendorForeign: number
  totalUnverified10D: number
  totalUnverified20D: number
  totalUnverified30D: number
  totalUnverified40D: number
  totalUnverified50D: number
}

export const useVendorDashboardStore = defineStore('vendor-dashboard', () => {
  const dashboardData = ref<DashboardContent>({
    totalVendor: 0,
    totalVerified: 0,
    totalOnProgressVerification: 0,
    totalRejected: 0,
    totalBlacklistVendor: 0,
    totalVendorPKP: 0,
    totalVendorNonPKP: 0,
    totalVendorPersonal: 0,
    totalVendorForeign: 0,
    totalUnverified10D: 0,
    totalUnverified20D: 0,
    totalUnverified30D: 0,
    totalUnverified40D: 0,
    totalUnverified50D: 0,
  })

  const fetchDashboard = async () => {
    try {
      const response = await vendorAPI.get('/dashboard')
      if (response?.data?.result?.content) {
        dashboardData.value = response.data.result.content
      }
      return response.data
    } catch (err) {
      // swallow here and let caller/logging handle
      // console.error('fetchDashboard error', err)
      throw err
    }
  }

  return { dashboardData, fetchDashboard }
})
