export interface defaultTypes {
  id: number | string,
  name: string
}

export interface ContractReferenceTypes {
  contractRequestId: string
  contractStatus: string
  sapOutlineAgreement: string
  documentType: string
  agreementType: string
  startDate: string
  endDate: string
  totalAmount: number
  currency: string
  companyCode: string
  costType: string
  isSelected?: boolean
}

export interface TenderIdReferenceTypes {
  tenderRequestId: string
  tenderStatus: string
  purchaseRequisitionCategory: string
  evaluationObject: string
  startDate: string
  endDate: string
  plant: string
  companyCode: string
  method: string
  picTender: string
  isSelected?: boolean
}