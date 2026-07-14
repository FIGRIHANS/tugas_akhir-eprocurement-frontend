export type PersistedListFilterState = {
  status?: string | number | null
  date?: string
  companyCode?: string
  invoiceType?: string
  search?: string
}

const STORAGE_PREFIX = 'invoice_list_filters:'

const storageKey = (key: string) => `${STORAGE_PREFIX}${key}`

export const loadPersistedListFilters = (key: string): PersistedListFilterState | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(key))
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedListFilterState
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export const savePersistedListFilters = (key: string, state: PersistedListFilterState): void => {
  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(state))
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export const clearPersistedListFilters = (key: string): void => {
  try {
    sessionStorage.removeItem(storageKey(key))
  } catch {
    // Ignore storage failures.
  }
}

/** Build chip list from filter form values (shared by Verification / Approval / FTP). */
export const buildFilterChips = (data: {
  status?: string | number | null
  date?: string
  companyCode?: string
  invoiceType?: string
}): { key: string; value: string | number }[] => {
  const chips: { key: string; value: string | number }[] = []

  if (data.status !== null && data.status !== undefined && data.status !== '') {
    const numericStatus = Number(data.status)
    chips.push({
      key: 'Status',
      value: Number.isFinite(numericStatus) && String(data.status).trim() !== ''
        ? numericStatus
        : (data.status as string | number),
    })
  }

  if (data.date && String(data.date).trim() !== '') {
    chips.push({ key: 'Date', value: data.date })
  }

  if (data.companyCode && String(data.companyCode).trim() !== '') {
    chips.push({ key: 'Company Code', value: data.companyCode })
  }

  if (data.invoiceType && String(data.invoiceType).trim() !== '') {
    chips.push({ key: 'Invoice Type', value: data.invoiceType })
  }

  return chips
}

export const resolveFilterStatusLabel = (
  statusOptions: Array<{ value: string | number; label: string }>,
  statusValue: string | number | null | undefined,
): string => {
  if (statusValue === null || statusValue === undefined || statusValue === '') return ''
  const match = statusOptions.find(
    (item) => Number(item.value) === Number(statusValue) || String(item.value) === String(statusValue),
  )
  return match?.label || ''
}
