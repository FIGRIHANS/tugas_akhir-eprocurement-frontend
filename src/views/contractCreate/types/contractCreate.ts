import type { TableItemTypes } from './purchaseRequisitionList'

export interface FormTypes {
  tenderId: string
  tenderStatus: string
  pic: string
  purchaseRequisitionScenario: string
  evaluationObject: string
  tenderPeriod: string
  remarks: string
  lbmaPriceOz: number
  biExchangeRate: number
  requisitionList: TableItemTypes[]
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
  yearlySpanding: string
  currency: string
  existingContract: string
  isSelected: boolean
}

export interface CriteriaTypes {
  evaluationType: string
  evaluationObject: string
  evaluationItem: string
  weight: string
  description: string
  expectedSla: string
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
