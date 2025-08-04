import type { IExperiencePayload } from '@/stores/vendor/types/experience'

export const tableCols: { key: string; label: string }[] = [
  {
    key: 'actions',
    label: '',
  },
  {
    key: 'contractName',
    label: 'Contract Name',
  },
  {
    key: 'contractAddress',
    label: 'Contract Address',
  },
  {
    key: 'institution',
    label: 'Institution',
  },
  {
    key: 'contractValue',
    label: 'Contract Value',
  },

  {
    key: 'businessSector',
    label: 'Business Sector',
  },
  {
    key: 'subBusinessSector',
    label: 'Sub Business Sector',
  },
  {
    key: 'startDate',
    label: 'Start Date',
  },
  {
    key: 'endDate',
    label: 'End Date',
  },
]

export const defaultFormData: IExperiencePayload = {
  address: '',
  agency: '',
  agencyTelpNo: '',
  contractName: '',
  contractNo: '',
  contractValue: 0,
  documentURL: '',
  endDate: '',
  experienceType: 3153,
  field: 0,
  fieldType: 0,
  id: 0,
  isActive: true,
  isTemporary: false,
  location: 0,
  refVendorID: 0,
  startDate: '',
  uploadDate: '',
  user: '',
  vendorID: 0,
  expCurrID: 0,
  remark: '',
}

export const excludedFields = [
  'action',
  'id',
  'isTemporary',
  'refVendorID',
  'uploadDate',
  'user',
  'fieldType',
]
