import invoiceApi from '@/core/utils/invoiceApi'

// Interface untuk Detail Item dari Delivery Notes
export interface DeliveryNotesItemData {
  sku: string
  description: string
  uom: string
  lotNo: string
  qtyShipped: number
}

// Interface untuk data Delivery Notes
export interface DeliveryNotesData {
  id: number
  deliveryNoteNumber: string
  poNumber: string
  vendorCode: string
  // vendorName?: string
  estimatedArrival: string
  pickupAddress: string
  status: string
  destinationAddress: string
  transporter: string
  truckType?: string
  licensePlate: string
  driverSignature: string
  driverName: string
  tripID?: string
  createdBy: string
  updatedBy: string
  createdUtcDate: string
  updatedUtcDate: string
  items: DeliveryNotesItemData[]
}

// Interface untuk response dari API backend
export interface ApiResponse<T> {
  title: string
  statusCode: number
  result: {
    message: string
    isError: boolean
    content: T
  }
}

// Interface untuk parameter filter/query
export interface DeliveryNotesQueryParams {
  searchText?: string
  deliveryNoteNumber?: string
  poNumber?: string
  vendorCode?: string
  transporter?: string
  driverName?: string
  status?: string
  estimatedArrivalFrom?: string
  estimatedArrivalTo?: string
}

/**
 * Service untuk mengelola API Delivery Notes
 */
const DeliveryNotesService = {
  /**
   * Get list of delivery notes
   * Endpoint: api/delivery-notes/list
   */
  async getList(params?: DeliveryNotesQueryParams): Promise<DeliveryNotesData[]> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesData[]>>(
        '/delivery-notes/list',
        {
          params: params,
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return []
    } catch (error) {
      console.error('Error fetching delivery notes list:', error)
      throw error
    }
  },

  /**
   * Get delivery notes by PO Number for creating Receiving Confirmation
   * @param poNumber - PO Number to search
   */
  async getByPoNumber(poNumber: string): Promise<DeliveryNotesData[]> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesData[]>>(
        '/delivery-notes/list',
        {
          params: { poNumber },
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return []
    } catch (error) {
      console.error('Error fetching delivery notes by PO Number:', error)
      throw error
    }
  },

  /**
   * Get detail of a delivery note by ID
   * Endpoint: api/delivery-notes/{id}
   */
  async getDetail(id: number): Promise<DeliveryNotesData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesData>>(`/delivery-notes/${id}`)

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching delivery notes detail:', error)
      throw error
    }
  },
}

export default DeliveryNotesService
