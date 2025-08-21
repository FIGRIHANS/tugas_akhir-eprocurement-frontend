

export interface FormTypes {
  title: string
  contractOverview: string
  language: string
  bindingType: number | null
  supplier: string
  totalAmount: string
  commodity: string
  department: string
  agrementType: string
  agreementDate: string
  costType: string
  relationType: string
  riskAllocation: string
  effectiveDate: string
  expirationDate: string
  noticePeriod: string
  contractReference: string
  tenderIdReference: string
  titleError?: boolean
  languageError?: boolean
  bindingTypeError?: boolean
  supplierError?: boolean
  totalAmountError?: boolean
  commodityError?: boolean
  departmentError?: boolean
  agrementTypeError?: boolean
  costTypeError?: boolean
  effectiveDateError?: boolean
  noticePeriodError?: boolean
}