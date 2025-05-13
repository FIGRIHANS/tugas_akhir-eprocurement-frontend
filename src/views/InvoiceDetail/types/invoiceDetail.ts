import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  invoiceType: string
  vendorId: string
  businessField: string
  subBusinessField: string
  address: string

  isNotRegisteredBank?: boolean
  bankKeyId: string
  bankNameId: string
  beneficiaryName: string
  bankAccountNumber: string
  swiftCode: string
  bankAddress: string
  accountName?: string
  npwpNumber?: string
  bankNameNew?: string
  bankAccountNumberNew?: string
  bankAddressNew?: string

  // Invoice Information
  invoiceDate: string
  postingDate: string
  invoiceNo: string
  companyCode: string
  invoicingParty: string
  estimatedPaymentDate: string
  taxNumberInvoice: string
  invoiceNumberVendor: string
  paymentMethod: string
  assignment: string
  transferNews: string
  currency: string
  npwpReporting: string
  description: string
  invoiceDp: boolean
  withDp: boolean
  invoicePoGr: itemsPoGrType[]
  invoiceItem: invoiceItemTypes[]
  additionalCost: itemsCostType[]

  // verification validation
  status: number
  generalDataCheck?: boolean
  bankKeyCheck?: boolean
  invoiceHeaderDocumentCheck?: boolean
  invoiceCalculationCheck?: boolean
  invoicePoGrCheck?: boolean
  invoiceItemCheck?: boolean
  additionalCostCheck?: boolean
}