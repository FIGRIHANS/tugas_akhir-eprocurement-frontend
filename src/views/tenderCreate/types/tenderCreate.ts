export interface FormTypes {
  tenderId: string
  tenderStatus: string
  pic: string
  purchaseRequisitionScenario: string
  evaluationObject: string
  tenderPeriod: string
  remarks: string
  vendorList: VendorListTypes[]
  tenderStartDate: string
  tenderEndDate: string
  tenderMethod: string
  automaticCriteria: CriteriaTypes[]
  manualCriteria: CriteriaTypes[]
  automaticTimeline: BillingTimelineTypes[]
  manualTimeline: BillingTimelineTypes[]
  agreePersonInCharge: boolean
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

export interface CriteriaTypes {
  id: string
  group: string
  evaluationObject: string
  type: string
  evaluationItem: string
  itemDescription: string
  weight: string
  isEdit?: boolean
}

export interface BillingTimelineTypes {
  id: string
  group: string
  step: string
  process: string
  startDate: string
  endDate: string
  workingDays: string
  pic: string
  isEdit?: boolean
}