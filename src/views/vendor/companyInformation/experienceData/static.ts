import type { IExperiencePayload } from '@/stores/vendor/types/experience'

export const getTableCols = (t: (key: string) => string): { key: string; label: string }[] => [
  {
    key: 'actions',
    label: '',
  },
  {
    key: 'contractName',
    label: t('experienceData.table.headers.contractName'),
  },
  {
    key: 'contractAddress',
    label: t('experienceData.table.headers.address'),
  },
  {
    key: 'institution',
    label: t('experienceData.table.headers.agency'),
  },
  {
    key: 'contractValue',
    label: t('experienceData.table.headers.contractValue'),
  },
  {
    key: 'businessSector',
    label: t('experienceData.table.headers.businessField'),
  },
  {
    key: 'subBusinessSector',
    label: t('experienceData.table.headers.subBusiness'),
  },
  {
    key: 'startDate',
    label: t('experienceData.table.headers.startDate'),
  },
  {
    key: 'endDate',
    label: t('experienceData.table.headers.endDate'),
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
  provinceLocation: 0,
  stateLocation: 0,
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
