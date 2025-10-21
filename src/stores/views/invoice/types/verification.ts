export interface ParamsSubmissionTypes {
  header: ParamsSubmissionHeader
  vendor: ParamsSubmissionVendor
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  pogr: ParamsSubmissionItem[]
  additionalCosts: ParamsSubmissionCost[]
  workflow: ParamsSubmissionWorkflow[]
  alternativePayee: itemsAlternativePayee[]
  costExpense: ParamsSubmissionCostExpense[]
}

interface ParamsSubmissionCostExpense {
  id: number
  activityId: number
  activityExpenses: string
  activityName: string
  itemAmount: number
  itemText: string
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
  creditCardBillingID: string
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
  remainingDPAmount: number
  dpAmountDeduction: number
  creditCardBillingID: string
  department: string
}

interface ParamsSubmissionVendor {
  vendorId: string
  vendorName: string
  npwp: string
  vendorAddress: string
}

interface ParamsSubmissionPayment {
  paymentId: number
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
  id: number
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
  activityId: number
  activityExpense: string
  activityName: string
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

export interface PostEditApprovalNonPoTypes {
  statusCode: number
  statusName: string
  statusNotes: string
  header: ParamsNonPoHeaderTypes
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  costExpenses: ParamsSubmissionCostExpenseType[]
  alternativePay: ParamsAlternativePayType
}

interface ParamsNonPoHeaderTypes {
  invoiceUId: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceVendorNo: string
  companyCode: string
  companyName: string
  invoiceNo: string
  documentNo: string
  invoicingParty: string
  assigment: string
  transferNews: string
  npwpReporting: string
  invoiceDate: string
  postingDate: string
  estimatedPaymentDate: string
  paymentMethodCode: string
  paymentMethodName: string
  taxNo: string
  currCode: string
  creditCardBillingID: string
  notes: string
  statusCode: number
  statusName: string
  department: string
  profileId: string
}
export interface ParamsSubmissionCostExpenseType {
  id: number
  activityId: number
  activityExpenses: string
  activityName: string
  itemAmount: number
  itemText: string
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
export interface ParamsAlternativePayType {
  id: number
  invoiceUId: string
  name: string
  name2: string
  street: string
  city: string
  country: string
  bankAccountNumber: string
  bankKey: string
  bankCountry: string
  npwp: string
  ktp: string
  email: string
  isAlternativePayee: boolean
  isOneTimeVendor: boolean
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
  vendorName: string
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
  vendorName: string
  department: string
  actionerDate?: string
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
  id: number
}

export interface itemsCostType {
  id: number
  activityId: number
  activityExpense: string
  activityName: string
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

export interface itemsCostExpenseType {
  id: number
  activityId: number
  activityExpenses: string
  activityName: string
  itemAmount: number
  itemText: string
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
  department: string
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

  idAlternative: number
  name: string
  name2: string
  street: string
  city: string
  country: string
  bankAccountNumber: string
  bankKeyAlternative: string
  bankCountry: string
  npwpAlternative: string
  ktp: string
  email: string
  isAlternativePayee: boolean
  isOneTimeVendor: boolean

  invoicePoGr: itemsPoGrType[]
  additionalCosts: itemsCostType[]
  costExpenses: itemsCostExpenseType[]

  invoiceDocument: documentDetailTypes | null
  tax: documentDetailTypes | null
  referenceDocument: documentDetailTypes | null
  otherDocument: documentDetailTypes | null
}

export interface ParamsRejectTypes {
  invoiceUId: string
  notes: string
}

export interface itemsAlternativePayee {
  id: number
  name: string
  name2: string
  street: string
  city: string
  country: string
  bankAccountNumber: string
  bankKey: string
  bankCountry: string
  npwp: string
  ktp: string
  email: string
  isAlternativePayee: boolean
  isOneTimeVendor: boolean
}

export interface costExpensesType {
  id: number
  activityId: number
  activityExpenses: string
  activityName: string
  itemAmount: number
  itemText: string
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

// Approval Non Po Type
export interface CostExpenses {
  id: number | null
  activityId: number | null
  activityExpenses: string | null
  activityName: string | null
  itemAmount: number | null
  itemText: string | null
  debitCredit: string | null
  taxCode: string | null
  vatAmount: number | null
  costCenter: string | null
  profitCenter: string | null
  assignment: string | null
  whtType: string | null
  whtCode: string | null
  whtBaseAmount: number | null
  whtAmount: number | null
  isEdit: boolean
}

interface AlternativePay {
  id: number | null
  invoiceUId: string | null
  name: string | null
  name2: string | null
  street: string | null
  city: string | null
  country: string | null
  bankAccountNumber: string | null
  bankKey: string | null
  bankCountry: string | null
  npwp: string | null
  ktp: string | null
  email: string | null
  isAlternativePayee: boolean | null
  isOneTimeVendor: boolean | null
  isActive: boolean | null
  isDeleted: boolean | null
  createdBy: number | null
  createdUtcDate: string | null
  modifiedBy: number | null
  modifiedUtcDate: string | null
}

interface Calculation {
  subtotal: number | null
  vatAmount: number | null
  whtAmount: number | null
  additionalCost: number | null
  totalGrossAmount: number | null
  totalNetAmount: number | null
}

interface Document {
  id: number | null
  documentType: number | null
  documentName: string | null
  documentUrl: string | null
  documentSize: number | null
}

interface Payment {
  paymentId: number
  bankKey: string | null
  bankName: string | null
  beneficiaryName: string | null
  bankAccountNo: string | null
  bankCountryCode: string | null
}

interface Header {
  invoiceUId: string | null
  invoiceDate: string | null
  postingDate: string | null
  documentNo: string | null
  taxNo: string | null
  invoicingParty: string | null
  estimatedPaymentDate: string | null
  paymentMethodCode: string | null
  paymentMethodName: string | null
  assigment: string | null
  transferNews: string | null
  notes: string | null
  currCode: string | null
  npwpReporting: string | null
  department: string | null
}

export interface SubmissionNonPoTypes {
  statusCode: number | null
  statusName: string | null
  statusNotes: string | null
  header: Header
  payment: Payment
  documents: Document[]
  calculation: Calculation
  alternativePay: AlternativePay
  alternativePayee: AlternativePay[]
  costExpenses: CostExpenses[]
}
