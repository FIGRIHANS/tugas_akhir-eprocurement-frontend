export type InvoicePoTypes = {
  code: string
  name: string
}

export type InvoiceNonPoTypes = {
  code: string
  name: string
}

export type CurrencyTypes = {
  code: string
  name: string
}

export type CompanyCodeTypes = {
  code: string
  name: string
}

export type DpTypes = {
  code: string
  name: string
}

export type DocumentTypes = {
  code: string
  name: string
}

export type VendorTypes = {
  vendorId: string
  vendorCode: string
  vendorName: string
  businessFieldId: number
  businessFieldName: string
  subBusinessFieldId: number
  subBusinessFieldName: string
  npwp: string
  address: string
  sapCode: string
  payment: PaymentTypes[]
}

export type PaymentTypes = {
  bankId: number
  bankKey: string
  bankName: string
  beneficiaryName: string
  accountNumber: string
  bankCountryCode: string
}

export type ActivityTypes = {
  id: number
  code: string
  name: string
}

export type TaxCodeTypes = {
  code: string
  name: string
  value: number
}

export type PaymentMethodTypes = {
  code: string
  name: string
}

export type ProfitCenterTypes = {
  code: string
  name: string
}

export type WhtTypes = {
  code: string
  name: string
}

export type WhtCodeTypes = {
  whtCode: string
  description: string
  tarif: number
  wTaxFormula: string
  isNPWP: boolean
}

export type CostCenterTypes = {
  code: string
  name: string
}

export type MatrixApprovalTypes = {
  companyCode: string
  id: number
  invoiceTypeCode: string
  invoiceTypeName: string
  workflowCode: string
  workflowDescription: string
}

export type NpwpReportingTypes = {
  id: number
  companyCodeName: string
  npwpLocation: string
  npwpDescription: string
}

export type CasNoTypes = {
  documentNo: string
  documentYear: number
  companyCode: string
  casNo: string
  vendorNo: string
  amount: number
}

export type CashJournalTypes = {
  id: number
  companyCodeName: string
  cashJournalNo: string
  cashJournalName: string
}

export type BankAlternativeTypes = {
  id: number
  bankCountryCode: string
  bankKey: string
  bankNameAccount: string
  street: string
  swiftCode: string
  addressNumber: string
  bankBranch: string
  isActive: boolean
  createdBy: string
  createdUtcDate: string
  updatedBy: string
  updatedUtcDate: string
}