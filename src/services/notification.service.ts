import invoiceApi from '@/core/utils/invoiceApi'

export interface VendorNotificationApiItem {
  id: number
  type: string
  title: string
  message: string
  targetVendorId?: number
  targetVendorCode?: string
  targetEmployeeId?: number
  targetProfileId?: number
  linkEntityType?: string
  linkEntityId?: string
  isRead: boolean
  relatedId?: string
  createdUtcDate: string
}

/** Parse API UTC datetime — backend sends UTC without Z suffix */
export const parseUtcNotificationDate = (dateStr: string): Date => {
  if (!dateStr) return new Date()
  const normalized =
    dateStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateStr) ? dateStr : `${dateStr}Z`
  return new Date(normalized)
}

export const NotificationService = {
  /**
   * Fetch persisted notifications from the backend.
   * vendorId/vendorCode for vendor accounts; employeeId for internal users (e.g. warehouse checker).
   */
  async getVendorNotifications(
    vendorId?: number,
    vendorCode?: string,
    employeeId?: number,
    profileId?: number,
  ): Promise<VendorNotificationApiItem[]> {
    try {
      const params: Record<string, unknown> = {}
      if (vendorId) params.vendorId = vendorId
      if (vendorCode) params.vendorCode = vendorCode
      if (employeeId) params.employeeId = employeeId
      if (profileId) params.profileId = profileId
      const response = await invoiceApi.get('/notification/list', { params })
      return response.data?.result?.content ?? []
    } catch (error) {
      console.error('NotificationService.getVendorNotifications error:', error)
      return []
    }
  },

  async markAsRead(backendId: number, vendorId: number): Promise<void> {
    try {
      await invoiceApi.put(`/notification/${backendId}/read`, null, { params: { vendorId } })
    } catch (error) {
      console.error('NotificationService.markAsRead error:', error)
    }
  },

  async markAllAsRead(vendorId: number): Promise<void> {
    try {
      await invoiceApi.put('/notification/read-all', null, { params: { vendorId } })
    } catch (error) {
      console.error('NotificationService.markAllAsRead error:', error)
    }
  },
}
