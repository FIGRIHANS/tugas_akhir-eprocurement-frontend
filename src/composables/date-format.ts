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
    .format('MMMM DD, YYYY')
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

export const formatDateYearFirst = (value: Date | string) => {
  if (!value || value === '1900-01-01T00:00:00') return '-'
  return moment(value).format('YYYY/MM/DD')
}

export const formatfilterDate = (value: Date | string) => {
  if (!value) return ''
  return moment(value).format('YYYY/MM/DD')
}
