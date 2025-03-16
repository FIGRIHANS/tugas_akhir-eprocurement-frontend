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
  supplierInvoiceNumber: string
  invoiceDate: string
  taxNumber: string
  taxDate: string
  taxCode: string
  whtCode: string
  paymentDate: string
  invoiceDp: boolean
  withDp: boolean
  invoicePoGr: itemsPoGrType[]
  additionalCost: itemsCostType[]

  // verification validation
  status: number
  generalDataCheck?: boolean
  bankKeyCheck?: boolean
  invoiceHeaderDocumentCheck?: boolean
  invoiceCalculationCheck?: boolean
  invoicePoGrCheck?: boolean
  additionalCostCheck?: boolean
}