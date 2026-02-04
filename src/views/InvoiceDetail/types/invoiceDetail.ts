import type { documentFormTypes } from './invoiceDocument'
import type { itemsPoGrType } from './invoicePoGr'
import type { itemsCostType } from './additionalCost'
import type { invoiceItemTypes } from './invoiceItem'
import type { itemsAlternativePayee } from '@/stores/views/invoice/types/submission'

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
  invoiceDate: string
  taxNo: string
  currCode: string
  notes: string
  statusCode: number
  statusName: string
  postingDate: string
  invoicingParty: string
  estimatedPaymentDate: string
  paymentMethodCode: string
  paymentMethodName: string
  assigment: string
  transferNews: string
  npwpReporting: string
  remainingDpAmount: number
  dpAmountDeduction: number
  creditCardBillingId: string
  paymentId: number
  bankKey: string
  bankName: string
  beneficiaryName: string
  bankAccountNo: string
  bankCountryCode: string
  department?: string
  sapInvoiceNo: string
  clearingDocumentNo: string
  casDateReceipt: string
  casNoCode: string
  proposalAmount: number
  picFinance: string
  cashJournalCode: string
  cashJournalName: string
  pettyCashStartDate: string
  pettyCashEndDate: string
  npwpReportingName: string

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
  additionalCosts: itemsCostType[]
  invoiceItem: invoiceItemTypes[]
  costExpense: invoiceItemTypes[]
  alternativePayee: itemsAlternativePayee[]
}
