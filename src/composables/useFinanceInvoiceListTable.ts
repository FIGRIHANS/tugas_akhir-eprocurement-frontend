import { ref, computed, type ComputedRef, type Ref } from 'vue'
import { cloneDeep } from 'lodash'
import moment from 'moment'

export const FINANCE_LIST_UI_PAGE_SIZE = 10

export interface FinanceListTableSortOptions {
  sortFieldMap: Record<string, string>
  amountColumns?: string[]
  dateColumns?: string[]
  pageSize?: number
  /** When true, sourceList already contains only the current page rows (server/windowed pagination). */
  prePaginated?: boolean
  onPageChange?: (page: number) => void | Promise<void>
}

export function useFinanceInvoiceListTable<T extends object>(
  sourceList: ComputedRef<T[]>,
  totalItemsSource: Ref<number> | ComputedRef<number>,
  options: FinanceListTableSortOptions,
) {
  const pageSize = options.pageSize ?? FINANCE_LIST_UI_PAGE_SIZE
  const prePaginated = options.prePaginated ?? true
  const amountColumns = new Set(options.amountColumns ?? [])
  const dateColumns = new Set(options.dateColumns ?? [])

  const currentPage = ref(1)
  const sortBy = ref('')
  const sortColumnName = ref('')

  const list = computed(() => {
    const data = cloneDeep(sourceList.value)
    const name = sortColumnName.value
    const field = name ? options.sortFieldMap[name] : ''

    if (!sortBy.value || !field) {
      return prePaginated ? data : data.slice(0, pageSize)
    }

    const sorted = data.sort((a, b) => {
      if (amountColumns.has(name)) {
        const numA = Number(a[field] ?? 0)
        const numB = Number(b[field] ?? 0)
        return sortBy.value === 'asc' ? numA - numB : numB - numA
      }

      if (dateColumns.has(name)) {
        const convA = a[field] ? new Date(String(a[field])).getTime() : 0
        const convB = b[field] ? new Date(String(b[field])).getTime() : 0
        return sortBy.value === 'asc' ? convA - convB : convB - convA
      }

      const convA = a[field] != null ? String(a[field]) : ''
      const convB = b[field] != null ? String(b[field]) : ''
      return sortBy.value === 'asc' ? convA.localeCompare(convB) : convB.localeCompare(convA)
    })

    return prePaginated ? sorted : sorted.slice(0, pageSize)
  })

  const totalItems = computed(() => {
    const value = totalItemsSource.value
    const resolved = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(resolved) ? resolved : 0
  })

  const rowNumber = (index: number) => (currentPage.value - 1) * pageSize + index + 1

  const setPage = (value: number) => {
    currentPage.value = value
  }

  const onPageChange = async (value: number) => {
    currentPage.value = value
    await options.onPageChange?.(value)
  }

  const sortColumn = (columnName: string | null) => {
    const roleSort = ['asc', 'desc', '']

    if (columnName) {
      if (sortColumnName.value !== columnName) sortBy.value = ''
      sortColumnName.value = columnName

      const indexSort = roleSort.findIndex((item) => item === sortBy.value)
      if (indexSort === -1) return
      sortBy.value = indexSort + 1 === roleSort.length ? roleSort[0] : roleSort[indexSort + 1]
    }
  }

  const resetSort = () => {
    sortBy.value = ''
    sortColumnName.value = ''
  }

  return {
    currentPage,
    pageSize,
    list,
    totalItems,
    rowNumber,
    setPage,
    onPageChange,
    sortColumn,
    sortBy,
    sortColumnName,
    resetSort,
  }
}
