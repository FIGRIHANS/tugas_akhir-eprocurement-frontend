export type PoGrLineKeySource = {
  poNo?: string | number | null
  poItem?: string | number | null
  grDocumentNo?: string | null
  grDocumentItem?: string | number | null
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
