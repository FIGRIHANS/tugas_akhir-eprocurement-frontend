import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'

export interface formTypes extends documentFormTypes {
  // Invoice Data
  companyId: string
  vendorId: string
  businessField: string
  subBusinessField: string
  address: string
  vendorTaxId: string
  bankKeyId: string
  bankNameId: string
  beneficiaryName: string
  bankAccountNumber: string
  swiftCode: string
  bankAddress: string

  // Invoice Information
  invoiceNo: string
  taxInvoiceNumber: string
  taxDate: string
  taxCalculationId: string
  taxCode: string
  whtCode: string
  paymentTerm: string
  invoicePoGr: itemsPoGrType[]
  additionalCost: itemsCostType[]
}