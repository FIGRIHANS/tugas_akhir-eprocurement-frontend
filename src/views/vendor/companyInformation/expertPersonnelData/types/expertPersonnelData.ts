export type CertificateType = {
  id: number
  vendorExpertId: number
  description: string
  docUrl: string
  type: number
  isActive: boolean
  startDate: string
  endDate: string
}

export type PayloadExportPersonnelDataType = {
  id: number
  vendorID: number
  name: string
  education: string
  dateOfBirth: string
  gender: string
  address: string
  nationality: number
  position: string
  email: string
  status: number
  expertise: string
  yearOfExperience: number
  user: string
  isActive: boolean
  isTemporary: boolean
  refVendorID: number
  action: number
  certificates: CertificateType[]
}

export type ErrorExportPersonnelDataType = {
  id: boolean
  vendorID: boolean
  name: boolean
  education: boolean
  dateOfBirth: boolean
  gender: boolean
  address: boolean
  nationality: boolean
  position: boolean
  email: boolean
  status: boolean
  expertise: boolean
  yearOfExperience: boolean
  user: boolean
  isActive: boolean
  isTemporary: boolean
  refVendorID: boolean
  action: boolean
}

export type FieldCvDetailsType = {
  description: string
  issuedDate: string
  expiredDate: string
  uploadUrl: string
  isEdit: boolean
}

export type CvDetailsCategory = 'experience' | 'education' | 'certificate'
