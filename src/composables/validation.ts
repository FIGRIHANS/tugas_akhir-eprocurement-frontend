export const useCheckEmpty = (value: string | number | null | undefined) => {
  const valueField = value
  let status = true
  let isError = false
  if (!valueField) status = false

  if (!status) isError = true
  else isError = false

  return { status, isError }
}