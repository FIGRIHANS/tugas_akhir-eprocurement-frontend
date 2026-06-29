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
