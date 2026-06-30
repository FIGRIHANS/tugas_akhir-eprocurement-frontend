import moment from 'moment'
import momentTz from 'moment-timezone'
// 2025-12-31
export const formatDatePayload = (value: Date | string) => {
  if (value === null || value === undefined || value === '') {
    return value
  }
  return moment(value).format('YYYY-MM-DD')
}

export const formatDate = (value: string) => {
  if (!value) return '-'
  return momentTz(value + 'Z')
    .tz('Asia/Jakarta')
    .format('DD/MM/YYYY')
}

export const formatDateTime = (value: string) => {
  if (!value) return '-'
  return momentTz(value + 'Z')
    .tz('Asia/Jakarta')
    .format('MMMM DD, YYYY HH:mm:ss')
}

// 2025
export const formatDateYear = (value: Date | string) => {
  if (value === null || value === undefined || value === '') {
    return value
  }
  return moment(value).format('YYYY')
}

const appendUtcSuffix = (value: string): string => {
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return value
  return `${value}Z`
}

export const formatDateTimeYearFirst = (value: string) => {
  if (!value || value === '1900-01-01T00:00:00') return '-'
  return momentTz(appendUtcSuffix(value)).tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss')
}

export const formatDateYearFirst = (value: Date | string) => {
  if (!value || value === '1900-01-01T00:00:00') return '-'
  return moment(value).format('YYYY/MM/DD')
}

export const formatfilterDate = (value: Date | string) => {
  if (!value) return ''
  return moment(value).format('YYYY/MM/DD')
}
