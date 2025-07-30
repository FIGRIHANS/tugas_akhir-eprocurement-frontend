export interface FormTypes {
  tenderId: string
  tenderStatus: string
  pic: string
  purchaseRequisitionScenario: string
  evaluationObject: string
  tenderPeriod: string
  remarks: string
  vendorList: VendorListTypes[]
  tenderIdError?: boolean
  tenderStatusError?: boolean
  picError?: boolean
  purchaseRequisitionScenarioError?: boolean
  evaluationObjectError?: boolean
  tenderPeriodError?: boolean
  remarksError?: boolean
}

export interface VendorListTypes {
  id: string
  status: string
  vendorCode: string
  rank: string
  vendorName: string
  totalScore: string
  productQuality: string
  leadTimeSupply: string
  afterSalesWarranty: string
  orderAbsorption: string
  totalPo: string
  isSelected: boolean
}