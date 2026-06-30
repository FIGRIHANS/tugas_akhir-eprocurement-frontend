export type PoGrLineKeySource = {
  id?: string | number | null
  poNo?: string | number | null
  poItem?: string | number | null
  grDocumentNo?: string | null
  grDocumentItem?: string | number | null
  taxCode?: string | null
  conditionType?: string | null
  whtType?: string | null
  whtCode?: string | null
  department?: string | null
  itemAmountLC?: string | number | null
  itemAmount?: string | number | null
}

export function isMeaningfulPoGrRow(row: PoGrLineKeySource | null | undefined): boolean {
  if (!row) return false
  if (Number(row.id) > 0) return true

  return !!(
    String(row.poNo ?? '').trim() ||
    row.taxCode ||
    row.conditionType ||
    row.whtType ||
    row.whtCode ||
    row.department ||
    Number(row.itemAmountLC) > 0 ||
    Number(row.itemAmount) > 0
  )
}

/** FTP/OCR seed row: only GR Document No. filled, no PO line data yet. */
export function isPlaceholderPoGrRow(row: PoGrLineKeySource | null | undefined): boolean {
  if (!row) return false
  if (Number(row.id) > 0) return false
  if (!String(row.grDocumentNo ?? '').trim()) return false
  return !isMeaningfulPoGrRow(row)
}

export function hasOnlyPlaceholderPoGrRows(rows: PoGrLineKeySource[] | null | undefined): boolean {
  if (!rows?.length) return false
  return rows.every(isPlaceholderPoGrRow)
}

export function hasMeaningfulPoGrRows(rows: PoGrLineKeySource[] | null | undefined): boolean {
  if (!rows?.length) return false
  return rows.some(isMeaningfulPoGrRow)
}

/** Row is display-ready (PO + GR + amount). poNo-only stubs must still be auto-filled. */
export function hasCompletePoGrLines(rows: PoGrLineKeySource[] | null | undefined): boolean {
  if (!rows?.length) return false

  return rows.some((row) => {
    if (Number(row.id) > 0) return true

    const hasPo = String(row.poNo ?? '').trim().length > 0
    const hasGr = String(row.grDocumentNo ?? '').trim().length > 0
    const hasAmount = Number(row.itemAmountLC ?? row.itemAmount ?? 0) > 0

    return hasPo && hasGr && hasAmount
  })
}

export function getPoGrLineKey(row: PoGrLineKeySource): string {
  return [
    String(row.poNo ?? '').trim(),
    String(row.poItem ?? '').trim(),
    String(row.grDocumentNo ?? '').trim(),
    String(row.grDocumentItem ?? '').trim(),
  ].join('|')
}

export function dedupePoGrLines<T extends PoGrLineKeySource>(rows: T[]): T[] {
  const seen = new Set<string>()
  return rows.filter((row) => {
    const key = getPoGrLineKey(row)
    if (!key.replace(/\|/g, '')) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
