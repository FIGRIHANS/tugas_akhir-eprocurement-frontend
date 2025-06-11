export interface ParamsSubmissionTypes {
  header: ParamsSubmissionHeader
  vendor: ParamsSubmissionVendor
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  pogr: ParamsSubmissionItem[]
  additionalCosts: ParamsSubmissionCost[]
}

interface ParamsSubmissionHeader {
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
}

interface ParamsSubmissionVendor {
  vendorId: number
  vendorName: string
  vendorAddress: string
}

interface ParamsSubmissionPayment {
  bankKey: string
  bankName: string
  beneficiaryName: string
  bankAccountNo: string
}

interface ParamsSubmissionDocument {
  documentType: number
  documentName: string
  documentUrl: string
  documentSize: number
}

interface ParamsSubmissionCalculation {
  subtotal: number
  vatAmount: number
  whtAmount: number
  additionalCost: number
  totalGrossAmount: number
  totalNetAmount: number
}

interface ParamsSubmissionItem {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  itemAmount: number
  quantity: number
  taxCode: string
  uom: string
  itemText: string
  conditionType: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: number
  department: string
}

interface ParamsSubmissionCost {
  activityExpense: string
  itemAmount: number
  debitCredit: string
  taxCode: string
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
}

export interface PoGrItemTypes {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  taxCode: string
  itemAmount: number
  quantity: number
  uom: string
  material: string
  materialDescription: string
  currency: string
  conditionType: string
  postingDate: string
  enteredOn: string
  purchasingOrg: string
  department: string
}

export interface ListPoTypes {
  invoiceUId: string
  invoiceNo: string
  statusCode: number
  statusName: string
  poNo: string
  grDocumentNo: string
  invoiceTypeCode: number
  invoiceTypeName: string
  companyCode: string
  companyName: string
  costCenterCode: string
  costCenterName: string
  whtBaseAmount: number
  vatAmount: number
  whtAmount: number
  totalNetAmount: number
  taxNo: string
  documentNo: string
  estimatePaymentDate: string
  invoiceDate: string
  notes: string
}

export interface QueryParamsListPoTypes {
  statusCode?: number | null
  companyCode?: string | null
  invoiceTypeCode?: number | null
  invoiceDate?: string | null
  searchText?: string | null
}