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

export interface AvailableDpTypes {
  isAvailable: boolean
  department: string
}

export interface RemainingDpTypes {
  documentNo: string
  documentDate: number
  companyCode: string
  poNumber: string
  documentType: string
  remainingDPAmount: number
}

export interface ParamsSubmissionTypes {
  header: ParamsSubmissionHeader
  vendor: ParamsSubmissionVendor
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  pogr: ParamsSubmissionItem[]
  additionalCosts: ParamsSubmissionCost[]
  workflow: ParamsSubmissionWorkflow[]
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
  creditCardBillingId: string
}

interface ParamsSubmissionVendor {
  vendorId: number
  vendorName: string
  vendorBusinessUnit: string
  vendorSubBusinessUnit: string
  npwp: string
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
  taxCode: string
  vatAmount: number
  itemAmount: number
  quantity: number
  uom: string
  itemText: string
  conditionType: string
  conditionTypeDesc: string
  qcStatus: string
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
  amount: number
}

interface ParamsSubmissionWorkflow {
  actioner: number
  actionerDate: string
  actionerName: string
  actionerNotes: string
  id: number
  profileId: number
  profileName: string
  stateCode: number
  stateName: string
  step: number
}

export interface PoGrItemTypes {
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  taxCode: string
  quantity: number
  unit: string
  itemText: string
  material: string
  materialDescription: string
  currency: string
  conditionType: string
  conditionTypeDesc: string
  qcStatus: string
  postingDate: string
  enteredOn: string
  purchasingOrg: string
  department: string
  currencyLC: string
  currencyTC: string
  itemAmountLC: number
  itemAmountTC: number
}

export interface ListPoTypes {
  invoiceUId: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceDPCode: number
  invoiceDPName: string
  companyCode: string
  companyName: string
  documentNo: string
  invoiceNo: string
  invoiceDate: string
  statusCode: number
  statusName: string
  poNo: string
  grDocumentNo: string
  estimatePaymentDate: string
  totalGrossAmount: number
  totalNetAmount: number
  vendorName: string
  pOs: PoChildTypes[]
  isOpenChild: boolean
  createdUtcDate: string
}

export interface PoChildTypes {
  grDocumentNo: string
  invoiceUId: string
  itemAmount: number
  itemText: string
  poNo: string
  quantity: number
}

export interface QueryParamsListPoTypes {
  statusCode?: number | null
  companyCode?: string | null
  invoiceTypeCode?: number | null
  invoiceDate?: string | null
  searchText?: string | null
}
