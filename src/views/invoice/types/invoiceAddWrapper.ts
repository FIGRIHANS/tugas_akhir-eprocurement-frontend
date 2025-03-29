import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  name: string
  nameError?: boolean
  vendorId: string
  vendorIdError?: boolean
  businessField: string
  businessFieldError?: boolean
  subBusinessField: string
  subBusinessFieldError?: boolean
  address: string

  isNotRegisteredBank?: boolean
  bankKeyId: string
  bankKeyIdError?: boolean
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
  invoiceNo: string
  companyCode: string
  companyCodeError?: boolean
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
  paymentDate: string
  paymentDateError?: boolean
  department: string
  departmentError?: boolean
  invoiceDp: boolean
  withDp: boolean

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
  invoiceItem: invoiceItemTypes[]

  status: number
}