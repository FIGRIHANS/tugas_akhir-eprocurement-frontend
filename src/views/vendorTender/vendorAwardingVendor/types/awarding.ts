export interface AwardingGeneralData {
  tenderReqId: string
  tenderStatus: string
  prCategory: string
  evaluationObject: string
  tenderStartDate: string
  tenderEndDate: string
  awardingDate?: string
  awardingStatus?: string
}

export interface AwardingOrganization {
  plant: string
  companyCode: string
  method: string
  picTender: string
  awardingPic?: string
}

export interface AwardingDocuments {
  technicalProposal: string
  commercialProposal: string
  otherDocument: string
  awardingDocument?: string
  contractDocument?: string
}

export interface AwardingTenderItem {
  id: number
  tenderRequestNumber: string
  type: string
  deliveryDate: string
  plant: string
  materialGroup: string
  itemNo: string
  tenderPrice: string
  material: string
  materialDesc: string
  quantity: string
  buttonPrice: string
  uom: string
  vendorName?: string
  vendorCode?: string
  finalPrice?: string
  isAwarded?: boolean
  awardingReason?: string
}

export interface VendorAwardingInfo {
  vendorCode: string
  vendorName: string
  totalValue: string
  itemCount: number
  contactPerson: string
  email: string
  phone: string
}

export interface AwardingComparison {
  itemId: number
  material: string
  materialDesc: string
  quantity: string
  uom: string
  vendors: {
    vendorCode: string
    vendorName: string
    offeredPrice: string
    finalPrice: string
    isSelected: boolean
  }[]
}

export interface AwardingStep {
  stepNumber: number
  stepName: string
  isCompleted: boolean
  isActive: boolean
  completedDate?: string
}
