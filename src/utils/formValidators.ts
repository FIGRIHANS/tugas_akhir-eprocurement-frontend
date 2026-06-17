import { nextTick } from 'vue'

/** Returns today's date as YYYY-MM-DD in local timezone */
export function getTodayDateString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isDateBeforeToday(dateStr: string): boolean {
  if (!dateStr?.trim()) return false
  return dateStr.split('T')[0] < getTodayDateString()
}

export function isDateAfterToday(dateStr: string): boolean {
  if (!dateStr?.trim()) return false
  return dateStr.split('T')[0] > getTodayDateString()
}

export function isDateTimeBeforeToday(dateTimeStr: string): boolean {
  if (!dateTimeStr?.trim()) return false
  return dateTimeStr.split('T')[0] < getTodayDateString()
}

export function normalizeNonNegativeInt(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

export function getReceivingShortage(qtyDn: number, qtyReceived: number): number {
  const shortage = normalizeNonNegativeInt(qtyDn) - normalizeNonNegativeInt(qtyReceived)
  return shortage > 0 ? shortage : 0
}

export interface FormValidationResult {
  valid: boolean
  message?: string
  focusKey?: string
}

export function validationOk(): FormValidationResult {
  return { valid: true }
}

export function validationFail(message: string, focusKey?: string): FormValidationResult {
  return { valid: false, message, focusKey }
}

/** True when value is null, empty, or whitespace-only */
export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0
}

/** Parse API/ISO date string to local YYYY-MM-DD (avoids UTC timezone shift) */
export function toLocalDateString(value?: string | null): string {
  if (!value?.trim()) return ''

  const dateOnly = value.split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly) && !value.includes('T') && !value.includes(' ')) {
    return dateOnly
  }

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return dateOnly

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function focusValidationField(focusKey?: string): Promise<void> {
  if (!focusKey) return

  await nextTick()

  const el = document.querySelector<HTMLElement>(`[data-focus-key="${focusKey}"]`)
  if (!el) return

  const focusable = el.matches('input, textarea, select, button, [tabindex]')
    ? el
    : el.querySelector<HTMLElement>('input, textarea, select, button, [tabindex]')

  if (focusable) {
    focusable.focus({ preventScroll: false })
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export interface QuantityValidationResult {
  valid: boolean
  message?: string
}

export function validateQtyShipped(
  qtyShipped: number,
  qtyOrdered: number,
  requirePositive = true,
): QuantityValidationResult {
  const shipped = Number(qtyShipped)

  if (!Number.isFinite(shipped) || shipped < 0) {
    return { valid: false, message: 'Qty Shipped tidak boleh bernilai negatif.' }
  }

  if (requirePositive && shipped <= 0) {
    return { valid: false, message: 'Qty Shipped wajib diisi.' }
  }

  if (qtyOrdered > 0 && shipped > qtyOrdered) {
    return { valid: false, message: 'Qty Shipped tidak boleh melebihi Qty Ordered.' }
  }

  return { valid: true }
}

export function validateReceivingItemQuantities(
  qtyDn: number,
  qtyReceived: number,
  damageQty: number,
  repackQty: number,
): QuantityValidationResult {
  const received = normalizeNonNegativeInt(qtyReceived)
  const dn = normalizeNonNegativeInt(qtyDn)
  const damaged = normalizeNonNegativeInt(damageQty)
  const repack = normalizeNonNegativeInt(repackQty)

  if (Number(qtyReceived) < 0 || !Number.isFinite(Number(qtyReceived))) {
    return { valid: false, message: 'Qty Received tidak boleh bernilai negatif.' }
  }

  if (damaged < 0 || !Number.isFinite(Number(damageQty))) {
    return { valid: false, message: 'Damage Qty tidak boleh bernilai negatif.' }
  }

  if (repack < 0 || !Number.isFinite(Number(repackQty))) {
    return { valid: false, message: 'Repack Qty tidak boleh bernilai negatif.' }
  }

  if (received > dn) {
    return { valid: false, message: 'Qty Received tidak boleh melebihi Qty Delivery Note.' }
  }

  const shortage = getReceivingShortage(dn, received)

  if (damaged > shortage) {
    return { valid: false, message: 'Damage Qty tidak boleh melebihi selisih quantity.' }
  }

  if (repack > shortage) {
    return { valid: false, message: 'Repack Qty tidak boleh melebihi selisih quantity.' }
  }

  if (damaged + repack > shortage) {
    return {
      valid: false,
      message: 'Total Damaged Qty dan Repack Qty tidak boleh melebihi selisih quantity.',
    }
  }

  return { valid: true }
}
