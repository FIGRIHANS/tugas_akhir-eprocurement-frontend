import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  invoiceUId: string
  invoiceType: string
  invoiceTypeError?: boolean
  invoiceTypeName: string
  vendorId: string
  vendorIdError?: boolean
  vendorName: string
  npwp: string
  address: string

  isNotRegisteredBank?: boolean
  bankKeyId: string
  bankKeyIdError?: boolean
  bankNameId: string
  beneficiaryName: string
  bankAccountNumber: string
  swiftCode: string
  bankAddress: string
  bankCountryCode: string
  accountName?: string
  npwpNumber?: string
  bankNameNew?: string
  bankAccountNumberNew?: string
  bankAddressNew?: string

  isAlternativePayee: boolean
  isOneTimeVendor: boolean
  nameAlternative: string
  nameOtherAlternative: string
  streetAltiernative: string
  cityAlternative: string
  countryAlternative: string
  bankAccountNumberAlternative: string
  bankKeyAlternative: string
  bankCountryAlternative: string
  npwpNumberAlternative: string
  ktpNumberAlternative: string
  emailAlternative: string

  // Invoice Information
  companyCode: string
  companyCodeError?: boolean
  companyName: string
  invoiceNo: string
  invoiceNoVendor: string
  invoiceNoVendorError?: boolean
  invoiceDate: string
  invoiceDateError?: boolean
  taxNumber: string
  taxNumberError?: boolean
  invoiceDp: string
  invoiceDpError?: boolean
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

  vendorNumber: string
  department: string

  //invoice calculation
  subtotal: number
  vatAmount: number
  whtAmount: number
  additionalCostCalc: number
  totalGrossAmount: number
  totalNetAmount: number

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
  additionalCostError?: boolean
  invoiceItem: invoiceItemTypes[]
  invoiceItemError?: boolean

  status: number
}
