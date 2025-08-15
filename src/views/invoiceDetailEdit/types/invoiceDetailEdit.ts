import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'

export interface formTypes extends documentFormTypes {
  invoiceUId: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceDPCode: number
  invoiceDPName: string
  companyCode: string
  companyName: string
  invoiceNo: string
  documentNo: string
  documentNoError?: boolean
  invoiceDate: string
  invoiceDateError?: boolean
  taxNo: string
  taxNoError?: boolean
  currCode: string
  currCodeError?: boolean
  notes: string
  notesError?: boolean
  statusCode: number
  statusName: string
  postingDate: string
  postingDateError?: boolean
  invoicingParty: string
  invoicingPartyError?: boolean
  estimatedPaymentDate: string
  estimatedPaymentDateError?: boolean
  paymentMethodCode: string
  paymentMethodName: string
  paymentMethodError?: boolean
  assigment: string
  assignmentError?: boolean
  transferNews: string
  transferNewsError?: boolean
  npwpReporting: string
  npwpReportingError?: boolean
  remainingDpAmount: string
  dpAmountDeduction: string
  dpAmountDeductionError?: boolean
  creditCardBillingId: string
  creditCardBillingError?: boolean
  bankKey: string
  bankKeyIdError?: boolean
  bankName: string
  beneficiaryName: string
  bankAccountNo: string
  bankCountryCode: string

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

  vendorId: string
  vendorName: string
  npwp: string
  vendorAddress: string

  subtotal: number
  vatAmount: number
  whtAmount: number
  additionalCost: number
  totalGrossAmount: number
  totalNetAmount: number

  invoicePoGr: itemsPoGrType[]
  invoicePoGrError?: boolean
  additionalCosts: itemsCostType[]
  invoiceItem: invoiceItemTypes[]
}