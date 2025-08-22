export interface listTypes {
  invoiceNumber: string
  status: number,
  grNumber: string
  poNumber: string
  companyCode: string
  invoiceCategory: string
  invoiceDate: string
  vendorName: string
  totalGrossAmount: string
  totalNetAmount: string
  estimatedPaymentDate: string
}

export interface listNonPoTypes {
  invoiceNumber: string
  status: number
  poNumber: string
  grNumber: string
  companyCode: string
  invoiceDate: string
  vendorName: string
  totalGrossAmount: string
  totalNetAmount: string
  estimatedPaymentDate: string
}

export interface filterListTypes {
  status: string
  date: string
  companyCode: string
  invoiceType: string
}