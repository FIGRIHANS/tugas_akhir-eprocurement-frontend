import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'

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
  invoiceDp: string
  invoicePoGr: itemsPoGrType[]
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