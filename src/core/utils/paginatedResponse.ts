export interface ParsedPaginatedList<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

const readNumber = (value: unknown): number | null => {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const readItemsArray = (source: Record<string, unknown>): unknown[] => {
  if (Array.isArray(source.items)) return source.items
  if (Array.isArray(source.Items)) return source.Items
  if (Array.isArray(source.data)) return source.data
  if (Array.isArray(source.records)) return source.records
  return []
}

const readTotal = (source: Record<string, unknown>, itemsLength: number): number => {
  const total =
    readNumber(source.total) ??
    readNumber(source.Total) ??
    readNumber(source.totalCount) ??
    readNumber(source.TotalCount) ??
    readNumber(source.totalRecords) ??
    readNumber(source.TotalRecords) ??
    readNumber(source.count) ??
    readNumber(source.Count)

  return total ?? itemsLength
}

export const parsePaginatedListResponse = <T>(
  rawContent: unknown,
  fallbackPage = 1,
  fallbackPageSize = 10,
): ParsedPaginatedList<T> => {
  if (!rawContent) {
    return { items: [], total: 0, page: fallbackPage, pageSize: fallbackPageSize }
  }

  if (typeof rawContent === 'string') {
    try {
      return parsePaginatedListResponse<T>(JSON.parse(rawContent), fallbackPage, fallbackPageSize)
    } catch {
      return { items: [], total: 0, page: fallbackPage, pageSize: fallbackPageSize }
    }
  }

  if (Array.isArray(rawContent)) {
    return {
      items: rawContent as T[],
      total: rawContent.length,
      page: fallbackPage,
      pageSize: fallbackPageSize,
    }
  }

  if (typeof rawContent !== 'object') {
    return { items: [], total: 0, page: fallbackPage, pageSize: fallbackPageSize }
  }

  const content = rawContent as Record<string, unknown>
  const items = readItemsArray(content) as T[]
  const total = readTotal(content, items.length)
  const page = readNumber(content.page) ?? readNumber(content.Page) ?? fallbackPage
  const pageSize = readNumber(content.pageSize) ?? readNumber(content.PageSize) ?? fallbackPageSize

  return { items, total, page, pageSize }
}

export const extractInvoiceApiResultContent = (response: unknown): unknown => {
  if (!response || typeof response !== 'object') return null

  const root = response as Record<string, unknown>
  const body = (root.data ?? root) as Record<string, unknown>
  const result = (body.result ?? body.Result) as Record<string, unknown> | undefined

  if (!result) return body.content ?? body.Content ?? null

  return result.content ?? result.Content ?? null
}

export const applyPageWindow = <T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): { items: T[]; total: number } => {
  if (items.length <= pageSize) {
    return { items, total }
  }

  const resolvedTotal = Math.max(total, items.length)
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: resolvedTotal,
  }
}
