export interface listTypes {
  invoiceNumber: string
  status: 1,
  grNumber: string
  poNumber: string
  invoiceCategory: string
  invoiceDate: string
  vendorName: string
  amountDue: string
}

export interface filterListTypes {
  status: string
  category: string
  date: string
}