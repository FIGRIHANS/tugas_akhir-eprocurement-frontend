export interface IExperienceData {
  id: number
  vendorID: number
  contractName: string
  address: string
  agency: string
  contractValue: number
  field: number
  businessFieldName: string
  experienceType: number
  value: string
  startDate: string
  endDate: string
  createdBy: string
  createdDate: string
  modifiedBy: string | null
  modifiedDate: string | null
  isActive: boolean
}

export interface IExperiencePayload {
  action: number
  address: string
  agency: string
  agencyTelpNo: string
  contractName: string
  contractNo: string
  contractValue: number
  documentURL: string
  endDate: string
  expCurrID: number
  experienceType: number
  field: number
  fieldType: number
  id: number
  isActive: boolean
  isTemporary: boolean
  location: number
  provinceLocation: number
  refVendorID: number
  remark: string
  startDate: string
  stateLocation: number
  uploadDate: string
  user: string
  vendorID: number
}
