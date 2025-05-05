export interface listTypes {
  invoiceNumber: string
  status: number,
  grNumber: string
  poNumber: string
  invoiceCategory: string
  invoiceDate: string
  vendorName: string
  amountDue: string
}

export interface listNonPoTypes {
  invoiceNumber: string
  status: number,
  activity: string
  companyCode: string
  department: string
  invoiceDate: string
  vendorName: string
  amountDue: string
}

export interface filterListTypes {
  status: string
  category: string
  date: string
}