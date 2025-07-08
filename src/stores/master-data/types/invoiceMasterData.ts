export type InvoicePoTypes = {
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
  vendorId: number
  vendorName: string
  businessFieldId: number
  businessFieldName: string
  subBusinessFieldId: number
  subBusinessFieldName: string
  npwp: string
  address: string
  payment: PaymentTypes[]
}

export type PaymentTypes = {
  bankId: number
  bankKey: string
  bankName: string
  beneficiaryName: string
  accountNumber: string
}

export type ActivityTypes = {
  code: string
  name: string
}

export type TaxCodeTypes = {
  code: string
  name: string
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