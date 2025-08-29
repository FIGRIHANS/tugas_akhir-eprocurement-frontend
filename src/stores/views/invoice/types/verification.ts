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

export interface PostVerificationTypes {
  statusCode: number
  statusName: string
  statusNotes: string
  header: ParamsVerificationHeaderTypes
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  pogr: ParamsVerificationItemTypes[]
  additionalCosts: ParamsSubmissionCost[]
}

interface ParamsVerificationHeaderTypes {
  invoiceUId: string
  documentNo: string
  invoiceDate: string
  taxNo: string
  currCode: string
  notes: string
  postingDate: string
  invoicingParty: string
  estimatedPaymentDate: string
  paymentMethodCode: string
  paymentMethodName: string
  assigment: string
  transferNews: string
  npwpReporting: string
  creditCardBillingId: string
}

interface ParamsVerificationItemTypes {
  id: number
  poNo: string
  poItem: number
  grDocumentNo: string
  itemAmount: number
  quantity: number
  taxCode: string
  vatAmount: number
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: number
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
  remainingDpAmount: string
  dpAmountDeduction: string
  creditCardBillingId: string
}

interface ParamsSubmissionVendor {
  vendorId: string
  vendorName: string
  npwp: string
  vendorAddress: string
}

interface ParamsSubmissionPayment {
  bankKey: string
  bankName: string
  beneficiaryName: string
  bankAccountNo: string
  bankCountryCode: string
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

interface ParamsSubmissionItem {
  id: number
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  itemAmount: number
  quantity: number
  taxCode: string
  vatAmount: number
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

export interface ParamsSubmissionCost {
  id: number
  activityExpense: string
  itemAmount: number
  debitCredit: string
  taxCode: string
  vatAmount: number
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
  whtAmount: number
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
  companyCode: string
  companyName: string
  documentNo: string
  estimatedPaymentDate: string
  invoiceDate: string
  invoiceNo: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceUId: string
  notes: string
  pOs: PoChildTypes[]
  statusCode: number
  statusName: string
  taxNo: string
  totalNetAmount: number
  vatAmount: number
  whtAmount: number
  whtBaseAmount: number
  costCenterCode: string
  costCenterName: string
  isOpenChild: boolean
}

export interface ListNonPoTypes {
  companyCode: string
  companyName: string
  documentNo: string
  estimatedPaymentDate: string
  invoiceDate: string
  invoiceNo: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceUId: string
  notes: string
  pOs: PoChildTypes[]
  statusCode: number
  statusName: string
  taxNo: string
  totalNetAmount: number
  vatAmount: number
  whtAmount: number
  whtBaseAmount: number
  costCenterCode: string
  costCenterName: string
  isOpenChild: boolean
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

export interface QueryParamsListNoPoTypes {
  statusCode?: number | null
  companyCode?: string | null
  invoiceTypeCode?: number | null
  invoiceDate?: string | null
  searchText?: string | null
}


export interface documentDetailTypes {
  documentType: number
  documentName: string
  documentUrl: string
  documentSize: number
}

export interface itemsCostType {
  id: number
  activityExpense: string
  itemAmount: number
  debitCredit: string
  taxCode: string
  vatAmount: number
  costCenter: string
  profitCenter: string
  assignment: string
  whtType: string
  whtCode: string
  whtBaseAmount: number
}

export interface itemsPoGrType {
  id: number
  poNo: string
  poItem: number
  grDocumentNo: string
  grDocumentItem: number
  grDocumentDate: string
  itemAmount: number
  quantity: number
  taxCode: string
  vatAmount: number
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

export interface DetailInvoiceEditTypes {
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
  remainingDpAmount: string
  dpAmountDeduction: string
  creditCardBillingId: string
  bankKey: string
  bankName: string
  beneficiaryName: string
  bankAccountNo: string
  bankCountryCode: string

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

  invoiceDocument: documentDetailTypes | null
  tax: documentDetailTypes | null
  referenceDocument: documentDetailTypes | null
  otherDocument: documentDetailTypes | null
}

export interface ParamsRejectTypes {
  invoiceUId: string
  notes: string
}
