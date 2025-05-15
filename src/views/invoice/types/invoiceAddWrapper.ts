import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  invoiceType: string
  invoiceTypeError?: boolean
  vendorId: string
  vendorIdError?: boolean
  businessField: string
  subBusinessField: string
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
  companyCode: string
  companyCodeError?: boolean
  invoiceNo: string
  invoiceNoVendor: string
  invoiceNoVendorError?: boolean
  // supplierInvoiceNumber: string
  // supplierInvoiceNumberError?: boolean
  invoiceDate: string
  invoiceDateError?: boolean
  taxNumber: string
  taxNumberError?: boolean
  // taxDate: string
  // taxDateError?: boolean
  // taxCode: string
  // taxCodeError?: boolean
  // whtCode: string
  // whtCodeError?: boolean
  // paymentDate: string
  // paymentDateError?: boolean
  // department: string
  // departmentError?: boolean
  invoiceDp: boolean
  withDp: boolean
  amountInvoice: string
  amountInvoiceError?: boolean
  taxNoInvoice: string
  taxNoInvoiceError?: boolean
  remainingDpAmount: string
  dpAmountDeduction: string
  dpAmountDeductionError?: boolean
  currency: string
  currencyError?: boolean
  description: string
  descriptionError?: boolean

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
  invoiceItem: invoiceItemTypes[]

  status: number
}