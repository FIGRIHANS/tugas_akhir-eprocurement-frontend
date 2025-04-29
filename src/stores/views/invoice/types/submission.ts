export interface DocumentTypes {
  id: string
  text: string
}

export interface TaxCalculationTypes {
  id: string
  text: string
}

export interface SubmissionStatusTypes {
  id: string
  text: string
}

export interface ParamsSubmissionInitiateTypes {
  invoiceUId: string
  vendorId: number
  vendorName: string
  vendorBusinessUnit: string
  vendorBusinessSubUnit: string
  vendorAddress: string
  paymentBankIsRegistered: boolean
  paymentBankKey: string
  paymentBankName: string
  paymentBeneficiaryName: string
  paymentBankAccount: string
  paymentSwiftCode: string
  paymentBankAddress: string
  statusCode: number
  statusName: string
}

export interface ParamsSubmissionTypes {
  header: ParamsSubmissionHeader
  documents: ParamsSubmissionDocument[]
  items: ParamsSubmissionItem[]
  costs: ParamsSubmissionCost[]
  statusCode: number
  statusName: string
}

interface ParamsSubmissionHeader {
  invoiceUId: string
  invoiceNo: string
  companyCode: string
  companyName: string
  supplierInvoiceNo: string
  invoiceDate: string
  invoiceTaxNo: string
  invoiceTaxDate: string
  taxCalculationId: string
  taxCalculationName: string
  taxCode: string
  taxName: string
  whtCode: string
  whtName: string
  estimatePaymentDate: string
  isInvoiceDP: boolean
  isWithDP: boolean
}

interface ParamsSubmissionDocument {
  id: number
  documentType: string
  documentName: string
  documentUrl: string
  isDeleted: boolean
}

interface ParamsSubmissionItem {
  id: number
  isWithPO: boolean
  grNo: string
  poNo: string
  sappoNo: string
  activity: string
  glAccount: string
  itemCode: string
  itemName: string
  qty: number
  uoM: string
  costPerUnit: number
  totalCost: number
  installmentTerm: number
  deliveryDate: string
  billable: number
  dpPercentage: number
  dpValue: number
  whtType: string
  whtCode: string
  dpp: number
  whtValue: number
  vat: number
  otherDPP: number
  amount: number
  isDeleted: boolean
}

interface ParamsSubmissionCost {
  id: number
  costTypeCode: string
  costTypeName: string
  gl: string
  costCenterCode: string
  costCenterName: string
  qty: number
  uoM: string
  costPerUnit: number
  totalCost: number
  pphTypeCode: string
  pphTypeName: string
  pPhCode: string
  dpp: number
  pPhAmount: number
  vat: number
  otherDPP: number
  amount: number
  remarks: string
  isDeleted: boolean
}