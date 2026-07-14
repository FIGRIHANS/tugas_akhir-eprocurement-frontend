import invoiceApi from '@/core/utils/invoiceApi'
import { parsePaginatedListResponse } from '@/core/utils/paginatedResponse'

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
  vendorID?: number | string
  vendorName?: string
  estimatedArrival: string
  shippingDate?: string // Backend sends this in detail response
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
  vendorDeliveryDocumentPath?: string // Path/URL to vendor delivery document attachment
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
  vendorID?: string
  vendorName?: string
  vendorCode?: string
  transporter?: string
  driverName?: string
  status?: string
  estimatedArrivalFrom?: string
  estimatedArrivalTo?: string
  page?: number
  pageSize?: number
}

export interface DeliveryNotesListResult {
  items: DeliveryNotesData[]
  total: number
  page: number
  pageSize: number
  onDelivery: number
  received: number
  partialReceived: number
  completed: number
}

// Interface untuk Mock SAP PO Item
export interface MockSapPoItem {
  id: number
  poNumber: string
  sku: string
  itemName: string
  uom: string
  qtyOrdered: number
}

// Interface untuk Mock SAP PO Data
export interface MockSapPoData {
  poNumber: string
  vendorCode: string
  vendorID?: string
  vendorName: string
  poDate: string
  totalAmount: number | null
  createdBy: string
  updatedBy: string
  createdUtcDate: string
  updatedUtcDate: string
  items: MockSapPoItem[]
}

// Interface untuk Create Delivery Note Payload
export interface DeliveryNoteCreatePayload {
  deliveryNoteNumber: string
  poNumber: string
  vendorCode: string
  vendorID?: number
  vendorName: string
  tripID?: string
  transporter: string
  licensePlate: string
  driverName: string
  pickupAddress: string
  destinationAddress: string
  driverSignature: string
  truckType?: string
  shippingDate: string
  status: string
  vendorDeliveryDocumentPath?: string // Base64 or path of vendor delivery document
  details: Array<{
    sku: string
    description: string
    uom: string
    lotNo: string
    qtyShipped: number
  }>
}

const DeliveryNotesService = {
  async getList(params?: DeliveryNotesQueryParams): Promise<DeliveryNotesListResult> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesListResult>>(
        '/delivery-notes/list',
        {
          params: params,
        },
      )

      const content = response.data?.result?.content
      const parsed = parsePaginatedListResponse<DeliveryNotesData>(
        content,
        params?.page ?? 1,
        params?.pageSize ?? 10,
      )

      const statsSource =
        content && typeof content === 'object' && !Array.isArray(content)
          ? (content as Record<string, unknown>)
          : {}

      const readStat = (key: string) => {
        const value = statsSource[key]
        return typeof value === 'number' ? value : Number(value) || 0
      }

      return {
        items: parsed.items.map((item) => ({
          ...item,
          estimatedArrival: item.estimatedArrival || item.shippingDate || '',
        })),
        total: parsed.total,
        page: parsed.page,
        pageSize: parsed.pageSize,
        onDelivery: readStat('onDelivery'),
        received: readStat('received'),
        partialReceived: readStat('partialReceived'),
        completed: readStat('completed'),
      }
    } catch (error) {
      console.error('Error fetching delivery notes list:', error)
      throw error
    }
  },

  /**
   * Get delivery notes by PO Number for creating Receiving Confirmation
   * @param deliveryNoteNumber - Delivery Note Number to search
   */
  async getByDeliveryNoteNumber(deliveryNoteNumber: string): Promise<DeliveryNotesData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesData>>(
        '/delivery-notes/detail/delivery-note-number',
        {
          params: { deliveryNoteNumber },
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching delivery notes by Delivery Note Number:', error)
      throw error
    }
  },

  /**
   * Get detail of a delivery note by ID
   * Endpoint: api/delivery-notes/{id}
   */
  async getDetail(id: number): Promise<DeliveryNotesData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<DeliveryNotesData>>(
        `/delivery-notes/detail`,
        {
          params: { id },
        },
      )

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching delivery notes detail:', error)
      throw error
    }
  },

  /**
   * Search PO from Mock SAP by PO Number
   * Endpoint: api/mock-sap/detail
   * Returns single PO object or null if not found
   */
  async searchPoFromSap(poNumber?: string): Promise<MockSapPoData | null> {
    try {
      const response = await invoiceApi.get<ApiResponse<MockSapPoData>>('/mock-sap/detail', {
        params: poNumber ? { poNumber } : {},
      })

      if (response.data?.result?.content) {
        return response.data.result.content
      }

      return null
    } catch (error) {
      console.error('Error fetching PO from Mock SAP:', error)
      throw error
    }
  },

  /**
   * Create new delivery note
   * Endpoint: api/delivery-notes/create
   */
  async create(payload: DeliveryNoteCreatePayload): Promise<any> {
    try {
      const response = await invoiceApi.post<ApiResponse<any>>('/delivery-notes/create', payload)

      if (response.data?.result) {
        return response.data.result
      }

      return response.data
    } catch (error) {
      console.error('Error creating delivery note:', error)
      throw error
    }
  },

  async update(id: number, payload: DeliveryNoteCreatePayload): Promise<any> {
    try {
      const response = await invoiceApi.put<ApiResponse<any>>('/delivery-notes/update', payload, {
        params: { id },
      })

      if (response.data?.result) {
        return response.data.result
      }

      return response.data
    } catch (error) {
      console.error('Error updating delivery note:', error)
      throw error
    }
  },
}

export default DeliveryNotesService
