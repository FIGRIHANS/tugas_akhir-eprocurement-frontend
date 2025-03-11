import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  vendorId: string
  vendorIdError?: boolean
  businessField: string
  subBusinessField: string
  address: string
  bankKeyId: string
  bankKeyIdError?: boolean
  bankNameId: string
  beneficiaryName: string
  bankAccountNumber: string
  swiftCode: string
  bankAddress: string

  // Invoice Information
  invoiceNo: string
  supplierInvoiceNumber: string
  supplierInvoiceNumberError?: boolean
  invoiceDate: string
  invoiceDateError?: boolean
  taxNumber: string
  taxNumberError?: boolean
  taxDate: string
  taxDateError?: boolean
  taxCode: string
  taxCodeError?: boolean
  whtCode: string
  whtCodeError?: boolean
  paymentTerm: string
  paymentTermError?: boolean
  invoiceDp: boolean
  withDp: boolean

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
}