export const useCheckEmpty = (value: string | number | Date | null | undefined) => {
  const valueField = value
  let status = true
  let isError = false
  if (!valueField) status = false

  if (!status) isError = true
  else isError = false

  return { status, isError }
}

export function checkEmptyValues(obj: Record<string, unknown>): string[] {
  const emptyKeys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    ) {
      emptyKeys.push(key)
    }
  }

  return emptyKeys
}
