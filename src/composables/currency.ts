export const useFormatIdr = (value: string | number) => {
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value))
  return formatted
}

export const useFormatUsd = (value: string | number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value))
  return formatted
}