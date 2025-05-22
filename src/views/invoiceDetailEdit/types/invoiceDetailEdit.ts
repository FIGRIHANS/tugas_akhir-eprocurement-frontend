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

  bankKeyId: string
  bankNameId: string
  beneficiaryName: string
  bankAccountNumber: string
  swiftCode: string
  bankAddress: string
  nameBank: string
  postalCode: string
  street: string
  city: string
  country: string
  bankAccount: string
  bankNumber: string
  bankCountry: string
  npwpNumber: string
  ktpNumber: string
  email: string

  // Invoice Information
  invoiceDate: string
  invoiceDateError?: boolean
  postingDate: string
  postingDateError?: boolean
  invoiceNumber: string
  companyCode: string
  companyCodeError?: boolean
  invoicingParty: string
  invoicingPartyError?: boolean
  estimatedPaymentDate: string
  estimatedPaymentDateError?: boolean
  taxNumberInvoice: string
  taxNumberInvoiceError?: boolean
  invoiceNumberVendor: string
  invoiceNumberVendorError?: boolean
  paymentMethod: string
  paymentMethodError?: boolean
  assignment: string
  assignmentError?: boolean
  transferNews: string
  transferNewsError?: boolean
  currency: string
  currencyError?: boolean
  npwpReporting: string
  npwpReportingError?: boolean
  description: string
  descriptionError?: boolean
  invoiceDp: string

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCost: itemsCostType[]
  invoiceItem: invoiceItemTypes[]

  status: number
}