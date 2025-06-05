import moment from 'moment'

// 2025-12-31
export const formatDatePayload = (value: Date | string) => {
  if (value === null || value === undefined || value === '') {
    return value
  }
  return moment(value).format('YYYY-MM-DD')
}
