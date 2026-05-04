import invoiceApi from '@/core/utils/invoiceApi'

export interface VendorNotificationApiItem {
  id: number
  type: string
  title: string
  message: string
  targetVendorId?: number
  targetVendorCode?: string
  isRead: boolean
  relatedId?: string
  createdUtcDate: string
}

export const NotificationService = {
  /**
   * Fetch persisted notifications for a vendor from the backend.
   * vendorId matches JWT UserId claim for vendor accounts.
   */
  async getVendorNotifications(
    vendorId?: number,
    vendorCode?: string,
  ): Promise<VendorNotificationApiItem[]> {
    try {
      const params: Record<string, unknown> = {}
      if (vendorId) params.vendorId = vendorId
      if (vendorCode) params.vendorCode = vendorCode
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
