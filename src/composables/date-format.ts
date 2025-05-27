import moment from 'moment'

// 2025-12-31
export const formatDatePayload = (value: string) => {
  if (['', null, undefined].includes(value)) {
    return value
  }
  return moment(value).format('YYYY-MM-DD')
}
