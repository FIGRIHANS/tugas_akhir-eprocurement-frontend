export interface IExperienceData {
  id: number
  vendorID: number
  contractName: string
  address: string
  agency: string
  agencyTelpNo: string
  contractNo: string
  remark: string
  documentURL: string
  contractValue: number
  field: number
  businessFieldId: number
  businessField: string
  subBusiness: string
  experienceType: number
  value: string
  startDate: string
  endDate: string
  createdBy: string
  createdDate: string
  modifiedBy: string | null
  modifiedDate: string | null
  city: number
  cityName: string
  provinceId: number
  provinceName: string
  countryId: number
  countryName: string
  isActive: boolean
  expCurrID: number
}

export interface IExperiencePayload {
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
  refVendorID: number
  remark: string
  startDate: string
  uploadDate: string
  user: string
  vendorID: number
  provinceLocation: number
}
