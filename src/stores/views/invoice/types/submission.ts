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
  alternativePayee: itemsAlternativePayee[]
  costExpense: ParamsSubmissionCostExpense[]
  isSaveAsDraft: boolean
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
  sapInvoiceNo?: string
  clearingDocumentNo?: string
  invoiceDate: string
  taxNo: string
  currCode: string
  notes: string
  statusCode: number
  statusName: string
  creditCardBillingId: string
  department?: string
  remainingDPAmount: number
  dpAmountDeduction: number
  cashJournalCode?: string
  cashJournalName?: string
  npwpReporting?: string
  pettyCashStartDate?: string
  pettyCashEndDate?: string
  proposalAmount?: string
  casNoCode?: string
  casNoName?: string
  dueDateCas?: string
  casDateReceipt?: string
  picFinance?: string
  npwpReportingName?: string
  invoicingParty?: string
  assigment?: string
  transferNews?: string
  invoiceSourceName?: string
}

interface ParamsSubmissionVendor {
  vendorId: number
  vendorName: string
  vendorAddress: string
  npwp: string
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

interface ParamsSubmissionItem {
  id: number
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
  uom: string
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
  itemAmount: number
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
  estimatedPaymentDate: string
  totalGrossAmount: number
  totalNetAmount: number
  vendorName: string
  pOs: PoChildTypes[]
  isOpenChild: boolean
  createdUtcDate: string
  actionerDate?: string
  invoiceSourceName: string
  // FTP Invoice Integration verification status columns
  fpStatus?: boolean
  vatStatus?: boolean
  whtStatus?: boolean
  poPrice?: boolean

  emailSender?: string
}

export interface ListNonPoTypes {
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
  estimatedPaymentDate: string
  totalGrossAmount: number
  totalNetAmount: number
  vendorName: string
  pOs: PoChildTypes[]
  isOpenChild: boolean
  createdUtcDate: string
  actionerDate?: string
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
  invoiceSource?: number
}

export interface ParamsSubmissionNonPo {
  header: ParamsSubmissionHeaderNonPo
  vendor: ParamsSubmissionVendor
  payment: ParamsSubmissionPayment
  documents: ParamsSubmissionDocument[]
  calculation: ParamsSubmissionCalculation
  alternativePay: ParamsSubmissionAlternativePay
  costExpenses: ParamsSubmissionCostExpense[]
  isSaveAsDraft: boolean
}

export interface ParamsSubmissionHeaderNonPo {
  invoiceUId: string
  invoiceTypeCode: number
  invoiceTypeName: string
  invoiceVendorNo: string
  companyCode: string
  companyName: string
  invoiceNo: string
  documentNo: string
  invoicingParty?: string
  assigment?: string
  transferNews?: string
  npwpReporting?: string
  invoiceDate?: string
  postingDate?: string
  estimatedPaymentDate?: string
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
  casDateReceipt?: string
  dueDateCas?: string
  proposalAmount?: number
  picFinance?: string
  cashJournalCode?: string
  cashJournalName?: string
  pettyCashStartDate?: string | null
  pettyCashEndDate?: string | null
  npwpReportingName?: string
}

interface ParamsSubmissionAlternativePay {
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
  isAlternativePayee: boolean | null
  isOneTimeVendor: boolean | null
}

export interface ParamsSubmissionCostExpense {
  id: number
  activityId: number
  activityExpenses: string
  activityName: string
  itemAmount: number
  itemText?: string
  debitCredit: string
  taxCode: string
  vatAmount: number
  costCenter: string
  profitCenter: string
  assignment: string
  whtType?: string
  whtCode?: string
  whtBaseAmount?: number
  whtAmount?: number
}

export interface ParamsCheckBudgetType {
  REQUEST: {
    HEADER_TXT: string
    COMP_CODE: string
    DOC_DATE: string
    PSTNG_DATE: string
    FISC_YEAR: number
    FIS_PERIOD: number
    DOC_TYPE: string
    REF_DOC_NO: string
    CUSTOMERCPD: ParamsCostumerTypes
    GLACCOUNT_DATA: GlaccountDatum[]
    ACCOUNT_PAYABLE: AccountPayable[]
    ACCOUNTTAX: Accounttax[]
    CURRENCYAMOUNT: Currencyamount[]
  }
}

export interface ParamsCostumerTypes {
  NAME: string
  NAME_2: string
  POSTL_CODE: string
  CITY: string
  COUNTRY: string
  STREET: string
  BANK_ACCT: string
  BANK_NO: string
  BANK_CTRY: string
  TAX_NO_1: string
  TAX_NO_3: string
  LANGU_ISO: string
  GLO_RE1_OT: string
}

export interface Accounttax {
  ITEMNO_ACC: number
  TAX_CODE: string
  TAX_RATE: number
}

export interface AccountPayable {
  ITEMNO_ACC: number
  VENDOR_NO: string
  REF_KEY_1: string
  REF_KEY_2: string
  REF_KEY_3: string
  BLINE_DATE: string
  PMNTTRMS: string
  PYMT_METH: string
  ALLOC_NMBR: string
  ITEM_TEXT: string
  TAX_CODE: string
  PAYMT_REF: string
}

export interface Currencyamount {
  ITEMNO_ACC: number
  CURRENCY: string
  AMT_DOCCUR: number
  AMT_BASE: number
}

export interface GlaccountDatum {
  ITEMNO_ACC: number
  GL_ACCOUNT: string
  ITEM_TEXT: string
  ALLOC_NMBR: string
  TAX_CODE: string
  COSTCENTER: string
  PROFIT_CTR: string
}

export interface ResponseCheckBudgetTypes {
  RESPONSE: SubResponseCheckBudgetTypes[]
}

export interface SubResponseCheckBudgetTypes {
  TYPE: string
  MESSAGE: string[]
}
