export interface CardGraphTypes {
  id: number
  days: number
}

export interface ReportListTypes {
  id: string
  status: string
  category: string
  evaluationObject: string
  startDate: string
  endDate: string
  plant: string
  companyCode: string
  method: string
  pic: string
}

export interface filterListTypes {
  tenderRequestId: string
  status: string
  category: string
  plant: string
}