export type PayloadExportPersonnelDataType = {
  contractName: string
  dateOfBirth: string
  gender: string
  address: string
  highestEducationId: string
  highestEducationName: string
  nationalityId: string
  nationalityName: string
  position: string
  employmentStatusId: string
  employmentStatusName: string
  skills: string
}

export type ErrorExportPersonnelDataType = {
  contractName: boolean
  dateOfBirth: boolean
  gender: boolean
  address: boolean
  highestEducationId: boolean
  nationalityId: boolean
  position: boolean
  employmentStatusId: boolean
  skills: boolean
}

export type FieldCvDetailsType = {
  description: string
  issuedDate: string
  expiredDate: string
  uploadUrl: string
  isEdit: boolean
}

export type CvDetailsCategory = 'experience' | 'education' | 'certificate'
