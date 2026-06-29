export const normalizeGrNo = (value: string | null | undefined) =>
  String(value || '').trim().toUpperCase()

/** Extract GR document number from free text (invoice / reference OCR). */
export const extractGrFromText = (value: string | null | undefined): string => {
  const normalized = normalizeGrNo(value)
  if (!normalized) return ''

  const direct = normalized.replace(/\s+/g, '')
  if (/^GR[0-9A-Z-]{4,}$/.test(direct)) return direct

  const match = normalized.match(/\bGR[0-9A-Z-]{4,}\b/)
  return match?.[0]?.replace(/\s+/g, '') || ''
}

export const extractGrFromUnknown = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') {
    return extractGrFromText(String(value))
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const gr = extractGrFromUnknown(item)
      if (gr) return gr
    }
    return ''
  }
  if (typeof value === 'object') {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      const gr = extractGrFromUnknown(nested)
      if (gr) return gr
    }
  }
  return ''
}
