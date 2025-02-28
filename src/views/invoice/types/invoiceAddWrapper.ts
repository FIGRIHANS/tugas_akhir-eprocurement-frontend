import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  companyId: string
  companyIdError?: boolean
  vendorId: string
  vendorIdError?: boolean
  billToCompany: string
  billToCompanyError?: boolean
  billToVendor: string
  billToVendorError?: boolean
  vendorTaxId: string
  vendorTaxIdError?: boolean
  address: string
  addressError?: boolean
  bankKeyId: string
  bankKeyIdError?: boolean
  bankNameId: string
  bankNameIdError?: boolean
  beneficiaryName: string
  beneficiaryNameError?: boolean
  bankAccountNumber: string
  bankAccountNumberError?: boolean
  swiftCode: string
  swiftCodeError?: boolean
  bankAddress: string
  bankAddressError?: boolean

  // Invoice Information
  invoiceNo: string
  invoiceNoError?: boolean
  taxInvoiceNumber: string
  taxInvoiceNumberError?: boolean
  taxDate: string
  taxDateError?: boolean
  taxCalculationId: string
  taxCalculationIdError?: boolean
  taxCode: string
  taxCodeError?: boolean
  whtCode: string
  whtCodeError?: boolean
  paymentTerm: string
  paymentTermError?: boolean
  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
  additionalCostError?: boolean
}