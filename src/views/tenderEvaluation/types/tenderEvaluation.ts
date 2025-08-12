export interface VendorListTypes {
  id: number
  vendorCode: string
  rank: number
  vendorName: string
  totalScore: number
  technicalEvaluation: number
  commercialEvaluation: number
  totalGrossAmount: number
  vendorDisc: string
  discAmout: number
  totalNettAmount: number
  remarks: string
}

export interface DetailVendorParentTypes {
  id: number
  evaluationType: string
  evaluationItem: string
  weight: string
  description: string
  expectedSla: string
  isOpenChild: boolean
  children: DetailVendorChildTypes[]
  [key: string]: string | number | boolean | DetailVendorChildTypes[]
}

export interface DetailVendorChildTypes {
  evaluationItem: string
  weight: string
  description: string
  expectedSla: string
  [key: string]: string | number
}